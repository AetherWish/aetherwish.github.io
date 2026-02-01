// 双语翻译系统
const translations = {
    'zh-CN': {
        langToggle: 'Hello World',
        calendarToggle: '翁法罗斯一年历',
        mainContent: [
            '“......昔涟是。哭着诞生的。脆弱的。透明的。像是水晶的。”',
            '“昔涟是。笑着道别的。柔软的。粉色的。像是花的。”',
            '「二相乐园」将至，但开拓者们依然思念着被留在「昨天」的她......'
        ],
        mainContentBak: [
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
        countdownSub: '距离2026年11月12日13:00（4.6期间）还有',
        countdownLabels: ['天', '时', '分', '秒'],
        copyright: '© 2025 <a href="mailto:aetherwish@cyrene.icu">AetherWish</a>. <a href="https://sr.mihoyo.com/" target="_blank" rel="noopener noreferrer">《崩坏：星穹铁道》</a>音乐、美术及文本素材版权归 miHoYo 所有。',
        fontCredit: '本站使用了基于 OFL 1.1 协议开源的<a href="https://github.com/lxgw/kose-font/releases/tag/v3.126" target="_blank" rel="noopener noreferrer">小赖字体等宽版本</a>',
        statistics: {
            totalViews: '总访问量',
            individualVisitors: '总访客数',
            viewsUnit: '次',
            visitorsUnit: '人'
        },
        videoUnsupported: '当前浏览器不支持视频播放哦♪',
        backToTop: '返回顶部'
    },
    'en': {
        langToggle: '你好，世界',
        calendarToggle: 'Amphoreus calendar',
        mainContent: [
            '&#39;......Cyrene <b>was</b>, crying when she was born. Fragile. Transparent. Like a crystal.&#39;',
            '&#39;Cyrene <b>was</b>, smiling when she said goodbye. Soft. Pink. Like a flower.&#39;',
            '<em>Planarcadia</em> is to arrive. Still, Trailblazers will miss HER who was left in YESTERDAY.'
        ],
        mainContentBak: [
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
        countdownSub: 'Time until Nov 12, 2026 1:00 PM (during ver.4.6)',
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
        const calendarToggleText = document.getElementById('calendarToggleText');
        if (calendarToggleText) {
            calendarToggleText.textContent = this.t('calendarToggle');
        }

        // 更新主内容区域
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            // 先清空内容
            mainContent.innerHTML = '';

            // 获取当前语言的内容
            const contentArray = this.t('mainContent');

            // 填充内容
            contentArray.forEach(paragraph => {
                const p = document.createElement('p');
                p.innerHTML = paragraph; // 使用innerHTML支持内部标签
                mainContent.appendChild(p);
            });
        }

        // 更新倒计时主文本 - 重要：需要立即更新倒计时文本
        this.updateCountdownText();

        // 更新倒计时副文本
        const countdownSubText = document.getElementById('countdownSubText');
        if (countdownSubText) {
            countdownSubText.textContent = this.t('countdownSub');
        }

        // 更新倒计时标签
        const daysLabel = document.getElementById('daysLabel');
        const hoursLabel = document.getElementById('hoursLabel');
        const minutesLabel = document.getElementById('minutesLabel');
        const secondsLabel = document.getElementById('secondsLabel');

        if (daysLabel) daysLabel.textContent = this.t('countdownLabels')[0];
        if (hoursLabel) hoursLabel.textContent = this.t('countdownLabels')[1];
        if (minutesLabel) minutesLabel.textContent = this.t('countdownLabels')[2];
        if (secondsLabel) secondsLabel.textContent = this.t('countdownLabels')[3];

        // 更新版权信息
        const copyrightNotice = document.getElementById('copyrightNotice');
        if (copyrightNotice) {
            copyrightNotice.innerHTML = this.t('copyright');
        }

        // 更新字体版权信息
        const fontCredit = document.getElementById('fontCredit');
        if (fontCredit) {
            fontCredit.innerHTML = this.t('fontCredit');
        }

        // 更新统计文本
        const totalViewsLabel = document.getElementById('totalViewsLabel');
        const individualVisitorsLabel = document.getElementById('individualVisitorsLabel');
        const viewsUnit = document.getElementById('viewsUnit');
        const visitorsUnit = document.getElementById('visitorsUnit');

        if (totalViewsLabel) {
            totalViewsLabel.textContent = this.t('statistics', 'totalViews');
        }
        if (individualVisitorsLabel) {
            individualVisitorsLabel.textContent = this.t('statistics', 'individualVisitors');
        }
        if (viewsUnit) {
            viewsUnit.textContent = this.t('statistics', 'viewsUnit');
        }
        if (visitorsUnit) {
            visitorsUnit.textContent = this.t('statistics', 'visitorsUnit');
        }

        // 更新视频不支持文本
        const videoUnsupportedText = document.getElementById('videoUnsupportedText');
        if (videoUnsupportedText) {
            videoUnsupportedText.textContent = this.t('videoUnsupported');
        }

        // 更新返回顶部按钮的title属性
        const backToTopBtn = document.getElementById('backToTop');
        if (backToTopBtn) {
            backToTopBtn.setAttribute('title', this.t('backToTop'));
        }
    }

    // 更新倒计时文本 - 独立方法，可在语言切换时立即调用
    updateCountdownText() {
        // 计算剩余时间以确定显示的文本
        const targetDate = new Date('2026-11-12T13:00:00').getTime();
        const currentDate = new Date().getTime();
        const timeDifference = targetDate - currentDate;

        let daysRemaining;
        if (timeDifference <= 0) {
            daysRemaining = -1; // 已结束
        } else {
            daysRemaining = timeDifference / (1000 * 60 * 60 * 24); // 以天为单位
        }

        this.updateCountdownMainText(daysRemaining);
    }

    // 更新倒计时主文本的特殊方法（考虑剩余时间）
    updateCountdownMainText(daysRemaining) {
        const countdownMainText = document.getElementById('countdownMainText');
        let text;

        if (daysRemaining <= 0) {
            text = this.t('countdownMainExpired');
        } else if (daysRemaining < 1) {
            text = this.t('countdownMainTomorrow');
        } else {
            text = this.t('countdownMain');
        }

        if (countdownMainText) {
            countdownMainText.textContent = text;
        }
    }
}

// 创建全局翻译管理器实例
let translationManager;