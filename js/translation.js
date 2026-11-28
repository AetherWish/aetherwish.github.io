/**
 * 页面文案与多语言渲染 —— cyrene.icu
 * ---------------------------------------------------------------------------
 * 页面只有一块倒计时面板和一个播放器，文案集中在下面的字典里。
 * 本文件只负责「把当前语言的静态文案写进 DOM」；倒计时数字、说明文字里的
 * 时间与模式措辞由 script.js 按语言即时计算（见 updateSubText）。
 *
 * 对外接口：
 *   window.TranslationManager    构造函数
 *   window.translationManager    实例（script.js 在 DOMContentLoaded 时创建）
 *
 * 编码注意：本文件为无 BOM 的 UTF-8。
 */
(function (global) {
    'use strict';

    /** localStorage 中保存语言偏好的键名 */
    const STORAGE_KEY = 'language';

    /** 默认语言：站点以中文为主 */
    const DEFAULT_LANGUAGE = 'zh-CN';

    /* =========================================================================
       文案字典
       -------------------------------------------------------------------------
       字符串里的 {time} 是占位符，由 script.js 用显式 CST（Asia/Shanghai）
       格式化后的日期替换。
       ====================================================================== */

    const TRANSLATIONS = {
        'zh-CN': {
            langToggle: 'EN',
            langToggleAria: '切换语言',

            /* 页面主标题只显示当前模式的题记；浏览器标签页仍用最初的完整标题 */
            pageTitle: '翁法罗斯，续写「开拓」......然后，人们从昨日走向明天。',
            /* 开场打字机保留最初的两行文案 */
            introTitle: [
                '翁法罗斯，续写「开拓」......',
                '然后，人们从昨日走向明天。'
            ],
            modeQuote: {
                countdown: '「然后，人们从昨日走向明天。」',
                countup: '「成为昨日的明天」'
            },

            /* 背景图库 */
            backgroundTitle: '背景图库',
            backgroundToggle: '切换背景',
            backgroundClose: '关闭',
            backgroundEmpty: '暂无可用背景',

            /* 时间模式 */
            modeSwitchAria: '时间显示模式',
            modeCountdown: '倒计时',
            modeCountUp: '正计时',
            countdownLabels: ['天', '时', '分', '秒'],

            /* 说明文字：{time} 由脚本替换为 CST 时间 */
            subCountdown: '距离 {time}（CST，5.5版本期间）还有',
            subCountUp: '自 {time}（CST，4.7版本期间）起，已经过',
            subCountdownArrived: '{time}（CST，5.5版本期间）已经抵达',
            subCountUpPending: '尚未抵达 {time}（CST，4.7版本期间）',

            /* 计时说明弹窗 */
            timeInfoToggle: '查看计时说明',
            timeInfoClose: '关闭',
            timeInfoTitleCountUp: '为什么是 11 月 12 日',
            timeInfoTitleCountdown: '为什么是 9 月 3 日',
            timeInfoCountUp: '<p>在崩铁官方发布的<a href="https://www.miyoushe.com/sr/article/70540559" target="_blank" rel="noopener noreferrer">翁法罗斯一年历</a>中，哀悼月（对应现实11月）的12日被翁法罗斯的∞标志所替代。大家猜想在未来的这一天可能会迎来翁法罗斯的结局。后来在这一天的11时12分，官方也确实发布了动态。</p><blockquote class="info-quote">「我许下心愿，在十一月的第十二天」</blockquote>',
            timeInfoCountdown: '<p>见<a href="https://www.miyoushe.com/sr/article/79517070" target="_blank" rel="noopener noreferrer">本动态</a>。根据崩铁正常版本演进推算，5.5版本会在2027年8月底9月初开启。此处取9月3日，代表「PhiLia093」中的「真我」。</p><blockquote class="info-quote">「只是守候而已，微不足道的代价，不是吗♪」</blockquote>',

            /* 音乐播放器 */
            audioPanelTitle: '音乐播放器',
            audioClose: '关闭',
            audioPlay: '播放',
            audioPause: '暂停',
            audioNothingPlaying: '尚未选择曲目',
            audioModeAria: '播放模式',
            audioTracksAria: '曲目列表',
            audioModes: ['列表循环', '单曲循环', '随机播放'],
            audioTrackNames: ['心忆', '昔涟', '再度和你'],

            /* 全屏按钮 */
            fullscreenEnter: '全屏',
            fullscreenExit: '退出全屏',

            /* 深浅色主题按钮（图标按钮，只有无障碍标签） */
            themeToggle: '深色模式',
            themeToDark: '切换到深色模式',
            themeToLight: '切换到浅色模式',

            /* 页脚 */
            copyright: '<a href="mailto:philia093@cyrene.icu">网站建议与不良信息反馈</a> / <a href="/content-notice/">本站内容说明</a>',

            statistics: {
                totalViews: '总访问量',
                individualVisitors: '总访客数',
                viewsUnit: '次',
                visitorsUnit: '人'
            }
        },

        en: {
            langToggle: '中文',
            langToggleAria: 'Switch language',

            pageTitle: 'Amphoreus, continuing the Trailblaze... Then, people walk from yesterday towards tomorrow.',
            introTitle: [
                'Amphoreus, continuing the Trailblaze...',
                'Then, people walk from yesterday towards tomorrow.'
            ],
            modeQuote: {
                countdown: '"Then, people walk from yesterday towards tomorrow."',
                countup: '"As Tomorrow Became Yesterday"'
            },

            backgroundTitle: 'Backgrounds',
            backgroundToggle: 'Change background',
            backgroundClose: 'Close',
            backgroundEmpty: 'No backgrounds available.',

            modeSwitchAria: 'Time display mode',
            modeCountdown: 'Countdown',
            modeCountUp: 'Count up',
            countdownLabels: ['d', 'h', 'm', 's'],

            subCountdown: 'Time remaining until {time} (CST, during Ver. 5.5)',
            subCountUp: 'Time elapsed since {time} (CST, during Ver. 4.7)',
            subCountdownArrived: '{time} (CST, during Ver. 5.5) has arrived',
            subCountUpPending: '{time} (CST, during Ver. 4.7) is still ahead',

            /* Date explanation dialog */
            timeInfoToggle: 'About these dates',
            timeInfoClose: 'Close',
            timeInfoTitleCountUp: 'Why November 12?',
            timeInfoTitleCountdown: 'Why September 3?',
            timeInfoCountUp: '<p>In the official Amphoreus year-calendar post, the 12th of the Month of Mourning (November) is replaced by the ∞ symbol of Amphoreus. People speculated that this day might bring the ending of Amphoreus. Later, at 11:12 on that day, the official account did publish a post.</p><blockquote class="info-quote">"I made a wish, on the twelfth day of November."</blockquote>',
            timeInfoCountdown: '<p>See <a href="https://www.miyoushe.com/sr/article/79517070" target="_blank" rel="noopener noreferrer">this post</a>. Based on the normal version progression of Honkai: Star Rail, Version 5.5 should launch in late August or early September 2027. September 3 is chosen here to represent the "true self" in "PhiLia093".</p><blockquote class="info-quote">"Just waiting—a trivial price to pay, isn&#39;t it♪"</blockquote>',

            audioPanelTitle: 'Music Player',
            audioClose: 'Close',
            audioPlay: 'Play',
            audioPause: 'Pause',
            audioNothingPlaying: 'No track selected',
            audioModeAria: 'Playback mode',
            audioTracksAria: 'Tracks',
            audioModes: ['Repeat all', 'Repeat one', 'Shuffle'],
            audioTrackNames: ['Remembrance', 'Ripples of Past Reverie', 'With You Once More'],

            fullscreenEnter: 'Fullscreen',
            fullscreenExit: 'Exit fullscreen',

            themeToggle: 'Dark mode',
            themeToDark: 'Switch to dark mode',
            themeToLight: 'Switch to light mode',

            copyright: '<a href="mailto:philia093@cyrene.icu">Website feedback</a> / <a href="/content-notice/">Content Notice</a>',

            statistics: {
                totalViews: 'Total Views: ',
                individualVisitors: 'Individual Visitors: ',
                viewsUnit: '',
                visitorsUnit: ''
            }
        }
    };

    /* =========================================================================
       DOM 契约
       -------------------------------------------------------------------------
       新增可翻译文案时：字典里加键 + 下面加一行映射。
       ====================================================================== */

    /** 用 textContent 写入的元素（纯文本） */
    const TEXT_TARGETS = [
        { id: 'langToggleText', key: 'langToggle' },
        { id: 'modeCountdown', key: 'modeCountdown' },
        { id: 'modeCountUp', key: 'modeCountUp' },
        { id: 'bgPanelTitle', key: 'backgroundTitle' },
        { id: 'bgEmpty', key: 'backgroundEmpty' },
        { id: 'totalViewsLabel', key: ['statistics', 'totalViews'] },
        { id: 'individualVisitorsLabel', key: ['statistics', 'individualVisitors'] },
        { id: 'viewsUnit', key: ['statistics', 'viewsUnit'] },
        { id: 'visitorsUnit', key: ['statistics', 'visitorsUnit'] }
    ];

    /** 用 innerHTML 写入的元素（文案包含链接） */
    const HTML_TARGETS = [
        { id: 'copyrightNotice', key: 'copyright' }
    ];

    /** 倒计时四个单位标签，与 countdownLabels 数组按序对应 */
    const LABEL_TARGET_IDS = ['daysLabel', 'hoursLabel', 'minutesLabel', 'secondsLabel'];

    /* =========================================================================
       工具
       ====================================================================== */

    /**
     * 按「点号路径」或「数组路径」读取嵌套值。
     * 兼容 t('statistics', 'totalViews') 与 t(['statistics', 'totalViews'])。
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

    /* =========================================================================
       翻译管理器
       ====================================================================== */

    class TranslationManager {
        /**
         * @param {string} [initialLang] 初始语言；缺省时读取用户偏好，再退回 zh-CN
         */
        constructor(initialLang) {
            this.supportedLanguages = Object.keys(TRANSLATIONS);
            this.defaultLanguage = DEFAULT_LANGUAGE;
            this.currentLang = this.defaultLanguage;
            this.init(initialLang);
        }

        /** 读取用户偏好并应用到页面 */
        init(initialLang) {
            const stored = this.readPreference();
            const lang = this.supportedLanguages.indexOf(initialLang) !== -1 ? initialLang : stored;
            this.setLanguage(lang);
        }

        /** 从 localStorage 读取语言偏好；读取失败或值非法时退回默认语言 */
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

            // 通知依赖当前语言的其它模块（主标题、倒计时说明、播放器面板、全屏按钮）刷新文案。
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

        /** 把当前语言的静态文案写入页面 */
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
            this.renderAriaLabels();
        }

        /** 渲染倒计时四个单位标签 */
        renderCountdownLabels() {
            const labels = this.t('countdownLabels');
            if (!Array.isArray(labels)) {
                return;
            }

            LABEL_TARGET_IDS.forEach((id, index) => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = labels[index];
                }
            });
        }

        /** 按钮 / 分组的无障碍标签 */
        renderAriaLabels() {
            const langButton = document.getElementById('langToggle');
            if (langButton) {
                const label = this.t('langToggleAria');
                langButton.setAttribute('title', label);
                langButton.setAttribute('aria-label', label);
            }

            const bgButton = document.getElementById('bgToggle');
            if (bgButton) {
                const label = this.t('backgroundToggle');
                bgButton.setAttribute('title', label);
                bgButton.setAttribute('aria-label', label);
            }

            const bgClose = document.getElementById('bgClose');
            if (bgClose) {
                bgClose.setAttribute('aria-label', this.t('backgroundClose'));
            }

            const bgList = document.getElementById('bgList');
            if (bgList) {
                bgList.setAttribute('aria-label', this.t('backgroundTitle'));
            }

            const switchGroup = document.getElementById('modeSwitch');
            if (switchGroup) {
                switchGroup.setAttribute('aria-label', this.t('modeSwitchAria'));
            }

            const infoButton = document.getElementById('timeInfoToggle');
            if (infoButton) {
                const label = this.t('timeInfoToggle');
                infoButton.setAttribute('title', label);
                infoButton.setAttribute('aria-label', label);
            }

            const infoClose = document.getElementById('timeInfoClose');
            if (infoClose) {
                infoClose.setAttribute('aria-label', this.t('timeInfoClose'));
            }
        }
    }

    global.TranslationManager = TranslationManager;
})(window);
