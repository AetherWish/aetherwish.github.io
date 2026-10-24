/**
 * 首页交互脚本 ——「记忆的幼芽」
 * ---------------------------------------------------------------------------
 * 职责（每项对应下面一个 init 函数）：
 *   1. 倒计时       —— 每秒刷新距目标时间的剩余量
 *   2. 语言切换     —— 委托给 translation.js 的 TranslationManager
 *   3. 背景音频     —— 音乐选择与播控面板（播放 / 暂停 / 选曲 / 播放模式）
 *   4. 全屏模式     —— 全屏 / 退出全屏，全屏时只保留倒计时与播放器按钮
 *   5. 返回顶部     —— 滚动超过阈值后显示浮动按钮
 *
 * 依赖：translation.js（需先于本文件加载）
 * 编码注意：本文件为无 BOM 的 UTF-8。
 */
(function () {
    'use strict';

    /* =========================================================================
       常量
       ====================================================================== */

    /** 返回顶部按钮的出现阈值（像素） */
    const BACK_TO_TOP_THRESHOLD = 50;

    /** 倒计时刷新间隔（毫秒） */
    const COUNTDOWN_INTERVAL = 1000;

    /** 倒计时四个数字块的 id，与「天 / 时 / 分 / 秒」顺序一致 */
    const COUNTDOWN_UNIT_IDS = ['days', 'hours', 'minutes', 'seconds'];

    /** 曲目表：顺序即面板中的显示顺序，id 对应页面里的 <audio> 元素。
        name 只是翻译管理器不可用时的兜底文案，实际显示名取自
        translation.js 的 audioTrackNames（随语言切换）。 */
    const AUDIO_TRACKS = [
        { id: 'remembrance-audio', name: '心忆' },
        { id: 'reverie-audio', name: '昔涟' },
        { id: 'withyou-audio', name: '再度和你' }
    ];

    /** 播放模式：顺序需与 translation.js 中 audioModes 数组一致 */
    const PLAY_MODES = ['list', 'single', 'shuffle'];

    /** 播放模式的本地存储键名 */
    const PLAY_MODE_STORAGE_KEY = 'audioPlayMode';

    /** 静音 / 暂停时叠加在喇叭图标上的斜线路径（viewBox 1024） */
    const MUTE_SLASH_PATH = 'M768 128L128 864';
    const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    /* =========================================================================
       小工具
       ====================================================================== */

    const byId = (id) => document.getElementById(id);

    /** 补零到两位，如 3 → "03" */
    const pad2 = (value) => String(value).padStart(2, '0');

    /* =========================================================================
       1. 倒计时
       ====================================================================== */

    /** 每个数字块的缓存引用，避免每秒重复查询 DOM */
    let countdownSlots = null;
    let countdownTimerId = null;

    function cacheCountdownSlots() {
        countdownSlots = COUNTDOWN_UNIT_IDS.map(byId);
    }

    /**
     * 把剩余毫秒数拆成「天 / 时 / 分 / 秒」并写入页面，同时同步主标题措辞。
     *
     * 目标时间来自 translation.js 的 TranslationManager.TARGET_DATE，
     * 这里不再重复定义日期。
     */
    function updateCountdown() {
        const manager = window.translationManager;
        if (!countdownSlots) {
            cacheCountdownSlots();
        }

        const targetTime = window.TranslationManager
            ? window.TranslationManager.TARGET_DATE.getTime()
            : 0;
        const remaining = targetTime - Date.now();

        if (remaining <= 0) {
            // 已到目标时间：全部归零，并切换到「已结束」文案
            countdownSlots.forEach((slot) => {
                if (slot) {
                    slot.textContent = '00';
                }
            });
            if (manager) {
                manager.updateCountdownMainText(-1);
            }
            return;
        }

        const values = [
            Math.floor(remaining / (1000 * 60 * 60 * 24)),
            Math.floor((remaining / (1000 * 60 * 60)) % 24),
            Math.floor((remaining / (1000 * 60)) % 60),
            Math.floor((remaining / 1000) % 60)
        ];

        countdownSlots.forEach((slot, index) => {
            if (slot) {
                slot.textContent = pad2(values[index]);
            }
        });

        // 主标题按剩余天数切档（需用未取整的天数，否则「不足一天」无法识别）
        if (manager) {
            manager.updateCountdownMainText(remaining / (1000 * 60 * 60 * 24));
        }
    }

    function initCountdown() {
        cacheCountdownSlots();

        // 语言切换需要立即重算主标题，这里把刷新函数交给管理器复用
        if (window.translationManager) {
            window.translationManager.refreshCountdownText = updateCountdown;
        }

        updateCountdown();
        countdownTimerId = window.setInterval(updateCountdown, COUNTDOWN_INTERVAL);
    }

    /* =========================================================================
       2. 语言切换
       ====================================================================== */

    function initLanguageToggle() {
        const button = byId('langToggle');
        if (!button || typeof window.TranslationManager !== 'function') {
            return;
        }

        window.translationManager = new window.TranslationManager();
        button.addEventListener('click', function () {
            window.translationManager.toggleLanguage();
        });
    }

    /* =========================================================================
       3. 背景音频（音乐选择与播控面板）
       ====================================================================== */

    function initAudioPlayer() {
        const root = byId('audioPlayer');
        const toggleButton = byId('audioToggle');
        const icon = byId('audioIcon');
        const numberBadge = byId('audioNumber');
        const panel = byId('audioPanel');
        const panelTitle = byId('audioPanelTitle');
        const closeButton = byId('audioClose');
        const playPauseButton = byId('audioPlayPause');
        const modeButton = byId('audioModeBtn');
        const nowPlaying = byId('audioNowPlaying');
        const trackList = byId('audioTrackList');
        const trackButtons = Array.prototype.slice.call(document.querySelectorAll('.audio-track'));
        const trackNameElements = trackButtons.map(function (button) {
            return button.querySelector('.audio-track-name');
        });
        const audios = AUDIO_TRACKS.map(function (track) {
            return byId(track.id);
        });

        // 缺少任一必需元素时直接跳过，避免抛出异常影响其它交互
        if (!root || !toggleButton || !icon || !numberBadge || !panel || !playPauseButton ||
            !modeButton || !nowPlaying || trackButtons.length !== AUDIO_TRACKS.length ||
            audios.some(function (audio) { return !audio; })) {
            return;
        }

        /** 当前曲目下标；-1 表示还没选过曲目 */
        let currentIndex = -1;
        /** 播放模式：list / single / shuffle */
        let mode = readMode();

        /* --- 模式持久化 --- */

        function readMode() {
            try {
                const stored = window.localStorage.getItem(PLAY_MODE_STORAGE_KEY);
                return PLAY_MODES.indexOf(stored) !== -1 ? stored : 'list';
            } catch (error) {
                return 'list'; // 隐私模式下 localStorage 不可用
            }
        }

        function saveMode() {
            try {
                window.localStorage.setItem(PLAY_MODE_STORAGE_KEY, mode);
            } catch (error) {
                // 写入失败不影响播放
            }
        }

        /* --- 文案：随语言切换刷新 --- */

        function t(key) {
            return window.translationManager ? window.translationManager.t(key) : '';
        }

        function modeLabel() {
            const labels = t('audioModes');
            const index = PLAY_MODES.indexOf(mode);
            return Array.isArray(labels) && labels[index] ? labels[index] : '';
        }

        /** 曲目显示名：中文设置显示中文名，英文设置显示英文名 */
        function trackName(index) {
            const names = t('audioTrackNames');
            if (Array.isArray(names) && names[index]) {
                return names[index];
            }
            return AUDIO_TRACKS[index] ? AUDIO_TRACKS[index].name : '';
        }

        function activeAudio() {
            return currentIndex >= 0 ? audios[currentIndex] : null;
        }

        function isPlaying() {
            const audio = activeAudio();
            return !!(audio && !audio.paused && !audio.ended);
        }

        /* --- 渲染 --- */

        /** 顶部按钮图标：未播放时叠加斜线；序号显示当前曲目 */
        function renderToolbarIcon(playing) {
            icon.querySelectorAll('.audio-icon-overlay').forEach(function (node) {
                node.remove();
            });

            if (!playing) {
                const slash = document.createElementNS(SVG_NAMESPACE, 'path');
                slash.setAttribute('d', MUTE_SLASH_PATH);
                slash.setAttribute('stroke', 'white');
                slash.setAttribute('stroke-width', '60');
                slash.setAttribute('stroke-linecap', 'round');
                slash.setAttribute('fill', 'none');
                slash.setAttribute('class', 'audio-icon-overlay');
                icon.appendChild(slash);
            }

            if (currentIndex >= 0) {
                numberBadge.textContent = String(currentIndex + 1);
                numberBadge.classList.add('is-visible');
            } else {
                numberBadge.classList.remove('is-visible');
            }
        }

        /** 同步按钮、面板与曲目列表的视觉状态 */
        function renderState() {
            const playing = isPlaying();

            renderToolbarIcon(playing);

            playPauseButton.classList.toggle('is-playing', playing);
            playPauseButton.setAttribute('aria-label', t(playing ? 'audioPause' : 'audioPlay'));

            nowPlaying.classList.toggle('is-playing', playing);
            nowPlaying.textContent = currentIndex >= 0
                ? trackName(currentIndex)
                : t('audioNothingPlaying');

            trackButtons.forEach(function (button, index) {
                const selected = index === currentIndex;
                button.setAttribute('aria-pressed', selected ? 'true' : 'false');
                button.classList.toggle('is-playing', selected && playing);
                button.setAttribute('aria-label', trackName(index));
            });
        }

        /** 语言切换后刷新面板内的所有动态文案 */
        function renderLabels() {
            panelTitle.textContent = t('audioPanelTitle');
            panel.setAttribute('aria-label', t('audioPanelTitle'));
            closeButton.setAttribute('aria-label', t('audioClose'));
            modeButton.textContent = modeLabel();
            modeButton.setAttribute('aria-label', t('audioModeAria'));
            trackList.setAttribute('aria-label', t('audioTracksAria'));
            trackNameElements.forEach(function (element, index) {
                if (element) {
                    element.textContent = trackName(index);
                }
            });
            toggleButton.setAttribute('aria-label', t('audioPanelTitle'));
            toggleButton.setAttribute('title', t('audioPanelTitle'));
            renderState();
        }

        /* --- 播放控制 --- */

        function pauseAll() {
            audios.forEach(function (audio) {
                audio.pause();
            });
        }

        /** 应用当前播放模式：单曲循环交给 audio.loop，其余模式在 ended 里切歌 */
        function applyMode() {
            audios.forEach(function (audio) {
                audio.loop = mode === 'single';
            });
            saveMode();
            renderLabels();
        }

        function playIndex(index, restart) {
            const audio = audios[index];
            if (!audio) {
                return;
            }

            if (index !== currentIndex) {
                pauseAll();
                currentIndex = index;
                audio.currentTime = 0;
            } else if (restart) {
                audio.currentTime = 0;
            }

            audio.loop = mode === 'single';
            const playback = audio.play();
            // 浏览器可能因自动播放策略拒绝播放，静默处理即可
            if (playback && typeof playback.catch === 'function') {
                playback.catch(function () {});
            }
            renderState();
        }

        function togglePlayback() {
            const audio = activeAudio();

            if (!audio) {
                playIndex(0, true);
                return;
            }

            if (audio.paused) {
                audio.loop = mode === 'single';
                const playback = audio.play();
                if (playback && typeof playback.catch === 'function') {
                    playback.catch(function () {});
                }
            } else {
                audio.pause();
            }
            renderState();
        }

        /** 顺序 / 随机模式下计算下一首（随机模式避免立刻重复当前曲目） */
        function nextIndex(from) {
            if (mode === 'shuffle' && audios.length > 1) {
                let next = from;
                while (next === from) {
                    next = Math.floor(Math.random() * audios.length);
                }
                return next;
            }
            return (from + 1) % audios.length;
        }

        function handleEnded(event) {
            const endedIndex = audios.indexOf(event.currentTarget);
            if (endedIndex !== currentIndex) {
                return;
            }

            if (mode === 'single') {
                playIndex(endedIndex, true);
                return;
            }

            playIndex(nextIndex(endedIndex), true);
        }

        /* --- 面板开合 --- */

        function openPanel() {
            panel.hidden = false;
            toggleButton.setAttribute('aria-expanded', 'true');
            renderState();
        }

        function closePanel() {
            panel.hidden = true;
            toggleButton.setAttribute('aria-expanded', 'false');
        }

        function togglePanel() {
            if (panel.hidden) {
                openPanel();
            } else {
                closePanel();
            }
        }

        /* --- 事件绑定 --- */

        toggleButton.addEventListener('click', togglePanel);

        closeButton.addEventListener('click', function () {
            closePanel();
            toggleButton.focus();
        });

        playPauseButton.addEventListener('click', togglePlayback);

        modeButton.addEventListener('click', function () {
            mode = PLAY_MODES[(PLAY_MODES.indexOf(mode) + 1) % PLAY_MODES.length];
            applyMode();
        });

        trackButtons.forEach(function (button, index) {
            button.addEventListener('click', function () {
                if (index === currentIndex) {
                    togglePlayback();
                } else {
                    playIndex(index, true);
                }
            });
        });

        audios.forEach(function (audio) {
            audio.addEventListener('play', renderState);
            audio.addEventListener('pause', renderState);
            audio.addEventListener('ended', handleEnded);
        });

        // 点击面板外部收起；Esc 收起并把焦点还给触发按钮
        document.addEventListener('click', function (event) {
            if (!panel.hidden && !root.contains(event.target)) {
                closePanel();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && !panel.hidden) {
                closePanel();
                toggleButton.focus();
            }
        });

        // 语言切换时同步面板文案
        document.addEventListener('languagechange', renderLabels);

        applyMode();
    }

    /* =========================================================================
       4. 全屏 / 专注模式
       ------------------------------------------------------------------------
       全屏时只保留倒计时区域与音乐播放器按钮（由 CSS 的 .is-fullscreen 控制）。
       浏览器全屏 API 不可用时（如 iPhone Safari），退化为页面内专注模式。
       ====================================================================== */

    function initFullscreen() {
        const button = byId('fullscreenToggle');
        if (!button) {
            return;
        }

        const root = document.documentElement;
        let isActive = false;
        let ticking = false;
        /** 进入全屏前的滚动位置：全屏时 body 禁止滚动会丢失它，退出后恢复 */
        let savedScrollY = 0;

        /** 返回顶部按钮显示时，全屏按钮左移让位；全屏时返回顶部被隐藏，故不位移 */
        function syncShift() {
            ticking = false;
            const scrolled = window.scrollY > BACK_TO_TOP_THRESHOLD;
            button.classList.toggle('is-shifted', scrolled && !isActive);
        }

        function requestSync() {
            if (ticking) {
                return;
            }
            ticking = true;
            window.requestAnimationFrame(syncShift);
        }

        /** 按钮文案与图标状态 */
        function updateLabel() {
            const key = isActive ? 'fullscreenExit' : 'fullscreenEnter';
            const label = window.translationManager ? window.translationManager.t(key) : '';
            if (label) {
                button.setAttribute('title', label);
                button.setAttribute('aria-label', label);
            }
            button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        }

        /** 统一处理全屏状态：页面类名、按钮图标与文案 */
        function setActive(active) {
            if (active && !isActive) {
                savedScrollY = window.scrollY;
            }
            isActive = active;
            document.body.classList.toggle('is-fullscreen', active);
            button.classList.toggle('is-active', active);
            updateLabel();
            if (active) {
                syncShift();
                return;
            }
            // 退出全屏后恢复进入前的滚动位置（全屏时 overflow:hidden 会把它压回 0）
            window.requestAnimationFrame(function () {
                window.scrollTo(0, savedScrollY);
                syncShift();
            });
        }

        function enterFullscreen() {
            setActive(true);
            if (document.fullscreenElement || typeof root.requestFullscreen !== 'function') {
                return; // 已是全屏，或浏览器不支持全屏 API：保留页面内专注模式
            }
            try {
                const request = root.requestFullscreen();
                if (request && typeof request.catch === 'function') {
                    request.catch(function () {}); // 被拒绝时同样保留专注模式
                }
            } catch (error) {
                // 某些浏览器会在非用户手势等场景同步抛错，忽略即可
            }
        }

        function exitFullscreen() {
            if (document.fullscreenElement && typeof document.exitFullscreen === 'function') {
                try {
                    const request = document.exitFullscreen();
                    if (request && typeof request.catch === 'function') {
                        request.catch(function () {});
                    }
                } catch (error) {
                    // 同上，忽略退出失败
                }
            }
            setActive(false);
        }

        button.addEventListener('click', function () {
            if (isActive) {
                exitFullscreen();
            } else {
                enterFullscreen();
            }
        });

        // 用户按 Esc 或浏览器自身退出全屏时，同步页面状态
        document.addEventListener('fullscreenchange', function () {
            if (!document.fullscreenElement && isActive) {
                setActive(false);
            }
        });

        // 语言切换时更新按钮文案
        document.addEventListener('languagechange', updateLabel);

        window.addEventListener('scroll', requestSync, { passive: true });

        syncShift();
        updateLabel();
    }

    /* =========================================================================
       5. 返回顶部
       ====================================================================== */

    function initBackToTop() {
        const button = byId('backToTop');
        if (!button) {
            return;
        }

        // 滚动事件用 rAF 节流，避免高频触发样式写入
        let ticking = false;
        let isVisible = false;

        function applyVisibility() {
            ticking = false;
            const shouldShow = window.scrollY > BACK_TO_TOP_THRESHOLD;
            if (shouldShow === isVisible) {
                return;
            }
            isVisible = shouldShow;
            button.classList.toggle('show', shouldShow);
        }

        window.addEventListener('scroll', function () {
            if (ticking) {
                return;
            }
            ticking = true;
            window.requestAnimationFrame(applyVisibility);
        }, { passive: true });

        button.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        applyVisibility(); // 刷新时可能已经处于滚动位置
    }

    /* =========================================================================
       启动
       ====================================================================== */

    document.addEventListener('DOMContentLoaded', function () {
        // 语言先初始化：倒计时需要依赖它来输出主标题
        initLanguageToggle();
        initCountdown();
        initBackToTop();
        initFullscreen();
        initAudioPlayer();
    });
}());
