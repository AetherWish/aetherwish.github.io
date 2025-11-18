// 月历配置数据
const monthsData = [
    {
        name: "门关月", // 一月
        title: "不论晴天还是雨天，进入梦乡以前，\n记得和自己说一声：「明天见」！",
        background: "linear-gradient(135deg, #6e8efb, #a777e3)",
        luckyFlower: "铃兰"
    },
    {
        name: "平衡月", // 二月
        title: "无我，即无世界。\n去思，去见，去征服。",
        background: "linear-gradient(135deg, #a6c0fe, #f68084)",
        luckyFlower: "帝王花"
    },
    {
        name: "长夜月", // 三月
        title: "如果岁月是个无穷的轮回——\n那就忘掉不断重复的苦涩，单独记住每个快乐的瞬间吧！",
        background: "linear-gradient(135deg, #76b852, #8dc26f)",
        luckyFlower: "四叶草"
    },
    {
        name: "耕耘月", // 四月
        title: "笔终会折断，墨终会耗尽，\n生命终会逝去，但思想将在史诗中永垂不朽。",
        background: "linear-gradient(135deg, #e65c00, #f9d423)",
        luckyFlower: "兰花"
    },
    {
        name: "欢喜月", // 五月
        title: "世事如沧海，潮起潮落，一切终会在浪中消逝。\n所以，请在生命的每一刻都纵情高歌吧。",
        background: "linear-gradient(135deg, #d299c2, #fef9d7)",
        luckyFlower: "睡莲"
    },
    {
        name: "长昼月", // 六月
        title: "多望望天，多笑一笑；\n好多缠人的病痛，最怕乐观这剂良药！",
        background: "linear-gradient(135deg, #8baaaa, #ae8b9c)",
        luckyFlower: "向日葵"
    },
    {
        name: "自由月", // 七月
        title: "每个人的心中都住着一个英雄。\n拥抱它，然后去追逐太阳吧。",
        background: "linear-gradient(135deg, #ff9a9e, #fecfef)",
        luckyFlower: "勿忘我"
    },
    {
        name: "收获月", // 八月
        title: "「真理是溶解世界万物的溶剂，因而绝无法在客观上存在」——\n对此，本人心中已有绝妙的证明。",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        luckyFlower: "无尽夏"
    },
    {
        name: "拾线月", // 九月
        title: "信任与无私，是世上最美丽的两件华服：\n一件赠予他人，一件装扮自己。",
        background: "linear-gradient(135deg, #f093fb, #f5576c)",
        luckyFlower: "金桂"
    },
    {
        name: "纷争月", // 十月
        title: "去杀死玩耍，游戏便会诞生。\n去杀死纷争，荣光必然降临。",
        background: "linear-gradient(135deg, #43e97b, #38f9d7)",
        luckyFlower: "石榴花"
    },
    {
        name: "哀悼月", // 十一月
        title: "若心灵仍有余裕，请稍许分出些温柔，\n轻抚身边美好的一切吧。",
        background: "linear-gradient(135deg, #fa709a, #fee140)",
        luckyFlower: "金鱼草"
    },
    {
        name: "机缘月", // 十二月
        title: "别怕摔，跑起来！\n命运就是只迟缓的若虫，它压根抓不住你！",
        background: "linear-gradient(135deg, #56ab2f, #a8e063)",
        luckyFlower: "猫草"
    }
];

// 当前月份索引 (0-11)
let currentMonthIndex = 0;

// 统计信息
let uvCount = 0;
let pvCount = 1;

// 获取DOM元素
const imageSection = document.getElementById('imageSection');
const monthText = document.getElementById('monthText');
const monthTitleLine1 = document.getElementById('monthTitleLine1');
const monthTitleLine2 = document.getElementById('monthTitleLine2');
const currentMonthYear = document.getElementById('currentMonthYear');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const luckyPlant = document.querySelector('.lucky-plant');
const uvCountElement = document.getElementById('uvCount');
const pvCountElement = document.getElementById('pvCount');

// 初始化日历
function initCalendar() {
    updateCalendar();
    setupEventListeners();
    updateStats();
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

    luckyPlant.textContent = `本月幸运花: ${monthData.luckyFlower}`;
    currentMonthYear.textContent = `2026年${currentMonthIndex + 1}月`;  // 在日历头部显示数字月份 (如：1月)

    // 生成当月日历
    generateCalendarDays(currentMonthIndex, 2026);
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

        dayElement.textContent = day;
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
    // 简单的本地存储实现 (实际使用中可能需要后端支持)
    if (!localStorage.getItem('visited')) {
        uvCount = 1;
        localStorage.setItem('visited', 'true');
    } else {
        uvCount = 1; // 简化处理，实际应用中需要真正的UV统计
    }

    // PV统计 - 每次切换月份增加
    pvCount++;

    uvCountElement.textContent = uvCount;
    pvCountElement.textContent = pvCount;
}

// 初始化日历
window.onload = initCalendar;

// 页面加载完成后检查初始方向
window.addEventListener('load', handleOrientationChange);