/**
 * 翁法罗斯一年历 —— 交互脚本
 * ---------------------------------------------------------------------------
 * 职责（每项对应下面一个 init / 模块）：
 *   1. 月份数据与主题色
 *   2. 月历渲染与月份切换
 *   3. 明暗主题
 *   4. 悬浮提示气泡（底部信息栏 + 胶囊底栏共用一套逻辑）
 *   5. 一年历显隐（含胶囊底栏切换）
 *   6. 访问统计同步（不蒜子）
 *
 * 编码注意：本文件为无 BOM 的 UTF-8；中文文案较多，切勿另存为 GBK。
 */
(function () {
    'use strict';

    /* =========================================================================
       常量
       ====================================================================== */

    /** 日历固定展示 2026 年 */
    const CALENDAR_YEAR = 2026;

    /** 一年 12 个月 */
    const MONTHS_PER_YEAR = 12;

    /** 月历固定渲染 6 行 × 7 列，不足部分补空格子 */
    const CALENDAR_CELLS = 42;

    /** 11 月 12 日显示「∞」（月份为 0 起算） */
    const INFINITY_MONTH = 10;
    const INFINITY_DAY = 12;

    /** 星期天 / 星期六（Date#getDay 返回值） */
    const SUNDAY = 0;
    const SATURDAY = 6;

    /** 月份切换的淡出时长，需与 CSS 过渡时长一致（毫秒） */
    const SWITCH_FADE_MS = 150;

    /** 一年历显隐的过渡时长，需与 CSS 过渡时长一致（毫秒） */
    const VISIBILITY_FADE_MS = 500;

    /** 统计值轮询间隔与最长等待时间（毫秒） */
    const STATS_POLL_MS = 200;
    const STATS_TIMEOUT_MS = 10000;

    const byId = (id) => document.getElementById(id);

    /* =========================================================================
       1. 月份数据
       -------------------------------------------------------------------------
       每个月包含：代称、寄语（\n 分行）、背景图、幸运花、主题色。
       ====================================================================== */
    const MONTHS_DATA = [
        {
            name: '门关月',
            title: '不论晴天还是雨天，进入梦乡以前，\n记得和自己说一声：「明天见」！',
            image: '/img/month_1.webp',
            luckyFlower: '铃兰',
            themeColor: '#8A2B3B'
        },
        {
            name: '平衡月',
            title: '无我，即无世界。\n去思，去见，去征服。',
            image: '/img/month_2.webp',
            luckyFlower: '帝王花',
            themeColor: '#1A3A60'
        },
        {
            name: '长夜月',
            title: '如果岁月是个无穷的轮回——\n那就忘掉不断重复的苦涩，单独记住每个快乐的瞬间吧！',
            image: '/img/month_3.webp',
            luckyFlower: '四叶草',
            themeColor: '#5A2A4A'
        },
        {
            name: '耕耘月',
            title: '笔终会折断，墨终会耗尽，\n生命终会逝去，但思想将在史诗中永垂不朽。',
            image: '/img/month_4.webp',
            luckyFlower: '兰花',
            themeColor: '#2A3A2A'
        },
        {
            name: '欢喜月',
            title: '世事如沧海，潮起潮落，一切终会在浪中消逝。\n所以，请在生命的每一刻都纵情高歌吧。',
            image: '/img/month_5.webp',
            luckyFlower: '睡莲',
            themeColor: '#2A3A6A'
        },
        {
            name: '长昼月',
            title: '多望望天，多笑一笑；\n好多缠人的病痛，最怕乐观这剂良药！',
            image: '/img/month_6.webp',
            luckyFlower: '向日葵',
            themeColor: '#8A2A4A'
        },
        {
            name: '自由月',
            title: '每个人的心中都住着一个英雄。\n拥抱它，然后去追逐太阳吧。',
            image: '/img/month_7.webp',
            luckyFlower: '勿忘我',
            themeColor: '#1A3A6A'
        },
        {
            name: '收获月',
            title: '「真理是溶解世界万物的溶剂，因而绝无法在客观上存在」——\n对此，本人心中已有绝妙的证明。',
            image: '/img/month_8.webp',
            luckyFlower: '无尽夏',
            themeColor: '#2A4A4A'
        },
        {
            name: '拾线月',
            title: '信任与无私，是世上最美丽的两件华服：\n一件赠予他人，一件装扮自己。',
            image: '/img/month_9.webp',
            luckyFlower: '金桂',
            themeColor: '#5A5A2A'
        },
        {
            name: '纷争月',
            title: '去杀死玩耍，游戏便会诞生。\n去杀死纷争，荣光必然降临。',
            image: '/img/month_10.webp',
            luckyFlower: '石榴花',
            themeColor: '#8A3A2A'
        },
        {
            name: '哀悼月',
            title: '若心灵仍有余裕，请稍许分出些温柔，\n轻抚身边美好的一切吧。',
            image: '/img/month_11.webp',
            luckyFlower: '金鱼草',
            themeColor: '#5A3A6A'
        },
        {
            name: '机缘月',
            title: '别怕摔，跑起来！\n命运就是只迟缓的若虫，它压根抓不住你！',
            image: '/img/month_12.webp',
            luckyFlower: '猫草',
            themeColor: '#3A3A6A'
        }
    ];

    /* =========================================================================
       DOM 引用
       ====================================================================== */
    const dom = {
        // 图片区
        imageSection: byId('imageSection'),
        monthText: byId('monthText'),
        monthTitleLine1: byId('monthTitleLine1'),
        monthTitleLine2: byId('monthTitleLine2'),
        luckyFlowerName: byId('luckyFlowerName'),

        // 月历区
        currentMonthYear: byId('currentMonthYear'),
        calendarDays: byId('calendarDays'),
        prevMonthBtn: byId('prevMonth'),
        nextMonthBtn: byId('nextMonth'),

        // 容器与工具按钮
        calendarContainer: document.querySelector('.calendar-container'),
        capsuleFooter: byId('capsuleFooter'),
        toggleCalendarBtn: byId('toggleCalendar'),
        themeToggleBtn: byId('themeToggle'),

        // 统计
        sitePv: byId('busuanzi_value_site_pv'),
        siteUv: byId('busuanzi_value_site_uv'),
        capsulePv: byId('capsule_pv_value'),
        capsuleUv: byId('capsule_uv_value')
    };

    /* =========================================================================
       状态
       ====================================================================== */
    const state = {
        /** 当前月份索引（0 = 一月） */
        monthIndex: 0,
        /** 月份切换动画进行中时忽略新的切换请求 */
        isAnimating: false,
        /** 一年历显隐过渡的定时器 */
        visibilityTimer: null,
        /** 统计值轮询定时器 */
        statsTimer: null,
        /** 统计值是否已同步过一次 */
        statsSynced: false
    };

    /* =========================================================================
       通用工具
       ====================================================================== */

    /**
     * 把颜色朝白色方向提亮。
     * @param {string} hexColor 形如 #RRGGBB
     * @param {number} percent 提亮幅度（0-100）
     * @returns {string} 提亮后的 #RRGGBB
     */
    function lighten(hexColor, percent) {
        const channels = [1, 3, 5].map((start) => parseInt(hexColor.substring(start, start + 2), 16));

        return '#' + channels
            .map((channel) => {
                const lightened = Math.min(255, channel + Math.floor((255 - channel) * percent / 100));
                return lightened.toString(16).padStart(2, '0');
            })
            .join('');
    }

    /** 当前是否处于暗色主题 */
    function isDarkTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    /** 按 id 克隆 <template> 中的图标节点，模板缺失时返回 null */
    function cloneIcon(templateId) {
        const template = byId(templateId);
        if (!template || !template.content) {
            return null;
        }
        return template.content.cloneNode(true);
    }

    /** 用指定模板替换按钮内容（找不到模板时保持原图标，避免按钮变空） */
    function replaceButtonIcon(button, templateId) {
        const icon = cloneIcon(templateId);
        if (icon && button) {
            button.textContent = '';
            button.appendChild(icon);
        }
    }

    /* =========================================================================
       3. 明暗主题
       ====================================================================== */

    /**
     * 应用主题。
     * @param {'light'|'dark'} theme
     */
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        // 图标语义：当前为暗色 → 显示月亮（点击切回浅色）的反面，故按目标主题取反
        replaceButtonIcon(dom.themeToggleBtn, theme === 'dark' ? 'icon-template-sun' : 'icon-template-moon');

        // 主题变化会改变对比度，需要重算当月主题色的显示亮度
        applyMonthThemeColor(MONTHS_DATA[state.monthIndex].themeColor);
    }

    /** 读取用户偏好（无偏好时跟随系统）并初始化主题 */
    function initTheme() {
        let theme = readStoredTheme();

        if (!theme) {
            const prefersDark = window.matchMedia
                && window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }

        applyTheme(theme);
    }

    /** 读取已保存的主题偏好，无记录时返回 null */
    function readStoredTheme() {
        try {
            const stored = window.localStorage.getItem('theme');
            return stored === 'dark' || stored === 'light' ? stored : null;
        } catch (error) {
            return null;
        }
    }

    /** 切换主题并记住偏好 */
    function toggleTheme() {
        const next = isDarkTheme() ? 'light' : 'dark';

        try {
            window.localStorage.setItem('theme', next);
        } catch (error) {
            // 写入失败不影响本次切换
        }

        applyTheme(next);
    }

    /* =========================================================================
       2. 月历渲染与月份切换
       ====================================================================== */

    /** 把当月主题色应用到日历相关元素（暗色模式下需要提亮才能看清） */
    function applyMonthThemeColor(themeColor) {
        const displayColor = isDarkTheme() ? lighten(themeColor, 30) : themeColor;

        // 通过 CSS 变量下发，样式表中不再出现内联样式写入
        document.documentElement.style.setProperty('--current-theme-color', displayColor);

        updateWeekendColors(themeColor);
    }

    /** 周末格子用当月主题色的浅色版本填底 */
    function updateWeekendColors(themeColor) {
        const weekendColor = lighten(themeColor, 40);

        document.querySelectorAll('.calendar-day.weekend').forEach((day) => {
            day.style.background = weekendColor;
        });
    }

    /** 重新渲染整页当月信息（图片、文案、日历格子） */
    function renderMonth() {
        const month = MONTHS_DATA[state.monthIndex];

        dom.imageSection.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('${month.image}')`;
        dom.monthText.textContent = month.name;
        dom.luckyFlowerName.textContent = month.luckyFlower;
        dom.currentMonthYear.textContent = `${CALENDAR_YEAR}年${state.monthIndex + 1}月`;

        const [line1 = '', line2 = ''] = month.title.split('\n');
        dom.monthTitleLine1.textContent = line1;
        dom.monthTitleLine2.textContent = line2;

        applyMonthThemeColor(month.themeColor);
        renderCalendarDays(state.monthIndex);
    }

    /**
     * 生成当月日期格子。
     * @param {number} monthIndex 0-11
     */
    function renderCalendarDays(monthIndex) {
        const firstWeekday = new Date(CALENDAR_YEAR, monthIndex, 1).getDay();
        const daysInMonth = new Date(CALENDAR_YEAR, monthIndex + 1, 0).getDate();

        const fragment = document.createDocumentFragment();

        // 月初空白格
        for (let i = 0; i < firstWeekday; i++) {
            fragment.appendChild(createDayCell());
        }

        // 当月日期
        for (let day = 1; day <= daysInMonth; day++) {
            const weekday = new Date(CALENDAR_YEAR, monthIndex, day).getDay();
            const isWeekend = weekday === SUNDAY || weekday === SATURDAY;
            const isInfinityDay = monthIndex === INFINITY_MONTH && day === INFINITY_DAY;

            const cell = createDayCell(isWeekend ? 'weekend' : '');
            if (isInfinityDay) {
                cell.textContent = '∞';
                cell.classList.add('infinity-day');
            } else {
                cell.textContent = String(day);
            }

            fragment.appendChild(cell);
        }

        // 补足 42 格，保持 6 行高度稳定
        const usedCells = firstWeekday + daysInMonth;
        for (let i = usedCells; i < CALENDAR_CELLS; i++) {
            fragment.appendChild(createDayCell());
        }

        dom.calendarDays.textContent = '';
        dom.calendarDays.appendChild(fragment);

        updateWeekendColors(MONTHS_DATA[state.monthIndex].themeColor);
    }

    /**
     * 创建一个日期格子。
     * @param {string} [extraClass] 追加的类名（如 'weekend'）
     */
    function createDayCell(extraClass) {
        const cell = document.createElement('div');
        cell.className = extraClass ? `calendar-day ${extraClass}` : 'calendar-day';

        if (!extraClass) {
            cell.classList.add('empty');
        }
        return cell;
    }

    /** 月份索引加减 1 并循环 */
    function stepMonth(delta) {
        if (state.isAnimating) {
            return;
        }
        state.isAnimating = true;

        dom.calendarDays.style.transition = `opacity ${SWITCH_FADE_MS}ms ease-in-out`;
        dom.calendarDays.style.opacity = '0';

        window.setTimeout(function () {
            state.monthIndex = (state.monthIndex + delta + MONTHS_PER_YEAR) % MONTHS_PER_YEAR;
            renderMonth();

            // 强制重排后再淡入，否则浏览器会合并成一次样式变更
            void dom.calendarDays.offsetWidth;
            dom.calendarDays.style.opacity = '1';

            window.setTimeout(function () {
                dom.calendarDays.style.transition = '';
                state.isAnimating = false;
            }, SWITCH_FADE_MS);
        }, SWITCH_FADE_MS);
    }

    /* =========================================================================
       4. 悬浮提示气泡
       -------------------------------------------------------------------------
       底部信息栏与胶囊底栏结构一致，统一由 setupTooltip 绑定：
       桌面端悬停展开，触屏设备点按切换。
       ====================================================================== */

    /**
     * @param {string} labelId 可点击的标签 id
     * @param {object} [options]
     * @param {string} [options.tooltipId] 气泡 id；给出时不再查找 DOM，直接挂类切换
     */
    function setupTooltip(labelId, options) {
        const label = byId(labelId);
        if (!label) {
            return;
        }

        const item = label.closest('.info-item') || label.parentElement;
        if (!item) {
            return;
        }

        // 气泡的展开状态完全由 .is-open 驱动（见 CSS），避免 JS 直接写内联样式
        label.addEventListener('click', function (event) {
            event.preventDefault();
            item.classList.toggle('is-open');
        });

        // 点击页面其它位置时收起
        document.addEventListener('click', function (event) {
            if (!item.contains(event.target)) {
                item.classList.remove('is-open');
            }
        });
    }

    /** 一次性绑定 6 组提示气泡 */
    function initTooltips() {
        ['usageToggle', 'copyrightToggle', 'statsToggle',
            'capsuleUsageToggle', 'capsuleCopyrightToggle', 'capsuleStatsToggle'
        ].forEach(function (id) {
            setupTooltip(id);
        });
    }

    /* =========================================================================
       5. 一年历显隐
       ====================================================================== */

    /**
     * 在「一年历」与「胶囊底栏」之间切换。
     * 用 .is-hidden 类表达逻辑状态，样式由 CSS 过渡完成。
     */
    function toggleCalendarVisibility() {
        const container = dom.calendarContainer;
        const capsule = dom.capsuleFooter;
        if (!container || !capsule) {
            return;
        }

        window.clearTimeout(state.visibilityTimer);

        const isCurrentlyVisible = !container.classList.contains('is-hidden');

        if (isCurrentlyVisible) {
            // 收起一年历，显示胶囊底栏
            container.classList.add('animating');
            container.classList.add('is-hidden'); // CSS: opacity 0 + visibility hidden

            replaceButtonIcon(dom.toggleCalendarBtn, 'icon-template-eye-closed');

            state.visibilityTimer = window.setTimeout(function () {
                container.classList.remove('animating');
                capsule.classList.add('show');
                syncStatsToCapsule();
            }, VISIBILITY_FADE_MS);
            return;
        }

        // 展开一年历，收起胶囊底栏
        container.classList.remove('is-hidden');
        container.classList.add('animating');
        replaceButtonIcon(dom.toggleCalendarBtn, 'icon-template-eye-open');

        state.visibilityTimer = window.setTimeout(function () {
            container.classList.remove('animating');
            capsule.classList.remove('show');
        }, VISIBILITY_FADE_MS);
    }

    /* =========================================================================
       6. 访问统计同步
       -------------------------------------------------------------------------
       不蒜子脚本会异步写入站内 PV / UV，这里把它们同步到胶囊底栏。
       轮询到值写入即停止（原实现每秒永久轮询且 beforeunload 清理不生效）。
       ====================================================================== */
    function syncStatsToCapsule() {
        const hasSource = dom.sitePv && dom.siteUv
            && dom.sitePv.textContent.trim() !== ''
            && dom.siteUv.textContent.trim() !== '';
        const hasTarget = dom.capsulePv && dom.capsuleUv;

        if (!hasSource || !hasTarget) {
            return false;
        }

        dom.capsulePv.textContent = dom.sitePv.textContent;
        dom.capsuleUv.textContent = dom.siteUv.textContent;
        state.statsSynced = true;
        return true;
    }

    /** 轮询等待不蒜子写入统计值，写入后立即停止 */
    function waitForStats() {
        if (syncStatsToCapsule()) {
            return;
        }

        const startedAt = Date.now();
        state.statsTimer = window.setInterval(function () {
            if (syncStatsToCapsule() || Date.now() - startedAt > STATS_TIMEOUT_MS) {
                window.clearInterval(state.statsTimer);
                state.statsTimer = null;
            }
        }, STATS_POLL_MS);
    }

    /* =========================================================================
       事件绑定与启动
       ====================================================================== */
    function bindEvents() {
        dom.prevMonthBtn.addEventListener('click', () => stepMonth(-1));
        dom.nextMonthBtn.addEventListener('click', () => stepMonth(1));
        dom.toggleCalendarBtn.addEventListener('click', toggleCalendarVisibility);
        dom.themeToggleBtn.addEventListener('click', toggleTheme);

        // 键盘左右方向键翻月，但不干扰输入框内的光标移动
        document.addEventListener('keydown', function (event) {
            const tag = (event.target && event.target.tagName) || '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target.isContentEditable) {
                return;
            }

            if (event.key === 'ArrowLeft') {
                stepMonth(-1);
            } else if (event.key === 'ArrowRight') {
                stepMonth(1);
            }
        });

        // 用户未显式选择过主题时，跟随系统偏好变化
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
                if (readStoredTheme()) {
                    return;
                }
                applyTheme(event.matches ? 'dark' : 'light');
            });
        }
    }

    /** 释放定时器，避免页面卸载时残留回调 */
    function dispose() {
        window.clearTimeout(state.visibilityTimer);
        window.clearInterval(state.statsTimer);
    }

    function init() {
        initTheme();
        renderMonth();
        bindEvents();
        initTooltips();
        waitForStats();
    }

    window.addEventListener('load', init);
    window.addEventListener('beforeunload', dispose);
}());
