// 倒计时功能
function updateCountdown() {
    // 设置目标日期为2026年11月12日中午12点整
    const targetDate = new Date('2026-11-12T12:00:00').getTime();
    const currentDate = new Date().getTime();

    // 计算时间差
    const timeDifference = targetDate - currentDate;

    // 如果倒计时结束
    if (timeDifference <= 0) {
        document.getElementById('days').innerText = '00';
        document.getElementById('hours').innerText = '00';
        document.getElementById('minutes').innerText = '00';
        document.getElementById('seconds').innerText = '00';

        // 当倒计时结束时，显示特殊文本
        if (document.documentElement.lang === 'zh-CN') {
            document.querySelector('.countdown-main-text-zh').textContent = '已到达';
        } else {
            document.querySelector('.countdown-main-text-en').textContent = 'Arrived';
        }
        return;
    }

    // 计算天、小时、分钟、秒
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // 更新倒计时显示
    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');

    // 根据天数更新文本
    const countdownMainTextZh = document.querySelector('.countdown-main-text-zh');
    const countdownMainTextEn = document.querySelector('.countdown-main-text-en');

    if (days < 1) {
        // 剩余不到一天时，显示"明天见"和对应的英文
        if (document.documentElement.lang === 'zh-CN') {
            countdownMainTextZh.textContent = '明天见，「PHILIA093」';
        } else {
            countdownMainTextEn.textContent = 'See you tomorrow, PHILIA093';
        }
    } else {
        // 剩余一天或以上时，显示"下次见"和对应的英文
        if (document.documentElement.lang === 'zh-CN') {
            countdownMainTextZh.textContent = '下次见，「PHILIA093」';
        } else {
            countdownMainTextEn.textContent = 'See you soon, PHILIA093';
        }
    }
}

// 语言切换功能
function initLanguageToggle() {
    const langToggleBtn = document.getElementById('langToggle');
    const chineseContent = document.querySelector('.chinese-content');
    const englishContent = document.querySelector('.english-content');
    const chineseCountdownText = document.querySelector('.chinese-countdown-text');
    const englishCountdownText = document.querySelector('.english-countdown-text');
    const chineseLabels = document.querySelectorAll('.label');
    const englishLabels = document.querySelectorAll('.label-en');
    const homeTextZh = document.querySelector('.home-text-zh');  // May be null since home button was removed
    const homeTextEn = document.querySelector('.home-text-en');  // May be null since home button was removed
    const chineseFontCredit = document.querySelector('.font-credit-zh');
    const englishFontCredit = document.querySelector('.font-credit-en');
    const countdownMainTextZh = document.querySelector('.countdown-main-text-zh');
    const countdownMainTextEn = document.querySelector('.countdown-main-text-en');
    const countdownSubText = document.querySelector('.countdown-sub-text');
    const calendarToggleTextZh = document.querySelector('.calendar-toggle-text-zh');
    const calendarToggleTextEn = document.querySelector('.calendar-toggle-text-en');
    let isEnglish = false;

    langToggleBtn.addEventListener('click', function() {
        isEnglish = !isEnglish;

        if (isEnglish) {
            // 切换到英文
            langToggleBtn.textContent = '你好，世界';
            chineseContent.style.display = 'none';
            englishContent.style.display = 'block';
            chineseCountdownText.style.display = 'none';
            englishCountdownText.style.display = 'block';

            // 显示英文标签
            chineseLabels.forEach(label => {
                label.style.display = 'none';
            });
            englishLabels.forEach(label => {
                label.style.display = 'block';
            });

            // 切换倒计时文本
            if (countdownMainTextZh) countdownMainTextZh.style.display = 'none';
            if (countdownMainTextEn) countdownMainTextEn.style.display = 'inline';
            chineseCountdownText.style.display = 'none';
            englishCountdownText.style.display = 'inline';

            // 切换字体版权信息
            if (chineseFontCredit) chineseFontCredit.style.display = 'none';
            if (englishFontCredit) englishFontCredit.style.display = 'block';

            // 切换日历切换文本
            if (calendarToggleTextZh) calendarToggleTextZh.style.display = 'none';
            if (calendarToggleTextEn) calendarToggleTextEn.style.display = 'inline';

            // 更新页面语言属性
            document.documentElement.lang = 'en';
        } else {
            // 切换到中文
            langToggleBtn.textContent = 'Hello World';
            chineseContent.style.display = 'block';
            englishContent.style.display = 'none';
            chineseCountdownText.style.display = 'block';
            englishCountdownText.style.display = 'none';

            // 显示中文标签
            chineseLabels.forEach(label => {
                label.style.display = 'block';
            });
            englishLabels.forEach(label => {
                label.style.display = 'none';
            });

            // 切换倒计时文本
            if (countdownMainTextZh) countdownMainTextZh.style.display = 'inline';
            if (countdownMainTextEn) countdownMainTextEn.style.display = 'none';
            chineseCountdownText.style.display = 'inline';
            englishCountdownText.style.display = 'none';

            // 切换字体版权信息
            if (chineseFontCredit) chineseFontCredit.style.display = 'block';
            if (englishFontCredit) englishFontCredit.style.display = 'none';

            // 切换日历切换文本
            if (calendarToggleTextZh) calendarToggleTextZh.style.display = 'inline';
            if (calendarToggleTextEn) calendarToggleTextEn.style.display = 'none';

            // 更新页面语言属性
            document.documentElement.lang = 'zh-CN';
        }
    });
};


// 返回顶部功能
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');

    // 监听滚动事件
    window.addEventListener('scroll', function() {
        // 只要页面滚动超过一定距离（例如50px）就显示按钮
        if (window.pageYOffset > 50) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // 点击按钮时返回顶部
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 页面加载完成后开始倒计时和返回顶部功能
document.addEventListener('DOMContentLoaded', function() {
    // 立即更新一次倒计时
    updateCountdown();

    // 每秒更新一次倒计时
    setInterval(updateCountdown, 1000);

    // 初始化返回顶部功能
    initBackToTop();

    // 初始化语言切换功能
    initLanguageToggle();
});