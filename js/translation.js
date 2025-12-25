// 双语翻译系统
const translations = {
    'zh-CN': {
        langToggle: 'Hello World',
        calendarToggle: '翁法罗斯一年历',
        mainContent: [
            '昔涟。是桃子。是爱。',
            '昔涟有。粉色的发。尖尖的耳。',
            '昔涟是。女孩。是祭司。',
            '昔涟。不喜欢眼泪。嘻嘻哈哈。',
            '昔涟是。温柔。爱美。会写诗。',
            '昔涟是。长不高的。会说话的。随风逝去后。仍被留下的。',
            '昔涟是。每一句最后的。一直咯咯笑的。像是小尾巴的♪',
            '昔涟是。哭着诞生的。脆弱的。透明的。像是水晶的。',
            '昔涟是。笑着道别的。柔软的。粉色的。像是花的。'
        ],
        countdownMain: '下次见, 「PhiLia093」',
        countdownMainTomorrow: '明天见，「PhiLia093」',
        countdownMainExpired: '你好，世界！',
        countdownSub: '距离2026年11月12日13:00还有',
        countdownLabels: ['天', '时', '分', '秒'],
        copyright: '© 2025 <a href="mailto:aetherwish@cyrene.icu">AetherWish</a>. <a href="https://sr.mihoyo.com/" target="_blank" rel="noopener noreferrer">《崩坏：星穹铁道》</a>音乐、美术及文本素材版权归 miHoYo 所有。',
        fontCredit: '本站使用了基于 OFL 1.1 协议开源的<a href="https://github.com/lxgw/kose-font/releases/tag/v3.126" target="_blank" rel="noopener noreferrer">小赖字体等宽版本</a>',
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
        mainContent: [
            'Cyrene. Is Peach. Is love.',
            'Cyrene has. Pink hair. Sharp ears.',
            'Cyrene is. A girl. A priest.',
            'Cyrene. Doesn\'t like tears. Always happy.',
            'Cyrene is. Gentle. Likes beautiful things. Can write stories.',
            'Cyrene, she can\'t grow up, but she can talk. After all is lost to the wind, she will stay behind.',
            'Cyrene is, at the end of every sentence, always laughing, like a little tail♪',
            'Cyrene <b>was</b>, crying when she was born. Fragile. Transparent. Like a crystal.',
            'Cyrene <b>was</b>, smiling when she said goodbye. Soft. Pink. Like a flower.'
        ],
        countdownMain: 'See you soon, PhiLia093',
        countdownMainTomorrow: 'See you tomorrow, PhiLia093',
        countdownMainExpired: 'Hello World!',
        countdownSub: 'Time until Nov 12, 2026 1:00 PM',
        countdownLabels: ['d', 'h', 'm', 's'],
        copyright: '© 2025 <a href="mailto:aetherwish@cyrene.icu">AetherWish</a>. <a href="https://hsr.hoyoverse.com/" target="_blank" rel="noopener noreferrer">Honkai: Star Rail</a> music, artwork & text copyright by COGNOSPHERE.',
        fontCredit: 'This site uses <a href="https://github.com/lxgw/kose-font/releases/tag/v3.126" target="_blank" rel="noopener noreferrer">XiaolaiMono-Regular</a> which is open source under the OFL 1.1 license',
        statistics: {
            totalViews: 'Total Views: ',
            individualVisitors: 'Individual Visitors: ',
            viewsUnit: '',
            visitorsUnit: ''
        },
        videoUnsupported: 'Your browser does not support the video playback♪',
        backToTop: 'Back to top'
    }
};

// 翻译系统管理类
class TranslationManager {
    constructor() {
        this.currentLang = 'zh-CN'; // 默认语言
        this.init();
    }

    init() {
        // 检测用户首选语言或从本地存储获取
        const savedLang = localStorage.getItem('language') || 'zh-CN';
        this.setLanguage(savedLang);
    }

    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('language', lang);
            document.documentElement.lang = lang;
            this.updatePageText();
        }
    }

    toggleLanguage() {
        const newLang = this.currentLang === 'zh-CN' ? 'en' : 'zh-CN';
        this.setLanguage(newLang);
        return newLang;
    }

    t(key, subKey = null) {
        if (subKey) {
            return translations[this.currentLang][key][subKey] || '';
        }
        return translations[this.currentLang][key] || '';
    }

    updatePageText() {
        // 更新语言切换按钮
        const langToggleBtn = document.getElementById('langToggle');
        if (langToggleBtn) {
            langToggleBtn.textContent = this.t('langToggle');
        }

        // 更新日历切换按钮文本
        const calendarToggleTextZh = document.querySelector('.calendar-toggle-text-zh');
        const calendarToggleTextEn = document.querySelector('.calendar-toggle-text-en');
        if (calendarToggleTextZh) {
            calendarToggleTextZh.textContent = this.t('calendarToggle');
            calendarToggleTextZh.style.display = this.currentLang === 'zh-CN' ? 'inline' : 'none';
        }
        if (calendarToggleTextEn) {
            calendarToggleTextEn.textContent = this.t('calendarToggle');
            calendarToggleTextEn.style.display = this.currentLang === 'en' ? 'inline' : 'none';
        }

        // 更新主内容区域
        const chineseContent = document.querySelector('.chinese-content');
        const englishContent = document.querySelector('.english-content');
        
        if (chineseContent && englishContent) {
            // 先清空内容
            chineseContent.innerHTML = '';
            englishContent.innerHTML = '';
            
            // 获取当前语言的内容
            const contentArray = this.t('mainContent');
            const isEnglish = this.currentLang === 'en';
            
            // 填充内容
            contentArray.forEach(paragraph => {
                const p = document.createElement('p');
                p.innerHTML = paragraph; // 使用innerHTML支持内部标签
                if (isEnglish) {
                    englishContent.appendChild(p);
                } else {
                    chineseContent.appendChild(p);
                }
            });
            
            // 显示对应语言的内容
            chineseContent.style.display = this.currentLang === 'zh-CN' ? 'block' : 'none';
            englishContent.style.display = this.currentLang === 'en' ? 'block' : 'none';
        }

        // 更新倒计时文本 - 初始化时只设置显示/隐藏状态
        const countdownMainTextZh = document.querySelector('.countdown-main-text-zh');
        const countdownMainTextEn = document.querySelector('.countdown-main-text-en');
        
        if (countdownMainTextZh) {
            // 不设置文本内容，因为 updateCountdown 函数会根据实际天数设置
            countdownMainTextZh.style.display = this.currentLang === 'zh-CN' ? 'inline' : 'none';
        }
        if (countdownMainTextEn) {
            // 不设置文本内容，因为 updateCountdown 函数会根据实际天数设置
            countdownMainTextEn.style.display = this.currentLang === 'en' ? 'inline' : 'none';
        }

        const chineseCountdownText = document.querySelector('.chinese-countdown-text');
        const englishCountdownText = document.querySelector('.english-countdown-text');
        
        if (chineseCountdownText) {
            chineseCountdownText.textContent = this.t('countdownSub');
            chineseCountdownText.style.display = this.currentLang === 'zh-CN' ? 'block' : 'none';
        }
        if (englishCountdownText) {
            englishCountdownText.textContent = this.t('countdownSub');
            englishCountdownText.style.display = this.currentLang === 'en' ? 'block' : 'none';
        }

        // 更新倒计时标签
        const chineseLabels = document.querySelectorAll('.label');
        const englishLabels = document.querySelectorAll('.label-en');
        const countdownLabels = this.t('countdownLabels');
        
        chineseLabels.forEach((label, index) => {
            label.textContent = countdownLabels[index];
            label.style.display = this.currentLang === 'zh-CN' ? 'block' : 'none';
        });
        
        englishLabels.forEach((label, index) => {
            label.textContent = countdownLabels[index];
            label.style.display = this.currentLang === 'en' ? 'block' : 'none';
        });

        // 更新版权信息
        const copyrightNoticeZh = document.querySelector('.copyright-notice-zh');
        const copyrightNoticeEn = document.querySelector('.copyright-notice-en');
        
        if (copyrightNoticeZh) {
            copyrightNoticeZh.innerHTML = this.t('copyright');
            copyrightNoticeZh.style.display = this.currentLang === 'zh-CN' ? 'block' : 'none';
        }
        if (copyrightNoticeEn) {
            copyrightNoticeEn.innerHTML = this.t('copyright');
            copyrightNoticeEn.style.display = this.currentLang === 'en' ? 'block' : 'none';
        }

        // 更新字体版权信息
        const chineseFontCredit = document.querySelector('.font-credit-zh');
        const englishFontCredit = document.querySelector('.font-credit-en');
        
        if (chineseFontCredit) {
            chineseFontCredit.innerHTML = this.t('fontCredit');
            chineseFontCredit.style.display = this.currentLang === 'zh-CN' ? 'block' : 'none';
        }
        if (englishFontCredit) {
            englishFontCredit.innerHTML = this.t('fontCredit');
            englishFontCredit.style.display = this.currentLang === 'en' ? 'block' : 'none';
        }

        // 更新统计文本
        const statisticsTextZh = document.querySelectorAll('.statistics-text-zh');
        const statisticsTextEn = document.querySelectorAll('.statistics-text-en');
        
        if (statisticsTextZh[0]) {
            statisticsTextZh[0].textContent = this.t('statistics', 'totalViews');
            statisticsTextZh[0].style.display = this.currentLang === 'zh-CN' ? 'inline' : 'none';
        }
        if (statisticsTextZh[1]) {
            statisticsTextZh[1].textContent = this.t('statistics', 'viewsUnit');
            statisticsTextZh[1].style.display = this.currentLang === 'zh-CN' ? 'inline' : 'none';
        }
        if (statisticsTextZh[2]) {
            statisticsTextZh[2].textContent = this.t('statistics', 'individualVisitors');
            statisticsTextZh[2].style.display = this.currentLang === 'zh-CN' ? 'inline' : 'none';
        }
        if (statisticsTextZh[3]) {
            statisticsTextZh[3].textContent = this.t('statistics', 'visitorsUnit');
            statisticsTextZh[3].style.display = this.currentLang === 'zh-CN' ? 'inline' : 'none';
        }
        
        if (statisticsTextEn[0]) {
            statisticsTextEn[0].textContent = this.t('statistics', 'totalViews');
            statisticsTextEn[0].style.display = this.currentLang === 'en' ? 'inline' : 'none';
        }
        if (statisticsTextEn[2]) {
            statisticsTextEn[2].textContent = this.t('statistics', 'individualVisitors');
            statisticsTextEn[2].style.display = this.currentLang === 'en' ? 'inline' : 'none';
        }

        // 更新视频不支持文本
        const videoElement = document.querySelector('video');
        if (videoElement) {
            // 找到或创建不支持文本
            let unsupportedText = videoElement.querySelector('.unsupported-text');
            if (!unsupportedText) {
                unsupportedText = document.createElement('div');
                unsupportedText.className = 'unsupported-text';
                videoElement.parentNode.insertBefore(unsupportedText, videoElement.nextSibling);
            }
            unsupportedText.textContent = this.t('videoUnsupported');
            unsupportedText.style.display = 'none'; // 默认隐藏，只在需要时显示
        }

        // 更新返回顶部按钮的title属性
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.setAttribute('title', this.t('backToTop'));
        }
    }

    // 更新倒计时主文本的特殊方法（考虑剩余时间）
    updateCountdownMainText(daysRemaining) {
        const countdownMainTextZh = document.querySelector('.countdown-main-text-zh');
        const countdownMainTextEn = document.querySelector('.countdown-main-text-en');
        let zhText, enText;
        
        if (daysRemaining <= 0) {
            zhText = translations['zh-CN']['countdownMainExpired'];
            enText = translations['en']['countdownMainExpired'];
        } else if (daysRemaining < 1) {
            zhText = translations['zh-CN']['countdownMainTomorrow'];
            enText = translations['en']['countdownMainTomorrow'];
        } else {
            zhText = translations['zh-CN']['countdownMain'];
            enText = translations['en']['countdownMain'];
        }
        
        if (countdownMainTextZh) {
            countdownMainTextZh.textContent = zhText;
            countdownMainTextZh.style.display = this.currentLang === 'zh-CN' ? 'inline' : 'none';
        }
        if (countdownMainTextEn) {
            countdownMainTextEn.textContent = enText;
            countdownMainTextEn.style.display = this.currentLang === 'en' ? 'inline' : 'none';
        }
    }
}

// 创建全局翻译管理器实例
let translationManager;