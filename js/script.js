// 月历配置数据
const monthsData = [
    {
        name: "门关月", // 一月
        title: "不论晴天还是雨天，进入梦乡以前，\n记得和自己说一声：「明天见」！",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../img/month_1.webp')",
        luckyFlower: "铃兰",
        themeColor: "#8A2B3B"
    },
    {
        name: "平衡月", // 二月
        title: "无我，即无世界。\n去思，去见，去征服。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../img/month_2.webp')",
        luckyFlower: "帝王花",
        themeColor: "#1A3A60"
    },
    {
        name: "长夜月", // 三月
        title: "如果岁月是个无穷的轮回——\n那就忘掉不断重复的苦涩，单独记住每个快乐的瞬间吧！",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../img/month_3.webp')",
        luckyFlower: "四叶草",
        themeColor: "#5A2A4A"
    },
    {
        name: "耕耘月", // 四月
        title: "笔终会折断，墨终会耗尽，\n生命终会逝去，但思想将在史诗中永垂不朽。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../img/month_4.webp')",
        luckyFlower: "兰花",
        themeColor: "#2A3A2A"
    },
    {
        name: "欢喜月", // 五月
        title: "世事如沧海，潮起潮落，一切终会在浪中消逝。\n所以，请在生命的每一刻都纵情高歌吧。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../img/month_5.webp')",
        luckyFlower: "睡莲",
        themeColor: "#2A3A6A"
    },
    {
        name: "长昼月", // 六月
        title: "多望望天，多笑一笑；\n好多缠人的病痛，最怕乐观这剂良药！",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../img/month_6.webp')",
        luckyFlower: "向日葵",
        themeColor: "#8A2A4A"
    },
    {
        name: "自由月", // 七月
        title: "每个人的心中都住着一个英雄。\n拥抱它，然后去追逐太阳吧。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../img/month_7.webp')",
        luckyFlower: "勿忘我",
        themeColor: "#1A3A6A"
    },
    {
        name: "收获月", // 八月
        title: "「真理是溶解世界万物的溶剂，因而绝无法在客观上存在」——\n对此，本人心中已有绝妙的证明。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../img/month_8.webp')",
        luckyFlower: "无尽夏",
        themeColor: "#2A4A4A"
    },
    {
        name: "拾线月", // 九月
        title: "信任与无私，是世上最美丽的两件华服：\n一件赠予他人，一件装扮自己。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../img/month_9.webp')",
        luckyFlower: "金桂",
        themeColor: "#5A5A2A"
    },
    {
        name: "纷争月", // 十月
        title: "去杀死玩耍，游戏便会诞生。\n去杀死纷争，荣光必然降临。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../img/month_10.webp')",
        luckyFlower: "石榴花",
        themeColor: "#8A3A2A"
    },
    {
        name: "哀悼月", // 十一月
        title: "若心灵仍有余裕，请稍许分出些温柔，\n轻抚身边美好的一切吧。",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../img/month_11.webp')",
        luckyFlower: "金鱼草",
        themeColor: "#5A3A6A"
    },
    {
        name: "机缘月", // 十二月
        title: "别怕摔，跑起来！\n命运就是只迟缓的若虫，它压根抓不住你！",
        background: "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('../img/month_12.webp')",
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
const copyrightToggle = document.getElementById('copyrightToggle');
const statsToggle = document.getElementById('statsToggle');
const copyrightTooltip = document.getElementById('copyrightTooltip');
const statsTooltip = document.getElementById('statsTooltip');
const capsuleCopyrightToggle = document.getElementById('capsuleCopyrightToggle');
const capsuleStatsToggle = document.getElementById('capsuleStatsToggle');
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
        // Moon icon for dark mode
        themeToggleBtn.innerHTML = `
            <svg class="theme-toggle-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 11.54 20.96 11.08 20.9 10.64C19.92 11.55 18.57 12.14 17.07 12.14C14.42 12.14 12.26 10.06 12.04 7.43C10.27 7.97 8.93 9.57 8.93 11.5C8.93 13.43 10.5 15 12.43 15C12.61 15 12.78 15 12.95 14.97C12.39 16.7 10.88 18 9 18C6.24 18 4 15.76 4 13C4 10.24 6.24 8 9 8C9.84 8 10.63 8.19 11.34 8.53C11.47 6.79 12.7 5.39 14.29 5.39C15.88 5.39 17.11 6.79 17.24 8.53C17.95 8.19 18.74 8 19.57 8C22.02 8 24 9.98 24 12.43C24 14.88 22.02 16.86 19.57 16.86C17.12 16.86 15.14 14.88 15.14 12.43C15.14 12.28 15.15 12.13 15.16 12H12Z" fill="white"/>
            </svg>
        `;
    } else {
        // Sun icon for light mode
        themeToggleBtn.innerHTML = `
            <svg class="theme-toggle-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18ZM12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12Z" fill="white"/>
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

// 切换到上一个月
function goToPrevMonth() {
    currentMonthIndex--;
    if (currentMonthIndex < 0) {
        currentMonthIndex = 11; // 循环到十二月
    }
    updateCalendar();
    updateStats();
}

// 切换到下一个月
function goToNextMonth() {
    currentMonthIndex++;
    if (currentMonthIndex > 11) {
        currentMonthIndex = 0; // 循环到一月
    }
    updateCalendar();
    updateStats();
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

    // 添加鼠标悬停事件支持
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
    capsuleCopyrightToggle.addEventListener('click', function() {
        capsuleCopyrightTooltip.style.opacity = capsuleCopyrightTooltip.style.opacity === '1' ? '0' : '1';
        capsuleCopyrightTooltip.style.visibility = capsuleCopyrightTooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
    });

    capsuleStatsToggle.addEventListener('click', function() {
        capsuleStatsTooltip.style.opacity = capsuleStatsTooltip.style.opacity === '1' ? '0' : '1';
        capsuleStatsTooltip.style.visibility = capsuleStatsTooltip.style.visibility === 'visible' ? 'hidden' : 'visible';
    });

    // 添加鼠标悬停事件支持
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

    // Check if calendar is currently visible by checking if it's not faded out
    const isCalendarVisible = calendarContainer.style.opacity !== '0';

    if (isCalendarVisible) {
        // 隐藏日历
        calendarContainer.style.opacity = '0';
        // Delay hiding calendar to allow transition to complete
        setTimeout(() => {
            calendarContainer.style.display = 'none';
        }, 500); // Match the CSS transition duration
        // Show capsule with transition
        setTimeout(() => {
            capsuleFooter.classList.add('show');
            // Ensure stats are synchronized when showing capsule
            syncStatsToCapsule();
        }, 10);
        toggleCalendarBtn.innerHTML = `
            <svg class="toggle-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="white"/>
            </svg>
        `;
    } else {
        // 显示日历
        // Make sure the calendar container is displayed before starting the animation
        calendarContainer.style.display = 'grid';
        // Trigger reflow to ensure the display change is applied
        void calendarContainer.offsetWidth;
        // Start the fade-in animation
        calendarContainer.style.opacity = '1';
        // Delay hiding capsule to allow transition
        setTimeout(() => {
            capsuleFooter.classList.remove('show');
        }, 10);
        toggleCalendarBtn.innerHTML = `
            <svg class="toggle-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.34 18.89C2.87 18.3 2.43 17.68 2.02 17.03C1.26 15.83 1.26 14.17 2.02 12.97C3.28 10.98 5.5 8.5 12 8.5C13.78 8.5 15.35 8.93 16.73 9.49L18.66 7.5C17.04 6.73 15.22 6.2 12 6.2C5.5 6.2 2.74 10.07 2.02 11.26C1.78 11.62 1.56 11.99 1.36 12.37C1.12 12.81 1.12 13.35 1.36 13.79C2.12 15.23 3.88 17.7 12 17.7C13.41 17.7 14.64 17.53 15.73 17.31L17.31 18.89C16.09 19.18 14.63 19.4 12 19.4C5.5 19.4 2.74 15.53 2.02 14.34C2.26 14.7 2.48 15.07 2.72 15.43C3.48 16.63 3.48 18.29 2.72 19.49C2.48 19.87 2.26 20.24 2.02 20.6C1.26 21.79 3.88 19.68 3.34 18.89Z" fill="white"/>
                <circle cx="12" cy="12" r="3" fill="white"/>
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