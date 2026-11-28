/**
 * 页面交互 —— cyrene.icu
 * ---------------------------------------------------------------------------
 * 这个页面有一块可切换的时间面板、一个音乐播放器、计时说明弹窗，
 * 以及语言 / 深浅色 / 全屏三个工具入口。
 * 所有时间都以显式 CST（UTC+8）计算，不依赖访客设备的本地时区。
 *
 * 依赖：js/translation.js 暴露的 window.TranslationManager
 */
(function () {
    'use strict';

    /* =========================================================================
       常量
       ====================================================================== */

    /** 5.5 版本期间的目标时刻：2027-09-03 09:03 CST（显式 +08:00） */
    const COUNTDOWN_TARGET = new Date('2027-09-03T09:03:00+08:00');

    /** 正计时起点：2026-11-12 11:12 CST（显式 +08:00） */
    const COUNT_UP_START = new Date('2026-11-12T11:12:00+08:00');

    /** 展示与计算统一使用中国标准时间 */
    const TIME_ZONE = 'Asia/Shanghai';

    const MODE_COUNTDOWN = 'countdown';
    const MODE_COUNT_UP = 'countup';
    const DEFAULT_MODE = MODE_COUNTDOWN;

    const COUNTDOWN_INTERVAL = 1000;
    const SECONDS_PER_DAY = 86400;

    const UNIT_IDS = ['days', 'hours', 'minutes', 'seconds'];

    /** 三首背景音乐；name 是曲名缺失时的兜底，正常显示走 translation.js */
    const AUDIO_TRACKS = [
        { id: 'remembrance-audio', name: '心忆' },
        { id: 'reverie-audio', name: '昔涟' },
        { id: 'withyou-audio', name: '再度和你' }
    ];

    const PLAY_MODES = ['list', 'single', 'shuffle'];
    const PLAY_MODE_STORAGE_KEY = 'audioPlayMode';

    /** 背景图库：清单由 scripts/build-backgrounds.mjs 扫描 img/bg/ 生成 */
    const BACKGROUND_MANIFEST = '/img/bg/manifest.json';
    const DEFAULT_BACKGROUND = 'philia093.webp';
    const BACKGROUND_STORAGE_KEY = 'background';
    const BACKGROUND_EXTENSIONS = /\.(?:avif|jpe?g|png|webp)$/i;

    /** 与 css/styles.css 中 .bg-layer 的 opacity 过渡时长保持一致 */
    const BACKGROUND_FADE_MS = 550;

    /** 暂停时叠加在音符图标上的斜线（viewBox 0 0 1024 1024） */
    const MUTE_SLASH_PATH = 'M768 128L128 864';

    /* =========================================================================
       小工具
       ====================================================================== */

    /** @type {TranslationManager|null} */
    let translationManager = null;

    /** 当前显示模式 */
    let currentMode = DEFAULT_MODE;

    /** 说明文字所处的阶段（倒计时/已抵达、正计时/尚未开始），用于在跨越目标时刻时刷新 */
    let lastSubState = null;

    /** 取文案；翻译模块尚未就绪时返回空串，不会抛错 */
    function t(key, subKey) {
        return translationManager ? translationManager.t(key, subKey) : '';
    }

    function byId(id) {
        return document.getElementById(id);
    }

    function pad(value, length) {
        return String(value).padStart(length, '0');
    }

    function noop() {}

    /**
     * 把时刻格式化为「2027年9月3日 09:03」/「September 3, 2027 09:03」。
     * 无论访客在哪个时区，都按 Asia/Shanghai 渲染。
     */
    function formatMoment(date) {
        const locale = translationManager && translationManager.currentLang === 'en' ? 'en-US' : 'zh-CN';

        try {
            const datePart = new Intl.DateTimeFormat(locale, {
                timeZone: TIME_ZONE,
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }).format(date);

            const timePart = new Intl.DateTimeFormat(locale, {
                timeZone: TIME_ZONE,
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                hourCycle: 'h23'
            }).format(date);

            return datePart + ' ' + timePart;
        } catch (error) {
            // 极老旧的浏览器缺少 Intl 时区数据时，退回一个不会误导人的写法
            return date.toISOString();
        }
    }

    /* =========================================================================
       倒计时 / 正计时
       ====================================================================== */

    /**
     * 按当前模式计算剩余的毫秒数。
     * 倒计时：目标 - 现在；正计时：现在 - 起点。结果不小于 0。
     */
    function elapsedMilliseconds() {
        const now = Date.now();
        const raw = currentMode === MODE_COUNT_UP
            ? now - COUNT_UP_START.getTime()
            : COUNTDOWN_TARGET.getTime() - now;
        return Math.max(0, raw);
    }

    /** 说明文字：随模式与语言变化，{time} 用 CST 时间填充 */
    function buildSubText() {
        const isCountUp = currentMode === MODE_COUNT_UP;
        const anchor = isCountUp ? COUNT_UP_START : COUNTDOWN_TARGET;
        const time = formatMoment(anchor);
        const now = Date.now();

        let template;
        if (isCountUp) {
            template = now < COUNT_UP_START.getTime() ? t('subCountUpPending') : t('subCountUp');
        } else {
            template = now >= COUNTDOWN_TARGET.getTime() ? t('subCountdownArrived') : t('subCountdown');
        }

        return String(template || '').replace('{time}', time);
    }

    /** 说明文字的阶段标识：跨过目标时刻后要换一种说法 */
    function subStateKey() {
        const now = Date.now();

        if (currentMode === MODE_COUNT_UP) {
            return now < COUNT_UP_START.getTime() ? 'countup-pending' : 'countup';
        }
        return now >= COUNTDOWN_TARGET.getTime() ? 'countdown-arrived' : 'countdown';
    }

    /** 页面只显示一行题记，随倒计时 / 正计时切换 */
    function titleLines() {
        const quote = t('modeQuote', currentMode);
        return quote ? [quote] : [];
    }

    /** 页面题记写入 h1；浏览器标签页保持最初的完整标题 */
    function renderTitle() {
        const lines = titleLines();
        const title = t('pageTitle') || lines[0] || '';

        document.querySelectorAll('#countdownTitle .title-line').forEach(function (element) {
            element.textContent = lines[0] || '';
        });

        document.title = title;
    }

    function updateSubText() {
        const element = byId('countdownSubText');
        if (!element) {
            return;
        }

        element.textContent = buildSubText();
        lastSubState = subStateKey();
    }

    /** 重绘四位数字（天 / 时 / 分 / 秒） */
    function tick() {
        const totalSeconds = Math.floor(elapsedMilliseconds() / 1000);

        const days = Math.floor(totalSeconds / SECONDS_PER_DAY);
        const hours = Math.floor((totalSeconds % SECONDS_PER_DAY) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const values = [pad(days, 3), pad(hours, 2), pad(minutes, 2), pad(seconds, 2)];

        UNIT_IDS.forEach(function (id, index) {
            const element = byId(id);
            if (element) {
                element.textContent = values[index];
            }
        });

        // 只有跨过目标时刻（倒计时归零 / 正计时起点）时才重写说明文字
        if (subStateKey() !== lastSubState) {
            updateSubText();
        }
    }

    /** 切换模式：同时更新按钮状态、面板属性与说明文字 */
    function setMode(mode) {
        currentMode = mode === MODE_COUNT_UP ? MODE_COUNT_UP : MODE_COUNTDOWN;

        document.querySelectorAll('.mode-btn').forEach(function (button) {
            const active = button.dataset.mode === currentMode;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        });

        const panel = byId('countdownPanel');
        if (panel) {
            panel.dataset.mode = currentMode;
        }

        renderTitle();
        updateSubText();
        tick();

        const dialog = byId('timeInfoDialog');
        if (dialog && dialog.open) {
            renderTimeInfo();
        }
    }

    function initCountdown() {
        document.querySelectorAll('.mode-btn').forEach(function (button) {
            button.addEventListener('click', function () {
                setMode(button.dataset.mode);
            });
        });

        // 从后台切回前台时立即校正，避免显示的秒数停在上一次计时
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                tick();
            }
        });

        // 语言切换后主标题与说明文字都需要重新拼接（时间格式化也跟着语言走）
        document.addEventListener('languagechange', function () {
            renderTitle();
            updateSubText();
        });

        window.setInterval(tick, COUNTDOWN_INTERVAL);
        setMode(DEFAULT_MODE);
    }

    /* =========================================================================
       计时说明弹窗
       ====================================================================== */

    /** 按当前模式把标题与说明写进弹窗 */
    function renderTimeInfo() {
        const title = byId('timeInfoTitle');
        const body = byId('timeInfoBody');
        if (!title || !body) {
            return;
        }

        const isCountUp = currentMode === MODE_COUNT_UP;
        title.textContent = t(isCountUp ? 'timeInfoTitleCountUp' : 'timeInfoTitleCountdown');
        body.innerHTML = t(isCountUp ? 'timeInfoCountUp' : 'timeInfoCountdown');
    }

    function initTimeInfo() {
        const toggle = byId('timeInfoToggle');
        const dialog = byId('timeInfoDialog');
        const closeButton = byId('timeInfoClose');

        if (!toggle || !dialog) {
            return;
        }

        function closeDialog() {
            if (typeof dialog.close === 'function' && dialog.open) {
                dialog.close();
                return;
            }
            dialog.removeAttribute('open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }

        function openDialog() {
            renderTimeInfo();

            if (typeof dialog.showModal === 'function') {
                if (!dialog.open) {
                    dialog.showModal();
                }
            } else {
                dialog.setAttribute('open', '');
            }

            toggle.setAttribute('aria-expanded', 'true');
        }

        toggle.addEventListener('click', openDialog);

        if (closeButton) {
            closeButton.addEventListener('click', closeDialog);
        }

        // 原生 dialog 的点击事件在遮罩上会以 dialog 自身为目标
        dialog.addEventListener('click', function (event) {
            if (event.target === dialog) {
                closeDialog();
            }
        });

        dialog.addEventListener('close', function () {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        });

        // 语言切换时，若弹窗正开着，立即重绘标题与说明
        document.addEventListener('languagechange', function () {
            if (dialog.open) {
                renderTimeInfo();
            }
        });
    }

    /* =========================================================================
       语言切换
       ====================================================================== */

    function initLanguageToggle() {
        const button = byId('langToggle');
        if (!button || !translationManager) {
            return;
        }

        button.addEventListener('click', function () {
            translationManager.toggleLanguage();
        });
    }

    /* =========================================================================
       全屏
       ====================================================================== */

    function initFullscreen() {
        const button = byId('fullscreenToggle');
        const root = document.documentElement;

        if (!button) {
            return;
        }

        // iPhone 等不支持元素全屏的环境：直接隐藏按钮，不做假动作
        if (typeof root.requestFullscreen !== 'function') {
            button.hidden = true;
            return;
        }

        function isActive() {
            return Boolean(document.fullscreenElement);
        }

        function renderLabel() {
            const active = isActive();
            const label = t(active ? 'fullscreenExit' : 'fullscreenEnter');

            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
            button.setAttribute('title', label);
            button.setAttribute('aria-label', label);
        }

        button.addEventListener('click', function () {
            if (isActive()) {
                document.exitFullscreen().catch(noop);
            } else {
                root.requestFullscreen().catch(noop);
            }
        });

        document.addEventListener('fullscreenchange', renderLabel);
        document.addEventListener('languagechange', renderLabel);
        renderLabel();
    }

    /* =========================================================================
       音乐播放器
       ====================================================================== */

    function initAudioPlayer() {
        const player = byId('audioPlayer');
        const toggle = byId('audioToggle');
        const panel = byId('audioPanel');
        const closeButton = byId('audioClose');
        const playPauseButton = byId('audioPlayPause');
        const modeButton = byId('audioModeBtn');
        const trackList = byId('audioTrackList');
        const nowPlaying = byId('audioNowPlaying');
        const icon = byId('audioIcon');
        const number = byId('audioNumber');

        if (!player || !toggle || !panel) {
            return;
        }

        /** 当前曲目下标；-1 表示还没选过曲目 */
        let currentIndex = -1;
        /** @type {HTMLAudioElement|null} */
        let activeAudio = null;
        let playMode = readPlayMode();

        function readPlayMode() {
            try {
                const stored = window.localStorage.getItem(PLAY_MODE_STORAGE_KEY);
                if (stored && PLAY_MODES.indexOf(stored) !== -1) {
                    return stored;
                }
            } catch (error) {
                // localStorage 不可用时用默认模式
            }
            return PLAY_MODES[0];
        }

        function savePlayMode() {
            try {
                window.localStorage.setItem(PLAY_MODE_STORAGE_KEY, playMode);
            } catch (error) {
                // 同上，忽略写入失败
            }
        }

        function allAudios() {
            return AUDIO_TRACKS
                .map(function (track) { return byId(track.id); })
                .filter(Boolean);
        }

        function pauseAll() {
            allAudios().forEach(function (audio) {
                if (!audio.paused) {
                    audio.pause();
                }
            });
        }

        function trackName(index) {
            const names = t('audioTrackNames');
            if (Array.isArray(names) && names[index]) {
                return names[index];
            }
            return AUDIO_TRACKS[index] ? AUDIO_TRACKS[index].name : '';
        }

        /** 工具栏音符图标：播放中为纯音符，暂停时叠一道斜线 */
        function renderToolbarIcon(playing) {
            if (icon) {
                const overlay = icon.querySelector('.audio-icon-overlay');
                if (overlay) {
                    overlay.remove();
                }

                if (!playing) {
                    const slash = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    slash.setAttribute('class', 'audio-icon-overlay');
                    slash.setAttribute('d', MUTE_SLASH_PATH);
                    slash.setAttribute('fill', 'none');
                    slash.setAttribute('stroke', 'currentColor');
                    slash.setAttribute('stroke-width', '60');
                    slash.setAttribute('stroke-linecap', 'round');
                    icon.appendChild(slash);
                }
            }

            if (number) {
                if (currentIndex >= 0) {
                    number.textContent = String(currentIndex + 1);
                    number.classList.add('is-visible');
                } else {
                    number.classList.remove('is-visible');
                }
            }
        }

        /** 按钮、面板、曲目列表的全部状态同步 */
        function renderState() {
            const playing = Boolean(activeAudio) && !activeAudio.paused;

            if (playPauseButton) {
                playPauseButton.classList.toggle('is-playing', playing);
                playPauseButton.setAttribute('aria-label', t(playing ? 'audioPause' : 'audioPlay'));
            }

            if (nowPlaying) {
                nowPlaying.classList.toggle('is-playing', playing);
                nowPlaying.textContent = currentIndex >= 0
                    ? trackName(currentIndex)
                    : t('audioNothingPlaying');
            }

            if (trackList) {
                trackList.querySelectorAll('.audio-track').forEach(function (button) {
                    const index = Number(button.dataset.trackIndex);
                    const active = index === currentIndex;

                    button.classList.toggle('is-playing', active && playing);
                    button.setAttribute('aria-pressed', String(active));
                    button.setAttribute('aria-label', trackName(index));
                });
            }

            renderToolbarIcon(playing);
        }

        /** 当前语言的播放器文案 */
        function renderLabels() {
            const title = t('audioPanelTitle');

            if (panel) {
                panel.setAttribute('aria-label', title);
            }
            if (byId('audioPanelTitle')) {
                byId('audioPanelTitle').textContent = title;
            }
            if (toggle) {
                toggle.setAttribute('title', title);
                toggle.setAttribute('aria-label', title);
            }
            if (closeButton) {
                closeButton.setAttribute('aria-label', t('audioClose'));
            }
            if (modeButton) {
                const modes = t('audioModes');
                const label = Array.isArray(modes) ? modes[PLAY_MODES.indexOf(playMode)] : '';
                modeButton.textContent = label || '';
                modeButton.setAttribute('title', t('audioModeAria'));
                modeButton.setAttribute('aria-label', t('audioModeAria'));
            }
            if (trackList) {
                trackList.setAttribute('aria-label', t('audioTracksAria'));
            }
            if (trackList) {
                trackList.querySelectorAll('.audio-track').forEach(function (button) {
                    const index = Number(button.dataset.trackIndex);
                    const nameElement = button.querySelector('.audio-track-name');
                    if (nameElement) {
                        nameElement.textContent = trackName(index);
                    }
                });
            }

            renderState();
        }

        function nextIndex() {
            const count = AUDIO_TRACKS.length;

            if (playMode === 'shuffle' && count > 1) {
                let next = currentIndex;
                while (next === currentIndex) {
                    next = Math.floor(Math.random() * count);
                }
                return next;
            }

            return (currentIndex + 1) % count;
        }

        function handleEnded() {
            if (playMode === 'single') {
                if (activeAudio) {
                    activeAudio.currentTime = 0;
                    activeAudio.play().catch(noop);
                }
                return;
            }

            playIndex(nextIndex());
        }

        /**
         * 播放第 index 首。
         * @param {number} index 曲目下标
         * @param {boolean} [restart] 是否从头播放（重新点同一首时用）
         */
        function playIndex(index, restart) {
            const track = AUDIO_TRACKS[index];
            if (!track) {
                return;
            }

            const audio = byId(track.id);
            if (!audio) {
                return;
            }

            pauseAll();

            const changed = index !== currentIndex;
            currentIndex = index;
            activeAudio = audio;

            if (changed || restart) {
                try {
                    audio.currentTime = 0;
                } catch (error) {
                    // 元数据尚未加载时赋 currentTime 可能抛错，播放会自动从头开始
                }
            }

            audio.loop = playMode === 'single';

            const promise = audio.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(renderState);
            }

            renderState();
        }

        function togglePlayback() {
            if (currentIndex < 0) {
                playIndex(0, true);
                return;
            }

            if (!activeAudio) {
                activeAudio = byId(AUDIO_TRACKS[currentIndex].id);
            }
            if (!activeAudio) {
                return;
            }

            if (activeAudio.paused) {
                const promise = activeAudio.play();
                if (promise && typeof promise.catch === 'function') {
                    promise.catch(renderState);
                }
            } else {
                activeAudio.pause();
            }

            renderState();
        }

        function setPanelOpen(open) {
            panel.hidden = !open;
            toggle.setAttribute('aria-expanded', String(open));
        }

        function applyMode(mode) {
            if (PLAY_MODES.indexOf(mode) === -1) {
                return;
            }

            playMode = mode;
            savePlayMode();

            allAudios().forEach(function (audio) {
                audio.loop = playMode === 'single';
            });

            renderLabels();
        }

        toggle.addEventListener('click', function () {
            setPanelOpen(panel.hidden);
        });

        if (closeButton) {
            closeButton.addEventListener('click', function () {
                setPanelOpen(false);
                toggle.focus();
            });
        }

        if (playPauseButton) {
            playPauseButton.addEventListener('click', togglePlayback);
        }

        if (modeButton) {
            modeButton.addEventListener('click', function () {
                const next = (PLAY_MODES.indexOf(playMode) + 1) % PLAY_MODES.length;
                applyMode(PLAY_MODES[next]);
            });
        }

        if (trackList) {
            trackList.addEventListener('click', function (event) {
                const button = event.target.closest('.audio-track');
                if (!button) {
                    return;
                }

                const index = Number(button.dataset.trackIndex);
                if (index === currentIndex) {
                    togglePlayback();
                } else {
                    playIndex(index, true);
                }
            });
        }

        // 点击面板外部收起
        document.addEventListener('click', function (event) {
            if (panel.hidden) {
                return;
            }
            if (!player.contains(event.target)) {
                setPanelOpen(false);
            }
        });

        // Esc 收起并回到触发按钮
        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape' || panel.hidden) {
                return;
            }
            setPanelOpen(false);
            toggle.focus();
        });

        allAudios().forEach(function (audio) {
            audio.loop = playMode === 'single';
            audio.addEventListener('play', renderState);
            audio.addEventListener('pause', renderState);
            audio.addEventListener('ended', handleEnded);
        });

        document.addEventListener('languagechange', renderLabels);

        renderLabels();
    }

    /* =========================================================================
       深浅色主题
       ====================================================================== */

    const THEME_STORAGE_KEY = 'theme';
    const THEMES = ['light', 'dark'];

    /** 当前主题；HTML 上的 data-theme 由页首内联脚本先写好，避免闪烁 */
    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch (error) {
            // 隐私模式下写入失败不影响本次切换
        }
    }

    /** 同步按钮图标文案（图标本身由 CSS 按 data-theme 切换）与浏览器主题色 */
    function updateThemeButton() {
        const button = byId('themeToggle');
        if (!button) {
            return;
        }

        const dark = currentTheme() === 'dark';
        const actionLabel = t(dark ? 'themeToLight' : 'themeToDark');
        const stateLabel = t('themeToggle');

        button.setAttribute('aria-pressed', dark ? 'true' : 'false');
        if (actionLabel) {
            button.setAttribute('title', actionLabel);
        }
        if (stateLabel) {
            // aria-label 保持稳定的状态名（深色模式），按压状态由 aria-pressed 表达
            button.setAttribute('aria-label', stateLabel);
        }

        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) {
            themeColor.setAttribute('content', dark ? '#2a0d1b' : '#4a2333');
        }
    }

    function applyTheme(theme, persist) {
        const next = THEMES.indexOf(theme) !== -1 ? theme : 'light';
        document.documentElement.setAttribute('data-theme', next);
        if (persist) {
            saveTheme(next);
        }
        updateThemeButton();
    }

    function initTheme() {
        // 若 localStorage 不可用或存了非法值，页首脚本会保留 HTML 的 light，这里再兜底一次
        document.documentElement.setAttribute('data-theme', currentTheme());
        updateThemeButton();

        const button = byId('themeToggle');
        if (button) {
            button.addEventListener('click', function () {
                applyTheme(currentTheme() === 'dark' ? 'light' : 'dark', true);
            });
        }

        // 语言改变后按钮的 title/aria-label 要跟着换
        document.addEventListener('languagechange', updateThemeButton);
    }

    /* =========================================================================
       开场：压暗背景与打字机标题
       ====================================================================== */

    const INTRO_START_DELAY = 380;
    const INTRO_HOLD_AFTER_TYPING = 720;
    const INTRO_REDUCED_HOLD = 650;
    /** 打字速度倍率：0.6 表示比原来的基准速度慢 40% */
    const INTRO_SPEED = 0.6;

    /** 开场是否已经结束，避免点击、按键与定时器重复触发 */
    let introFinished = false;

    /** @type {number|null} */
    let introTimer = null;

    /** 取当前语言 + 当前模式的两行标题，用换行连接；translation 模块异常时返回空串 */
    function introTitleText() {
        const lines = t('introTitle');
        if (Array.isArray(lines) && lines.length) {
            return lines.join('\n');
        }
        return titleLines().join('\n');
    }

    function prefersReducedMotion() {
        return typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /** 舞台就位：控件淡入，压暗层淡出 */
    function revealStage() {
        const root = document.documentElement;
        const intro = byId('intro');

        root.classList.add('is-revealing');
        if (intro) {
            intro.classList.add('is-leaving');
        }

        window.setTimeout(function () {
            root.classList.remove('is-intro', 'is-revealing');
            if (intro) {
                intro.hidden = true;
            }
        }, 960);
    }

    function finishIntro() {
        if (introFinished) {
            return;
        }
        introFinished = true;

        if (introTimer !== null) {
            window.clearTimeout(introTimer);
            introTimer = null;
        }

        const title = byId('introTitle');
        const full = introTitleText();
        if (title && full) {
            title.textContent = full;
        }

        revealStage();
    }

    function initIntro() {
        const intro = byId('intro');
        const title = byId('introTitle');
        if (!intro || !title) {
            revealStage();
            return;
        }

        const full = introTitleText();
        if (!full) {
            finishIntro();
            return;
        }

        // 减少动态效果时直接给出完整标题，短暂停留后进入主界面
        if (prefersReducedMotion()) {
            title.textContent = full;
            introTimer = window.setTimeout(finishIntro, INTRO_REDUCED_HOLD);
            return;
        }

        // 英文标题更长，按字数把总时长压到 3 秒左右；中文保持约 76ms/字。
        // 再除以 INTRO_SPEED，得到用户要求的 0.6 倍速。
        const charDelay = Math.max(32, Math.min(76, 2800 / full.length)) / INTRO_SPEED;
        let index = 0;

        function typeNext() {
            if (index >= full.length) {
                introTimer = window.setTimeout(finishIntro, INTRO_HOLD_AFTER_TYPING);
                return;
            }

            index += 1;
            title.textContent = full.slice(0, index);

            const char = full.charAt(index - 1);
            let delay = charDelay;
            if (char === '，' || char === '。' || char === '、') {
                delay += 120 / INTRO_SPEED;
            }

            introTimer = window.setTimeout(typeNext, delay);
        }

        // 点击或按键可以跳过；跳过时把标题一次性补全
        intro.addEventListener('click', finishIntro);
        document.addEventListener('keydown', function (event) {
            if (introFinished) {
                return;
            }
            if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
                event.preventDefault();
                finishIntro();
            }
        });

        introTimer = window.setTimeout(typeNext, INTRO_START_DELAY);
    }

    /* =========================================================================
       背景图库
       ====================================================================== */

    /** 从路径里取文件名，兼容绝对 / 相对 src */
    function backgroundFileName(src) {
        if (!src) {
            return '';
        }
        try {
            const path = new URL(src, document.baseURI).pathname;
            return decodeURIComponent(path.split('/').pop() || '');
        } catch (error) {
            return src.split('/').pop() || '';
        }
    }

    /** 只接受 img/bg/ 下的普通文件名，避免清单里混进 ../ 之类的路径 */
    function isBackgroundFile(file) {
        return typeof file === 'string' &&
            file.length > 0 &&
            file.length <= 160 &&
            file.indexOf('/') === -1 &&
            file.indexOf('\\') === -1 &&
            BACKGROUND_EXTENSIONS.test(file);
    }

    function initPageBackground() {
        const container = document.querySelector('.page-background');
        if (!container) {
            return;
        }

        const layers = Array.prototype.slice.call(container.querySelectorAll('.bg-layer'));
        if (!layers.length) {
            return;
        }

        let activeLayer = layers.filter(function (image) {
            return image.classList.contains('is-active');
        })[0] || layers[0];
        activeLayer.classList.add('is-active');

        let currentFile = backgroundFileName(activeLayer.getAttribute('src')) || DEFAULT_BACKGROUND;
        let backgrounds = [];
        let listRendered = false;
        let panelOpen = false;
        let switchToken = 0;

        const toggle = byId('bgToggle');
        const panel = byId('bgPanel');
        const closeButton = byId('bgClose');
        const list = byId('bgList');
        const empty = byId('bgEmpty');

        function backgroundSource(file) {
            return '/img/bg/' + encodeURIComponent(file);
        }

        function markFailed(image) {
            if (image === activeLayer) {
                container.classList.add('is-failed');
                console.warn('[background] 背景图加载失败，已回退到纯色背景。');
            }
        }

        // 首屏图片加载失败时保留原有的纯色兜底
        if (activeLayer.complete && activeLayer.naturalWidth === 0) {
            markFailed(activeLayer);
        } else {
            activeLayer.addEventListener('error', function () {
                markFailed(activeLayer);
            }, { once: true });
        }

        activeLayer.addEventListener('load', function () {
            container.classList.remove('is-failed');
        });

        function readStoredBackground() {
            try {
                return window.localStorage.getItem(BACKGROUND_STORAGE_KEY) || '';
            } catch (error) {
                return '';
            }
        }

        function storeBackground(file) {
            try {
                window.localStorage.setItem(BACKGROUND_STORAGE_KEY, file);
            } catch (error) {
                // 隐私模式下写入失败不影响本次切换
            }
        }

        function updateSelection(file) {
            if (!list) {
                return;
            }
            list.querySelectorAll('.bg-thumb').forEach(function (button) {
                button.setAttribute('aria-pressed', String(button.dataset.file === file));
            });
        }

        /**
         * 交叉淡入：等新图解码完成后再切换 is-active，旧图在新图淡入结束后退场。
         * 快速连点时用 token 作废较早的回调，避免两层状态互相打架。
         */
        function showBackground(file, options) {
            const settings = options || {};

            if (file === currentFile) {
                if (typeof settings.onShown === 'function') {
                    settings.onShown();
                }
                return;
            }

            const token = ++switchToken;
            const outgoing = activeLayer;
            const incoming = layers.filter(function (image) {
                return image !== outgoing;
            })[0];

            if (!incoming) {
                // HTML 固定两层，这里只是防御性兜底
                outgoing.src = backgroundSource(file);
                currentFile = file;
                if (typeof settings.onShown === 'function') {
                    settings.onShown();
                }
                return;
            }

            // 上一次淡入尚未收尾时，先把它残留的旧层清掉
            layers.forEach(function (image) {
                if (image !== outgoing) {
                    image.classList.remove('is-active');
                }
            });
            outgoing.style.zIndex = '1';
            incoming.classList.remove('is-active');
            incoming.style.zIndex = '';

            function reveal() {
                if (token !== switchToken) {
                    return;
                }

                incoming.style.zIndex = '2';
                incoming.classList.add('is-active');
                container.classList.remove('is-failed');
                activeLayer = incoming;
                currentFile = file;

                if (typeof settings.onShown === 'function') {
                    settings.onShown();
                }

                window.setTimeout(function () {
                    if (token !== switchToken) {
                        return;
                    }
                    outgoing.classList.remove('is-active');
                    // 保留两层的 z-index：旧图在新图下方淡出，若此时把 z-index 清空，
                    // DOM 中靠后的旧图会盖到新图上方，出现一次旧背景闪回。
                }, BACKGROUND_FADE_MS + 80);
            }

            function fail() {
                if (token !== switchToken) {
                    return;
                }
                console.warn('[background] 背景图加载失败：' + file);
                if (typeof settings.onError === 'function') {
                    settings.onError();
                }
            }

            incoming.onload = function () {
                incoming.onload = null;
                incoming.onerror = null;
                reveal();
            };
            incoming.onerror = function () {
                incoming.onload = null;
                incoming.onerror = null;
                fail();
            };
            incoming.src = backgroundSource(file);

            if (incoming.complete && incoming.naturalWidth > 0) {
                incoming.onload = null;
                incoming.onerror = null;
                window.requestAnimationFrame(reveal);
            } else if (incoming.complete && incoming.naturalWidth === 0) {
                incoming.onerror = null;
                fail();
            }
        }

        function parseManifest(data) {
            const raw = Array.isArray(data) ? data : (data && Array.isArray(data.backgrounds) ? data.backgrounds : []);
            const seen = Object.create(null);
            const items = [];

            raw.forEach(function (item) {
                const file = item && item.file;
                if (!isBackgroundFile(file) || seen[file]) {
                    return;
                }
                seen[file] = true;

                const label = item && typeof item.label === 'string' && item.label.trim()
                    ? item.label.trim()
                    : file.replace(BACKGROUND_EXTENSIONS, '').replace(/[_-]+/g, ' ');

                items.push({ file: file, label: label });
            });

            return items;
        }

        function renderList() {
            if (!list || !empty) {
                return;
            }

            list.textContent = '';

            backgrounds.forEach(function (background) {
                const item = document.createElement('li');
                const button = document.createElement('button');
                const frame = document.createElement('span');
                const image = document.createElement('img');

                button.type = 'button';
                button.className = 'bg-thumb';
                button.dataset.file = background.file;
                button.setAttribute('aria-pressed', String(background.file === currentFile));
                button.setAttribute('aria-label', background.label);

                frame.className = 'bg-thumb-frame';
                image.src = backgroundSource(background.file);
                image.alt = '';
                image.decoding = 'async';
                image.loading = 'lazy';

                frame.appendChild(image);
                button.appendChild(frame);
                button.addEventListener('click', function () {
                    selectBackground(background.file);
                });

                item.appendChild(button);
                list.appendChild(item);
            });

            list.hidden = backgrounds.length === 0;
            empty.hidden = backgrounds.length > 0;
            listRendered = true;
        }

        function selectBackground(file) {
            updateSelection(file);
            showBackground(file, {
                onShown: function () {
                    storeBackground(file);
                    updateSelection(file);
                },
                onError: function () {
                    updateSelection(currentFile);
                }
            });
            closePanel();
        }

        function onDocumentPointerDown(event) {
            if (!panel || !toggle) {
                return;
            }
            if (panel.contains(event.target) || toggle.contains(event.target)) {
                return;
            }
            closePanel();
        }

        function onDocumentKeyDown(event) {
            if (event.key === 'Escape') {
                event.preventDefault();
                closePanel();
            }
        }

        function openPanel() {
            if (!panel || !toggle || panelOpen) {
                return;
            }

            panelOpen = true;
            panel.hidden = false;
            toggle.setAttribute('aria-expanded', 'true');

            if (!listRendered) {
                renderList();
            }

            document.addEventListener('pointerdown', onDocumentPointerDown, true);
            document.addEventListener('keydown', onDocumentKeyDown);

            if (closeButton) {
                closeButton.focus({ preventScroll: true });
            }
        }

        function closePanel() {
            if (!panel || !toggle || !panelOpen) {
                return;
            }

            panelOpen = false;
            panel.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');

            document.removeEventListener('pointerdown', onDocumentPointerDown, true);
            document.removeEventListener('keydown', onDocumentKeyDown);

            toggle.focus({ preventScroll: true });
        }

        if (toggle && panel) {
            toggle.addEventListener('click', function () {
                if (panel.hidden) {
                    openPanel();
                } else {
                    closePanel();
                }
            });
        }

        if (closeButton) {
            closeButton.addEventListener('click', closePanel);
        }

        function loadBackgrounds() {
            return fetch(BACKGROUND_MANIFEST, { cache: 'no-cache' })
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error('HTTP ' + response.status);
                    }
                    return response.json();
                })
                .then(parseManifest)
                .catch(function (error) {
                    console.warn('[background] 无法读取背景清单，使用当前背景。', error);
                    return [];
                });
        }

        loadBackgrounds().then(function (items) {
            backgrounds = items;

            // 清单不可用时仍让面板显示当前背景，避免打开后一片空白
            if (!backgrounds.length) {
                backgrounds = [{
                    file: currentFile,
                    label: currentFile.replace(BACKGROUND_EXTENSIONS, '').replace(/[_-]+/g, ' ')
                }];
            }

            if (listRendered) {
                renderList();
            }

            const stored = readStoredBackground();
            const storedItem = backgrounds.filter(function (item) {
                return item.file === stored;
            })[0];

            if (storedItem && stored !== currentFile) {
                updateSelection(stored);
                showBackground(stored, {
                    onShown: function () {
                        updateSelection(stored);
                    },
                    onError: function () {
                        storeBackground(currentFile);
                        updateSelection(currentFile);
                    }
                });
            } else {
                if (stored && !storedItem) {
                    storeBackground(currentFile);
                }
                updateSelection(currentFile);
            }
        });
    }

    /* =========================================================================
       启动
       ====================================================================== */

    function init() {
        translationManager = new window.TranslationManager();
        window.translationManager = translationManager;

        // 主题在开场遮罩之前应用，避免工具栏在淡入时才换色
        initTheme();

        // 先启动开场，再做其余初始化；这样即使后面的模块出错，页面也不会一直停在压暗状态
        initIntro();

        initLanguageToggle();
        initCountdown();
        initTimeInfo();
        initFullscreen();
        initAudioPlayer();
        initPageBackground();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
