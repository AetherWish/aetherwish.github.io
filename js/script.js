/**
 * 首页交互脚本 ——「记忆的幼芽」
 * ---------------------------------------------------------------------------
 * 职责（每项对应下面一个 init 函数）：
 *   1. 倒计时       —— 每秒刷新距目标时间的剩余量
 *   2. 语言切换     —— 委托给 translation.js 的 TranslationManager
 *   3. 背景音频     —— 静音 / 曲目一 / 曲目二 三态循环
 *   4. 返回顶部     —— 滚动超过阈值后显示浮动按钮
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

    /** 一首曲目对应的音频元素 id，下标即音频状态值（1 = remembrance，2 = reverie） */
    const AUDIO_TRACK_IDS = [null, 'remembrance-audio', 'reverie-audio'];

    /** 音频状态：0 静音 / 1 曲目一 / 2 曲目二 */
    const AUDIO_STATE = { MUTED: 0, TRACK_ONE: 1, TRACK_TWO: 2 };
    const AUDIO_STATE_COUNT = 3;

    /** 静音时叠加在喇叭图标上的斜线路径（viewBox 1024） */
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
       3. 背景音频
       ====================================================================== */

    function initAudioToggle() {
        const toggleButton = byId('audioToggle');
        const icon = byId('audioIcon');
        const numberBadge = byId('audioNumber');
        const tracks = AUDIO_TRACK_IDS.map(byId);

        // 缺少任一必需元素时直接跳过，避免抛出异常影响其它交互
        if (!toggleButton || !icon || !numberBadge || !tracks[1] || !tracks[2]) {
            return;
        }

        let state = AUDIO_STATE.MUTED;

        /** 暂停全部曲目 */
        function pauseAll() {
            tracks.forEach((track) => {
                if (track) {
                    track.pause();
                }
            });
        }

        /** 播放指定曲目（从头开始） */
        function playTrack(track) {
            track.currentTime = 0;
            const playback = track.play();
            // 浏览器可能因自动播放策略拒绝播放，静默处理即可
            if (playback && typeof playback.catch === 'function') {
                playback.catch(() => {});
            }
        }

        /** 按当前状态刷新图标（静音加斜线并隐藏序号，播放中显示曲目序号） */
        function renderIcon() {
            icon.querySelectorAll('.audio-icon-overlay').forEach((node) => node.remove());

            if (state === AUDIO_STATE.MUTED) {
                const slash = document.createElementNS(SVG_NAMESPACE, 'path');
                slash.setAttribute('d', MUTE_SLASH_PATH);
                slash.setAttribute('stroke', 'white');
                slash.setAttribute('stroke-width', '60');
                slash.setAttribute('stroke-linecap', 'round');
                slash.setAttribute('fill', 'none');
                slash.setAttribute('class', 'audio-icon-overlay');
                icon.appendChild(slash);

                numberBadge.style.display = 'none';
                return;
            }

            numberBadge.textContent = String(state);
            numberBadge.style.display = 'inline';
        }

        // 三态循环：静音 → 曲目一 → 曲目二 → 静音
        toggleButton.addEventListener('click', function () {
            state = (state + 1) % AUDIO_STATE_COUNT;

            pauseAll();
            if (state !== AUDIO_STATE.MUTED) {
                playTrack(tracks[state]);
            }

            renderIcon();
        });

        renderIcon();
    }

    /* =========================================================================
       4. 返回顶部
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
        initAudioToggle();
    });
}());
