/**
 * 首页双语翻译系统 ——「记忆的幼芽」
 * ---------------------------------------------------------------------------
 * 该模块负责：
 *   1. 维护中英双语的文案字典；
 *   2. 根据语言把文案写入页面（DOM 契约集中在一处，便于维护）；
 *   3. 记住用户的语言偏好（localStorage）；
 *   4. 根据距目标时间的剩余天数，切换倒计时主标题的措辞。
 *
 * 对外暴露（挂在 window 上供 script.js 使用）：
 *   window.TranslationManager          —— 翻译管理器类
 *   window.TranslationManager.TARGET_DATE —— 倒计时目标时间（唯一来源）
 * ---------------------------------------------------------------------------
 * 编码注意：本文件为无 BOM 的 UTF-8。Windows 下编辑时请勿另存为 GBK，
 * 否则中文文案会变成乱码。
 */
(function (global) {
    'use strict';

    /** 语言偏好写入 localStorage 时使用的键名 */
    const STORAGE_KEY = 'language';

    /**
     * 倒计时目标时间：2026-11-12 13:00（《崩坏：星穹铁道》4.6 版本期间）。
     * 这是全站唯一的定义处 —— script.js 会直接复用，不要再硬编码第二份。
     */
    const TARGET_DATE = new Date('2026-11-12T13:00:00');

    const DAY_MS = 1000 * 60 * 60 * 24;

    /* =========================================================================
       文案字典
       -------------------------------------------------------------------------
       单引号文本若包含撇号，统一使用 HTML 实体 &#39;（原实现中大小写不一致，
       这里统一为小写写法，渲染结果完全相同）。
       ====================================================================== */
    const TRANSLATIONS = {
        'zh-CN': {
            langToggle: 'Hello World',
            calendarToggle: '翁法罗斯一年历',
            blogToggle: 'blog.cyrene.icu',

            /** 主内容区段落 */
            mainContent: [
                '“......昔涟是。哭着诞生的。脆弱的。透明的。像是水晶的。”',
                '“昔涟是。笑着道别的。柔软的。粉色的。像是花的。”',
                '「二相乐园」已至，但开拓者们依然思念着被留在「昨天」的她......'
            ],

            /** 倒计时主标题的三种措辞 */
            countdownMain: '下次见, 「PhiLia093」',
            countdownMainTomorrow: '明天见，「PhiLia093」',
            countdownMainExpired: '你好，世界！',
            countdownSub: '距离2026年11月12日13:00（4.6期间）还有',
            countdownLabels: ['天', '时', '分', '秒'],

            /* 音乐播放器面板 */
            audioPanelTitle: '音乐播放器',
            audioClose: '关闭',
            audioPlay: '播放',
            audioPause: '暂停',
            audioModeAria: '播放模式',
            audioTracksAria: '曲目列表',
            audioNothingPlaying: '尚未选择曲目',
            audioModes: ['列表循环', '单曲循环', '随机播放'],

            copyright: '© 2026 cyrene.icu. <a href="mailto:philia093@cyrene.icu">网站建议与不良信息反馈</a> / <a href="https://blog.cyrene.icu/copyright-notice/" target="_blank" rel="noopener noreferrer">本站版权内容说明</a>',
            fontCredit: '本项目部分源代码由 AI 辅助完成，所有上线内容均已经由人工筛选和审查。',

            statistics: {
                totalViews: '总访问量',
                individualVisitors: '总访客数',
                viewsUnit: '次',
                visitorsUnit: '人'
            },

            videoUnsupported: '当前浏览器不支持视频播放♪',
            backToTop: '返回顶部'
        },

        'en': {
            langToggle: '你好，世界',
            calendarToggle: 'Amphoreus calendar',
            blogToggle: 'blog.cyrene.icu',

            mainContent: [
                '&#39;......Cyrene <b>was</b>, crying when she was born. Fragile. Transparent. Like a crystal.&#39;',
                '&#39;Cyrene <b>was</b>, smiling when she said goodbye. Soft. Pink. Like a flower.&#39;',
                '<em>Planarcadia</em> has arrived. Still, Trailblazers will miss HER who was left in YESTERDAY.'
            ],

            countdownMain: 'See you soon, PhiLia093',
            countdownMainTomorrow: 'See you tomorrow, PhiLia093',
            countdownMainExpired: 'Hello World!',
            countdownSub: 'Time until Nov 12, 2026 1:00 PM (during ver.4.6)',
            countdownLabels: ['d', 'h', 'm', 's'],

            /* 音乐播放器面板 */
            audioPanelTitle: 'Music Player',
            audioClose: 'Close',
            audioPlay: 'Play',
            audioPause: 'Pause',
            audioModeAria: 'Playback mode',
            audioTracksAria: 'Tracks',
            audioNothingPlaying: 'No track selected',
            audioModes: ['Repeat all', 'Repeat one', 'Shuffle'],

            copyright: '© 2026 cyrene.icu. <a href="mailto:philia093@cyrene.icu">Website Content Suggestion &amp; Report</a> / <a href="https://blog.cyrene.icu/copyright-notice/" target="_blank" rel="noopener noreferrer">Copyright Notice</a>',
            fontCredit: 'Part of the source code of this project is assisted by AI, and has been screened and reviewed by humans.',

            statistics: {
                totalViews: 'Total Views: ',
                individualVisitors: 'Individual Visitors: ',
                viewsUnit: '',
                visitorsUnit: ''
            },

            videoUnsupported: 'Your browser does not support video playback♪',
            backToTop: 'Back to top'
        }
    };

    /* =========================================================================
       DOM 契约
       -------------------------------------------------------------------------
       把「文案键 → 页面元素」的映射集中在 TARGETS 中，渲染时统一遍历。
       新增可翻译文案只需：在字典里加键 + 在下面加一行映射。
       ====================================================================== */

    /** 用 textContent 写入的元素（纯文本，不会被解析为 HTML） */
    const TEXT_TARGETS = [
        /* 写入按钮内的文字 span，而非按钮本身——按钮内还含有图标，不能整体覆写 */
        { id: 'langToggleText', key: 'langToggle' },
        { id: 'calendarToggleText', key: 'calendarToggle' },
        { id: 'blogToggleText', key: 'blogToggle' },
        { id: 'countdownSubText', key: 'countdownSub' },
        { id: 'totalViewsLabel', key: ['statistics', 'totalViews'] },
        { id: 'individualVisitorsLabel', key: ['statistics', 'individualVisitors'] },
        { id: 'viewsUnit', key: ['statistics', 'viewsUnit'] },
        { id: 'visitorsUnit', key: ['statistics', 'visitorsUnit'] },
        { id: 'videoUnsupportedText', key: 'videoUnsupported' }
    ];

    /** 用 innerHTML 写入的元素（文案本身包含富文本标记） */
    const HTML_TARGETS = [
        { id: 'copyrightNotice', key: 'copyright' },
        { id: 'fontCredit', key: 'fontCredit' }
    ];

    /** 倒计时四个单位标签，与 countdownLabels 数组按序对应 */
    const LABEL_TARGET_IDS = ['daysLabel', 'hoursLabel', 'minutesLabel', 'secondsLabel'];

    /** 返回顶部按钮：文案用于 title 属性而非文本内容 */
    const BACK_TO_TOP_ID = 'backToTop';

    /* =========================================================================
       工具函数
       ====================================================================== */

    /**
     * 按「点号路径」或「数组路径」读取嵌套值。
     * 同时兼容 t('statistics', 'totalViews') 与 t(['statistics', 'totalViews']) 两种写法。
     *
     * @param {object} source 数据源对象
     * @param {string|string[]} path 路径
     * @returns {*} 命中的值；未命中时返回 undefined
     */
    function getByPath(source, path) {
        const segments = Array.isArray(path) ? path : String(path).split('.');
        let current = source;

        for (let i = 0; i < segments.length; i++) {
            if (current === null || current === undefined) {
                return undefined;
            }
            current = current[segments[i]];
        }
        return current;
    }

    /**
     * 计算距目标时间的剩余天数。
     *
     * @param {Date} [now] 参照时间，默认取当前时刻（便于测试注入）
     * @returns {number} 剩余天数；已过期为负数
     */
    function daysUntilTarget(now) {
        const reference = now instanceof Date ? now : new Date();
        return (TARGET_DATE.getTime() - reference.getTime()) / DAY_MS;
    }

    /* =========================================================================
       翻译管理器
       ====================================================================== */
    class TranslationManager {
        /**
         * @param {string} [initialLang] 初始语言；缺省时读取用户偏好，再退回 zh-CN
         */
        constructor(initialLang) {
            this.supportedLanguages = Object.keys(TRANSLATIONS);
            this.defaultLanguage = 'zh-CN';
            this.currentLang = this.defaultLanguage;

            this.init(initialLang);
        }

        /** 读取用户偏好并应用到页面 */
        init(initialLang) {
            const stored = this.readPreference();
            const lang = this.supportedLanguages.indexOf(initialLang) !== -1 ? initialLang : stored;
            this.setLanguage(lang);
        }

        /** 从 localStorage 读取语言偏好，读取失败时静默退回默认语言 */
        readPreference() {
            try {
                const stored = global.localStorage.getItem(STORAGE_KEY);
                if (stored && this.supportedLanguages.indexOf(stored) !== -1) {
                    return stored;
                }
            } catch (error) {
                // 隐私模式等场景下 localStorage 可能不可用，忽略即可
            }
            return this.defaultLanguage;
        }

        /** 写入语言偏好；失败不影响页面切换 */
        savePreference(lang) {
            try {
                global.localStorage.setItem(STORAGE_KEY, lang);
            } catch (error) {
                // 同上，忽略写入失败
            }
        }

        /**
         * 切换语言并重绘页面。
         * @param {string} lang 目标语言；不支持的语言会被忽略
         * @returns {string} 实际生效的语言
         */
        setLanguage(lang) {
            if (this.supportedLanguages.indexOf(lang) === -1) {
                return this.currentLang;
            }

            this.currentLang = lang;
            this.savePreference(lang);
            document.documentElement.lang = lang;
            this.render();

            // 通知依赖当前语言的其它模块（如播放器面板）刷新动态文案。
            // 初始化时监听者尚未注册也无妨，各模块初始化时会自行渲染一次。
            document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: lang } }));
            return lang;
        }

        /** 在中英之间来回切换 */
        toggleLanguage() {
            const next = this.currentLang === 'zh-CN' ? 'en' : 'zh-CN';
            return this.setLanguage(next);
        }

        /** 当前语言的文案字典 */
        get dictionary() {
            return TRANSLATIONS[this.currentLang];
        }

        /**
         * 取文案。
         * @param {string|string[]} key 键名或路径
         * @param {string} [subKey] 次级键（等价于把 key 与 subKey 拼成路径）
         * @returns {*} 命中的值；缺失时返回空字符串
         */
        t(key, subKey) {
            const path = subKey === undefined || subKey === null ? key : [key, subKey];
            const value = getByPath(this.dictionary, path);
            return value === undefined ? '' : value;
        }

        /**
         * 把当前语言的文案写入页面。
         * 遍历三张表：纯文本、富文本、单位标签，最后同步一次倒计时标题。
         */
        render() {
            TEXT_TARGETS.forEach((target) => {
                const element = document.getElementById(target.id);
                if (element) {
                    element.textContent = this.t(target.key);
                }
            });

            HTML_TARGETS.forEach((target) => {
                const element = document.getElementById(target.id);
                if (element) {
                    element.innerHTML = this.t(target.key);
                }
            });

            this.renderCountdownLabels();
            this.renderMainContent();

            const backToTop = document.getElementById(BACK_TO_TOP_ID);
            if (backToTop) {
                backToTop.setAttribute('title', this.t('backToTop'));
            }

            // 倒计时标题取决于剩余时间，切换完语言需要立刻按新语言重算
            this.updateCountdownText();
        }

        /** 渲染倒计时四个单位标签 */
        renderCountdownLabels() {
            const labels = this.t('countdownLabels');

            LABEL_TARGET_IDS.forEach((id, index) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = labels[index];
                }
            });
        }

        /** 渲染主内容区段落（文案含 <b> / <em> 等标记，使用 innerHTML） */
        renderMainContent() {
            const container = document.getElementById('mainContent');
            if (!container) {
                return;
            }

            const paragraphs = this.t('mainContent');
            if (!Array.isArray(paragraphs)) {
                return;
            }

            const fragment = document.createDocumentFragment();
            paragraphs.forEach((paragraph) => {
                const p = document.createElement('p');
                p.innerHTML = paragraph;
                fragment.appendChild(p);
            });

            container.textContent = ''; // 清空后一次性替换，避免中间态闪烁
            container.appendChild(fragment);
        }

        /** 依据当前剩余天数，重算并写入倒计时主标题 */
        updateCountdownText() {
            this.updateCountdownMainText(daysUntilTarget());
        }

        /**
         * 中英共用的三档倒计时措辞。
         * @param {number} daysRemaining 剩余天数；负数表示已结束
         */
        updateCountdownMainText(daysRemaining) {
            let key;
            if (daysRemaining <= 0) {
                key = 'countdownMainExpired';
            } else if (daysRemaining < 1) {
                key = 'countdownMainTomorrow';
            } else {
                key = 'countdownMain';
            }

            const element = document.getElementById('countdownMainText');
            if (element) {
                element.textContent = this.t(key);
            }
        }
    }

    /* 暴露给 script.js；同时把目标时间与剩余天数计算一并挂上，
       让页面脚本无需重复定义日期，也便于在控制台自测。 */
    TranslationManager.TARGET_DATE = TARGET_DATE;
    TranslationManager.daysUntilTarget = daysUntilTarget;

    global.TranslationManager = TranslationManager;
}(window));
