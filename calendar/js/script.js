// 月历配置数据
const monthsData = [
    {
        name: "门关月", // 一月
        title: "不论晴天还是雨天，进入梦乡以前，\n记得和自己说一声：「明天见」！",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/month_1.webp')",
        luckyFlower: "铃兰",
        themeColor: "#8A2B3B"
    },
    {
        name: "平衡月", // 二月
        title: "无我，即无世界。\n去思，去见，去征服。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/month_2.webp')",
        luckyFlower: "帝王花",
        themeColor: "#1A3A60"
    },
    {
        name: "长夜月", // 三月
        title: "如果岁月是个无穷的轮回——\n那就忘掉不断重复的苦涩，单独记住每个快乐的瞬间吧！",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/month_3.webp')",
        luckyFlower: "四叶草",
        themeColor: "#5A2A4A"
    },
    {
        name: "耕耘月", // 四月
        title: "笔终会折断，墨终会耗尽，\n生命终会逝去，但思想将在史诗中永垂不朽。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/month_4.webp')",
        luckyFlower: "兰花",
        themeColor: "#2A3A2A"
    },
    {
        name: "欢喜月", // 五月
        title: "世事如沧海，潮起潮落，一切终会在浪中消逝。\n所以，请在生命的每一刻都纵情高歌吧。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/month_5.webp')",
        luckyFlower: "睡莲",
        themeColor: "#2A3A6A"
    },
    {
        name: "长昼月", // 六月
        title: "多望望天，多笑一笑；\n好多缠人的病痛，最怕乐观这剂良药！",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/month_6.webp')",
        luckyFlower: "向日葵",
        themeColor: "#8A2A4A"
    },
    {
        name: "自由月", // 七月
        title: "每个人的心中都住着一个英雄。\n拥抱它，然后去追逐太阳吧。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/month_7.webp')",
        luckyFlower: "勿忘我",
        themeColor: "#1A3A6A"
    },
    {
        name: "收获月", // 八月
        title: "「真理是溶解世界万物的溶剂，因而绝无法在客观上存在」——\n对此，本人心中已有绝妙的证明。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/month_8.webp')",
        luckyFlower: "无尽夏",
        themeColor: "#2A4A4A"
    },
    {
        name: "拾线月", // 九月
        title: "信任与无私，是世上最美丽的两件华服：\n一件赠予他人，一件装扮自己。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/month_9.webp')",
        luckyFlower: "金桂",
        themeColor: "#5A5A2A"
    },
    {
        name: "纷争月", // 十月
        title: "去杀死玩耍，游戏便会诞生。\n去杀死纷争，荣光必然降临。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/month_10.webp')",
        luckyFlower: "石榴花",
        themeColor: "#8A3A2A"
    },
    {
        name: "哀悼月", // 十一月
        title: "若心灵仍有余裕，请稍许分出些温柔，\n轻抚身边美好的一切吧。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/month_11.webp')",
        luckyFlower: "金鱼草",
        themeColor: "#5A3A6A"
    },
    {
        name: "机缘月", // 十二月
        title: "别怕摔，跑起来！\n命运就是只迟缓的若虫，它压根抓不住你！",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/img/month_12.webp')",
        luckyFlower: "猫草",
        themeColor: "#3A3A6A"
    }
];

// 当前月份索引 (0-11)
let currentMonthIndex = 0;


// 获取DOM元素
const imageSection = document.getElementById('imageSection');
const monthText = document.getElementById('monthText');
const monthTitleLine1 = document.getElementById('monthTitleLine1');
const monthTitleLine2 = document.getElementById('monthTitleLine2');
const currentMonthYear = document.getElementById('currentMonthYear');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const luckyFlowerName = document.getElementById('luckyFlowerName');
const calendarGrid = document.querySelector('.calendar-grid');
const toggleCalendarBtn = document.getElementById('toggleCalendar');
const calendarSection = document.querySelector('.calendar-section');
const usageToggle = document.getElementById('usageToggle');
const copyrightToggle = document.getElementById('copyrightToggle');
const statsToggle = document.getElementById('statsToggle');
const usageTooltip = document.getElementById('usageTooltip');
const copyrightTooltip = document.getElementById('copyrightTooltip');
const statsTooltip = document.getElementById('statsTooltip');
const capsuleUsageToggle = document.getElementById('capsuleUsageToggle');
const capsuleCopyrightToggle = document.getElementById('capsuleCopyrightToggle');
const capsuleStatsToggle = document.getElementById('capsuleStatsToggle');
const capsuleUsageTooltip = document.getElementById('capsuleUsageTooltip');
const capsuleCopyrightTooltip = document.getElementById('capsuleCopyrightTooltip');
const capsuleStatsTooltip = document.getElementById('capsuleStatsTooltip');
const themeToggleBtn = document.getElementById('themeToggle');

// 初始化日历
function initCalendar() {
    initTheme();
    updateCalendar();
    setupEventListeners();
    updateStats();
}

// Initialize theme based on user preference or system setting
function initTheme() {
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    } else {
        // Check system preference
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemPrefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateThemeIcon('dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            updateThemeIcon('light');
        }
    }
}

// Update theme icon based on current theme
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        // New moon icon for dark mode with custom SVG
        themeToggleBtn.innerHTML = `
            <svg class="theme-toggle-icon" viewBox="0 0 1067 1024" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path d="M611.448738 766.649841q-137.814436 0-233.189327-95.374891T282.88452 438.085623q0-125.949617 82.141055-218.586472T574.941603 111.346763q11.864819-1.825357 20.991602 3.194374t14.602855 13.233836q5.47607 8.214105 5.932409 19.166246t-6.845088 20.991603q-15.515532 23.729638-23.273299 50.197311t-7.757766 55.673382q0 82.141054 57.498738 139.639792t139.639793 57.498738q28.29303 0 56.12972-8.214105t49.740972-22.81696q10.039462-6.388749 20.535263-5.932409T920.846709 438.998302q9.126784 4.563392 14.146515 13.690175t3.194375 21.904281q-12.777497 125.949617-107.23971 209.00335T611.448738 766.649841z m0-73.014271q80.315698 0 144.203184-44.264901T848.745117 533.916853q-18.253568 4.563392-36.507135 7.301427t-36.507135 2.738036q-112.259441 0-191.206121-78.946681T505.578046 273.803515q0-18.253568 2.738035-36.507136t7.301427-36.507135q-71.188914 29.205708-115.453815 93.093195T355.898791 438.085623q0 105.870692 74.839627 180.71032t180.71032 74.839627z m-9.126784-246.423163z" fill="white"/>
            </svg>
        `;
    } else {
        // New sun icon for light mode with custom SVG
        themeToggleBtn.innerHTML = `
            <svg class="theme-toggle-icon" viewBox="0 0 1235 1024" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path d="M664.617548 512.448935q42.704078 0 72.596933-29.892854t29.892854-72.596933q0-42.704078-29.892854-72.596932t-72.596933-29.892855q-42.704078 0-72.596932 29.892855t-29.892855 72.596932q0 42.704078 29.892855 72.596933t72.596932 29.892854z m0 68.326525q-70.888769 0-120.85254-49.963771T493.801236 409.959148q0-70.888769 49.963772-120.85254T664.617548 239.142836q70.888769 0 120.852541 49.963772T835.43386 409.959148q0 70.888769-49.963771 120.852541T664.617548 580.77546zM322.984925 444.12241q-14.519386 0-24.341325-9.821937T288.821662 409.959148q0-14.519386 9.821938-24.341324T322.984925 375.795886h68.326524q14.519386 0 24.341325 9.821938T425.474712 409.959148q0 14.519386-9.821938 24.341325T391.311449 444.12241H322.984925z m614.938722 0q-14.519386 0-24.341325-9.821937T903.760385 409.959148q0-14.519386 9.821937-24.341324T937.923647 375.795886h68.326525q14.519386 0 24.341324 9.821938T1040.413434 409.959148q0 14.519386-9.821938 24.341325T1006.250172 444.12241h-68.326525zM664.617548 170.816312q-14.519386 0-24.341324-9.821938T630.454286 136.653049v-68.326524q0-14.519386 9.821938-24.341325T664.617548 34.163262q14.519386 0 24.341325 9.821938T698.78081 68.326525v68.326524q0 14.519386-9.821937 24.341325T664.617548 170.816312z m0 614.938722q-14.519386 0-24.341324-9.821938T630.454286 751.591772v-68.326525q0-14.519386 9.821938-24.341325T664.617548 649.101985q14.519386 0 24.341325 9.821937T698.78081 683.265247v68.326525q0 14.519386-9.821937 24.341324T664.617548 785.755034zM447.680832 240.851l-36.725507-35.871426q-10.248979-9.394897-9.821938-23.914284t9.821938-24.768365q10.248979-10.248979 24.768365-10.248978t23.914284 10.248978l35.871426 36.725507q9.394897 10.248979 9.394897 23.914284t-9.394897 23.914284q-9.394897 10.248979-23.487243 9.821937T447.680832 240.851z m421.91629 422.770371l-35.871425-36.725507q-9.394897-10.248979-9.394897-24.341324t9.394897-23.487243q9.394897-10.248979 23.487243-9.821938T881.554264 579.067297l36.725507 35.871425q10.248979 9.394897 9.821938 23.914284T918.279771 663.621371q-10.248979 10.248979-24.768365 10.248979t-23.914284-10.248979z m-35.871425-422.770371q-10.248979-9.394897-9.821938-23.487243T833.725697 193.022432l35.871425-36.725507q9.394897-10.248979 23.914284-9.821938t24.768365 9.821938q10.248979 10.248979 10.248979 24.768365t-10.248979 23.914284l-36.725507 35.871426q-10.248979 9.394897-23.914284 9.394897t-23.914283-9.394897zM410.955325 663.621371q-10.248979-10.248979-10.248978-24.768365t10.248978-23.914284l36.725507-35.871425q10.248979-9.394897 24.341325-9.394897t23.487243 9.394897q10.248979 9.394897 9.821937 23.487243T495.5094 626.895864l-35.871426 36.725507q-9.394897 10.248979-23.914284 9.821938T410.955325 663.621371z m253.662223-253.662223z" fill="white"/>
            </svg>
        `;
    }
}

// Toggle theme between light and dark
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        updateThemeIcon('light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        updateThemeIcon('dark');
    }

    // 重新应用当前月份的主题颜色以适应新的主题模式
    const monthData = monthsData[currentMonthIndex];
    applyThemeColor(monthData.themeColor);
}

// 更新日历显示
function updateCalendar() {
    const monthData = monthsData[currentMonthIndex];

    // 更新图片背景和月份信息
    imageSection.style.background = monthData.background;
    monthText.textContent = monthData.name;  // 使用月份代称 (如：门关月) 在图片区域

    // 分割标题文本为两行
    const titleLines = monthData.title.split('\n');
    monthTitleLine1.textContent = titleLines[0] || '';
    monthTitleLine2.textContent = titleLines[1] || '';

    luckyFlowerName.textContent = monthData.luckyFlower;
    currentMonthYear.textContent = `2026年${currentMonthIndex + 1}月`;  // 在日历头部显示数字月份 (如：1月)

    // 应用主题颜色到导航按钮和日历
    applyThemeColor(monthData.themeColor);

    // 生成当月日历
    generateCalendarDays(currentMonthIndex, 2026);
}

// 应用主题颜色到界面元素
function applyThemeColor(themeColor) {
    // 检查当前是否为暗色模式
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';

    let displayThemeColor = themeColor;

    // 如果是暗色模式，使用处理后的颜色以确保可见性
    if (isDarkMode) {
        displayThemeColor = getLighterColor(themeColor, 30); // 提亮30%以确保在暗色背景上可见
    }

    // 为导航按钮设置CSS变量，根据是否为暗色模式调整颜色
    document.documentElement.style.setProperty('--current-theme-color', displayThemeColor);

    // 更新日历网格边框颜色以匹配主题
    if (calendarGrid) {
        calendarGrid.style.borderColor = themeColor;
    }

    // 设置当月年标题的颜色
    currentMonthYear.style.color = displayThemeColor;

    // 更新周末日期的颜色
    updateWeekendColors(themeColor);
}

// 更新周末日期的颜色
function updateWeekendColors(themeColor) {
    // 使用主题色创建一个较浅的周末背景色
    const weekendColor = getLighterColor(themeColor, 40); // 使颜色变浅40%

    // 获取所有周末日期元素并应用颜色
    const weekendDays = document.querySelectorAll('.calendar-day.weekend');
    weekendDays.forEach(day => {
        day.style.background = weekendColor;
    });
}

// 计算较浅颜色的辅助函数
function getLighterColor(hexColor, percent) {
    // 将十六进制颜色转换为RGB
    let r = parseInt(hexColor.substring(1, 3), 16);
    let g = parseInt(hexColor.substring(3, 5), 16);
    let b = parseInt(hexColor.substring(5, 7), 16);

    // 增加亮度
    r = Math.min(255, r + Math.floor((255 - r) * percent / 100));
    g = Math.min(255, g + Math.floor((255 - g) * percent / 100));
    b = Math.min(255, b + Math.floor((255 - b) * percent / 100));

    // 转换回十六进制
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// 为每个月份定义特定的背景渐变色作为图片加载失败时的回退
const monthFallbackColors = [
    "linear-gradient(135deg, #6e8efb, #a777e3)", // 1月 - 门关月
    "linear-gradient(135deg, #a6c0fe, #f68084)", // 2月 - 平衡月
    "linear-gradient(135deg, #76b852, #8dc26f)", // 3月 - 长夜月
    "linear-gradient(135deg, #e65c00, #f9d423)", // 4月 - 耕耘月
    "linear-gradient(135deg, #d299c2, #fef9d7)", // 5月 - 欢喜月
    "linear-gradient(135deg, #8baaaa, #ae8b9c)", // 6月 - 长昼月
    "linear-gradient(135deg, #ff9a9e, #fecfef)", // 7月 - 自由月
    "linear-gradient(135deg, #667eea, #764ba2)", // 8月 - 收获月
    "linear-gradient(135deg, #f093fb, #f5576c)", // 9月 - 拾线月
    "linear-gradient(135deg, #43e97b, #38f9d7)", // 10月 - 纷争月
    "linear-gradient(135deg, #fa709a, #fee140)", // 11月 - 哀悼月
    "linear-gradient(135deg, #56ab2f, #a8e063)"  // 12月 - 机缘月
];

// 处理图片加载错误，提供背景色回退
function handleImageError() {
    // 如果图片加载失败，使用对应月份的渐变背景色
    imageSection.style.background = monthFallbackColors[currentMonthIndex];
}

// 生成日历天数
function generateCalendarDays(month, year) {
    // 创建当月第一天和最后一天
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 获取当月第一天是星期几 (0=Sunday, 1=Monday, ..., 6=Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // 清空现有日期
    calendarDays.innerHTML = '';

    // 添加当月之前的空白日期
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }

    // 添加当月的所有日期
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        // 检查是否为周末
        const currentDay = new Date(year, month, day);
        if (currentDay.getDay() === 0 || currentDay.getDay() === 6) {
            dayElement.classList.add('weekend');
        }

        // 特殊处理：如果是11月12日，显示无限符号
        if (month === 10 && day === 12) { // Month 10 is November (0-indexed)
            dayElement.textContent = '∞';
            dayElement.classList.add('infinity-day');
        } else {
            dayElement.textContent = day;
        }

        calendarDays.appendChild(dayElement);
    }

    // 确保总格子数为42（6行×7列），如果不足则补空
    const totalCells = firstDayOfWeek + lastDay.getDate();
    const remainingCells = 42 - totalCells;
    for (let i = 0; i < remainingCells; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }

    // 更新周末颜色 after the calendar is generated
    const currentMonthData = monthsData[currentMonthIndex];
    updateWeekendColors(currentMonthData.themeColor);
}

// 月份切换动画状态
let isAnimating = false;

// 切换到上一个月
function goToPrevMonth() {
    // 如果动画正在进行，忽略新的切换请求
    if (isAnimating) {
        return;
    }

    // 设置动画状态为进行中
    isAnimating = true;

    // 添加滑动动画到日历部分，而非整个calendar-container
    const calendarDays = document.getElementById('calendarDays');
    const currentDaysHTML = calendarDays.innerHTML;

    // 添加淡出动画
    calendarDays.style.opacity = '0';
    calendarDays.style.transition = 'opacity 0.15s ease-in-out';

    // 在动画结束后更新日历
    setTimeout(() => {
        currentMonthIndex--;
        if (currentMonthIndex < 0) {
            currentMonthIndex = 11; // 循环到十二月
        }
        updateCalendar();

        // 添加淡入效果
        calendarDays.style.opacity = '0';
        void calendarDays.offsetWidth; // 强制重排
        calendarDays.style.transition = 'opacity 0.15s ease-in-out';
        calendarDays.style.opacity = '1';

        updateStats();

        // 稍后允许新动画
        setTimeout(() => {
            calendarDays.style.transition = '';
            isAnimating = false;
        }, 200);
    }, 150); // 在淡出完成后更新
}

// 切换到下一个月
function goToNextMonth() {
    // 如果动画正在进行，忽略新的切换请求
    if (isAnimating) {
        return;
    }

    // 设置动画状态为进行中
    isAnimating = true;

    // 添加滑动动画到日历部分，而非整个calendar-container
    const calendarDays = document.getElementById('calendarDays');
    const currentDaysHTML = calendarDays.innerHTML;

    // 添加淡出动画
    calendarDays.style.opacity = '0';
    calendarDays.style.transition = 'opacity 0.15s ease-in-out';

    // 在动画结束后更新日历
    setTimeout(() => {
        currentMonthIndex++;
        if (currentMonthIndex > 11) {
            currentMonthIndex = 0; // 循环到一月
        }
        updateCalendar();

        // 添加淡入效果
        calendarDays.style.opacity = '0';
        void calendarDays.offsetWidth; // 强制重排
        calendarDays.style.transition = 'opacity 0.15s ease-in-out';
        calendarDays.style.opacity = '1';

        updateStats();

        // 稍后允许新动画
        setTimeout(() => {
            calendarDays.style.transition = '';
            isAnimating = false;
        }, 200);
    }, 150); // 在淡出完成后更新
}

// 设置事件监听器
function setupEventListeners() {
    prevMonthBtn.addEventListener('click', goToPrevMonth);
    nextMonthBtn.addEventListener('click', goToNextMonth);

    // 隐藏/显示月历按钮事件
    toggleCalendarBtn.addEventListener('click', toggleCalendarVisibility);

    // 深色模式切换按钮事件
    themeToggleBtn.addEventListener('click', toggleTheme);

    // 为版权信息和统计信息添加点击事件（用于触屏设备）
    copyrightToggle.addEventListener('click', function() {
        copyrightTooltip.style.opacity = copyrightTooltip.style.opacity === '1' ? '0' : '1';
        copyrightTooltip.style.visibility = copyrightTooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
    });

    statsToggle.addEventListener('click', function() {
        statsTooltip.style.opacity = statsTooltip.style.opacity === '1' ? '0' : '1';
        statsTooltip.style.visibility = statsTooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
    });

    usageToggle.addEventListener('click', function() {
        usageTooltip.style.opacity = usageTooltip.style.opacity === '1' ? '0' : '1';
        usageTooltip.style.visibility = usageTooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
    });

    // 添加鼠标悬停事件支持
    usageToggle.addEventListener('mouseenter', function() {
        usageTooltip.style.opacity = '1';
        usageTooltip.style.visibility = 'visible';
    });

    usageToggle.addEventListener('mouseleave', function() {
        usageTooltip.style.opacity = '0';
        usageTooltip.style.visibility = 'hidden';
    });

    copyrightToggle.addEventListener('mouseenter', function() {
        copyrightTooltip.style.opacity = '1';
        copyrightTooltip.style.visibility = 'visible';
    });

    copyrightToggle.addEventListener('mouseleave', function() {
        copyrightTooltip.style.opacity = '0';
        copyrightTooltip.style.visibility = 'hidden';
    });

    statsToggle.addEventListener('mouseenter', function() {
        statsTooltip.style.opacity = '1';
        statsTooltip.style.visibility = 'visible';
    });

    statsToggle.addEventListener('mouseleave', function() {
        statsTooltip.style.opacity = '0';
        statsTooltip.style.visibility = 'hidden';
    });

    // 为胶囊底部的版权信息和统计信息添加点击事件（用于触屏设备）
    capsuleUsageToggle.addEventListener('click', function() {
        capsuleUsageTooltip.style.opacity = capsuleUsageTooltip.style.opacity === '1' ? '0' : '1';
        capsuleUsageTooltip.style.visibility = capsuleUsageTooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
    });

    capsuleCopyrightToggle.addEventListener('click', function() {
        capsuleCopyrightTooltip.style.opacity = capsuleCopyrightTooltip.style.opacity === '1' ? '0' : '1';
        capsuleCopyrightTooltip.style.visibility = capsuleCopyrightTooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
    });

    capsuleStatsToggle.addEventListener('click', function() {
        capsuleStatsTooltip.style.opacity = capsuleStatsTooltip.style.opacity === '1' ? '0' : '1';
        capsuleStatsTooltip.style.visibility = capsuleStatsTooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
    });

    // 添加鼠标悬停事件支持
    capsuleUsageToggle.addEventListener('mouseenter', function() {
        capsuleUsageTooltip.style.opacity = '1';
        capsuleUsageTooltip.style.visibility = 'visible';
    });

    capsuleUsageToggle.addEventListener('mouseleave', function() {
        capsuleUsageTooltip.style.opacity = '0';
        capsuleUsageTooltip.style.visibility = 'hidden';
    });

    capsuleCopyrightToggle.addEventListener('mouseenter', function() {
        capsuleCopyrightTooltip.style.opacity = '1';
        capsuleCopyrightTooltip.style.visibility = 'visible';
    });

    capsuleCopyrightToggle.addEventListener('mouseleave', function() {
        capsuleCopyrightTooltip.style.opacity = '0';
        capsuleCopyrightTooltip.style.visibility = 'hidden';
    });

    capsuleStatsToggle.addEventListener('mouseenter', function() {
        capsuleStatsTooltip.style.opacity = '1';
        capsuleStatsTooltip.style.visibility = 'visible';
    });

    capsuleStatsToggle.addEventListener('mouseleave', function() {
        capsuleStatsTooltip.style.opacity = '0';
        capsuleStatsTooltip.style.visibility = 'hidden';
    });

    // 键盘事件监听
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            goToPrevMonth();
        } else if (event.key === 'ArrowRight') {
            goToNextMonth();
        }
    });

    // 监听窗口大小变化以处理横竖屏切换
    window.addEventListener('resize', handleOrientationChange);

    // Listen for system theme preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            // Only change theme automatically if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                if (e.matches) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    updateThemeIcon('dark');
                } else {
                    document.documentElement.removeAttribute('data-theme');
                    updateThemeIcon('light');
                }
            }
        });
    }
}

// 切换日历可见性
function toggleCalendarVisibility() {
    const calendarContainer = document.querySelector('.calendar-container');
    const capsuleFooter = document.getElementById('capsuleFooter');

    // 检查是否有正在进行的动画
    if (calendarContainer.classList.contains('animating') || capsuleFooter.classList.contains('animating')) {
        // 如果有动画正在进行，先移除类
        calendarContainer.classList.remove('animating');
        capsuleFooter.classList.remove('animating');

        // 清除可能的定时器
        if (window.calendarTransitionTimer) {
            clearTimeout(window.calendarTransitionTimer);
        }
    }

    // 添加动画状态类
    calendarContainer.classList.add('animating');
    capsuleFooter.classList.add('animating');

    // Check if calendar is currently visible by checking if it's not faded out
    const isCalendarVisible = parseFloat(calendarContainer.style.opacity) !== 0 ||
                              calendarContainer.style.opacity === '' ||
                              calendarContainer.style.display !== 'none';

    if (isCalendarVisible) {
        // 隐藏日历
        calendarContainer.style.opacity = '0';
        // Delay hiding calendar to allow transition to complete
        window.calendarTransitionTimer = setTimeout(() => {
            calendarContainer.style.display = 'none';
            calendarContainer.classList.remove('animating');

            capsuleFooter.classList.add('show');
            capsuleFooter.classList.remove('animating');
            // Ensure stats are synchronized when showing capsule
            syncStatsToCapsule();
        }, 500); // Match the CSS transition duration
        toggleCalendarBtn.innerHTML = `
            <svg class="toggle-icon" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path d="M917.333333 573.866667l-87.466666-87.466667c34.133333-32 66.133333-68.266667 91.733333-108.8 8.533333-14.933333 4.266667-34.133333-10.666667-44.8-14.933333-8.533333-34.133333-4.266667-44.8 10.666667-76.8 125.866667-209.066667 200.533333-356.266666 200.533333-145.066667 0-279.466667-74.666667-354.133334-198.4-8.533333-14.933333-29.866667-19.2-44.8-10.666667-14.933333 8.533333-19.2 29.866667-10.666666 44.8 25.6 40.533333 55.466667 76.8 91.733333 108.8l-85.333333 85.333334c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333l91.733333-91.733334c38.4 25.6 81.066667 46.933333 125.866667 59.733334l-34.133333 130.133333c-4.266667 17.066667 6.4 34.133333 23.466666 38.4 2.133333 0 6.4 2.133333 8.533334 2.133333 14.933333 0 27.733333-8.533333 29.866666-23.466666l36.266667-132.266667c25.6 4.266667 51.2 6.4 78.933333 6.4 27.733333 0 55.466667-2.133333 83.2-6.4l36.266667 132.266667c4.266667 14.933333 17.066667 23.466667 29.866667 23.466666 2.133333 0 6.4 0 8.533333-2.133333 17.066667-4.266667 27.733333-21.333333 23.466667-38.4L661.333333 584.533333c44.8-12.8 85.333333-34.133333 123.733334-59.733333l91.733333 91.733333c6.4 6.4 14.933333 8.533333 23.466667 8.533334s17.066667-2.133333 23.466666-8.533334c6.4-10.666667 6.4-29.866667-6.4-42.666666z" fill="white"/>
            </svg>
        `;
    } else {
        // 显示日历
        // Make sure the calendar container is displayed before starting the animation
        calendarContainer.style.display = 'grid';
        // Trigger reflow to ensure the display change is applied
        void calendarContainer.offsetWidth;
        // Start the fade-in animation
        calendarContainer.style.opacity = '0'; // Start with opacity 0
        // Trigger reflow again
        void calendarContainer.offsetWidth;
        // Apply the fade-in animation class
        calendarContainer.classList.add('calendar-fade-in');
        // Set opacity to 1 after animation starts
        setTimeout(() => {
            calendarContainer.style.opacity = '1';
        }, 10);

        // Remove animation class after animation completes to prevent it from playing again
        setTimeout(() => {
            calendarContainer.classList.remove('calendar-fade-in');
        }, 500); // Match the animation duration

        // Delay hiding capsule to allow transition
        window.calendarTransitionTimer = setTimeout(() => {
            capsuleFooter.classList.remove('show');
            capsuleFooter.classList.remove('animating');
            calendarContainer.classList.remove('animating');
        }, 10);
        toggleCalendarBtn.innerHTML = `
            <svg class="toggle-icon" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path d="M512 255.488c-309.76 0-433.664 309.76-433.664 309.76s123.904 309.76 433.664 309.76 433.664-309.76 433.664-309.76-123.904-309.76-433.664-309.76z m0 495.616c-102.4 0-185.856-83.456-185.856-185.856S409.088 379.392 512 379.392c102.4 0 185.856 82.944 185.856 185.856S614.4 751.104 512 751.104z" fill="white"/>
                <path d="M604.672 565.248c0 51.2-41.472 92.672-92.672 92.672s-92.672-41.472-92.672-92.672c0-51.2 41.472-92.672 92.672-92.672 51.2 0 92.672 41.472 92.672 92.672z" fill="white"/>
            </svg>
        `;
    }
}

// 处理横竖屏切换
function handleOrientationChange() {
    // 检测当前屏幕方向并相应调整布局
    const isPortrait = window.innerHeight > window.innerWidth;

    // 可以在这里添加额外的横竖屏切换逻辑
    if (isPortrait) {
        document.body.classList.add('portrait');
        document.body.classList.remove('landscape');
    } else {
        document.body.classList.add('landscape');
        document.body.classList.remove('portrait');
    }
}

// 更新统计信息
function updateStats() {
    // 监听busuanzi统计值的变化并同步到胶囊视图
    if (window.Busuanzi) {
        // 如果Busuanzi已加载，同步值
        syncStatsToCapsule();
    } else {
        // 如果Busuanzi未加载，等待其加载完成
        const checkBusuanzi = setInterval(() => {
            if (window.Busuanzi && document.getElementById('busuanzi_value_site_pv') && document.getElementById('busuanzi_value_site_uv')) {
                syncStatsToCapsule();
                clearInterval(checkBusuanzi);
            }
        }, 100);
    }
}

// 同步统计信息到胶囊视图
function syncStatsToCapsule() {
    const pvElement = document.getElementById('busuanzi_value_site_pv');
    const uvElement = document.getElementById('busuanzi_value_site_uv');
    const capsulePvElement = document.getElementById('capsule_pv_value');
    const capsuleUvElement = document.getElementById('capsule_uv_value');

    if (pvElement && uvElement && capsulePvElement && capsuleUvElement) {
        // 同步PV值
        capsulePvElement.textContent = pvElement.textContent;

        // 同步UV值
        capsuleUvElement.textContent = uvElement.textContent;
    }

    // 监听Busuanzi统计的更新事件
    if (window.Busuanzi && !window.busuanziObserver) {
        // Set up an interval to periodically sync the values
        window.busuanziObserver = setInterval(syncStatsToCapsule, 1000); // Update every second
    }
}

// 初始化日历
window.onload = initCalendar;

// 页面加载完成后检查初始方向
window.addEventListener('load', handleOrientationChange);

// 清理定时器以避免内存泄漏
window.addEventListener('beforeunload', function() {
    if (window.busuanziObserver) {
        clearInterval(window.busuanziObserver);
    }
});