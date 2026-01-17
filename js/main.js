// 原有平滑滚动代码（保留）
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
        });
    });
});

// ========== 新增：本地存储功能 ==========
// 1. 保存/读取游玩计划
const savePlanBtn = document.getElementById('save-plan-btn');
const loadPlanBtn = document.getElementById('load-plan-btn');
const planDate = document.getElementById('plan-date');
const planResult = document.getElementById('plan-result');

// 保存计划到 localStorage
savePlanBtn.addEventListener('click', () => {
    if (!planDate.value) {
        planResult.textContent = '请选择游玩日期！';
        return;
    }
    // localStorage 存储格式：键值对（字符串）
    localStorage.setItem('guoqingsi_plan_date', planDate.value);
    planResult.textContent = `✅ 计划已保存：${planDate.value}`;
});

// 从 localStorage 读取计划
loadPlanBtn.addEventListener('click', () => {
    const savedDate = localStorage.getItem('guoqingsi_plan_date');
    if (savedDate) {
        planDate.value = savedDate;
        planResult.textContent = `📅 已读取保存的计划：${savedDate}`;
    } else {
        planResult.textContent = '暂无保存的游玩计划';
    }
});

// 2. 保存/读取收藏景点
const saveFavBtn = document.getElementById('save-fav-btn');
const favResult = document.getElementById('fav-result');
const spotCheckboxes = document.querySelectorAll('.spot-item input');

saveFavBtn.addEventListener('click', () => {
    const favorites = [];
    spotCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            favorites.push(checkbox.value);
        }
    });
    // 数组需转为 JSON 字符串存储
    localStorage.setItem('guoqingsi_favorites', JSON.stringify(favorites));
    favResult.textContent = `✅ 收藏已保存：${favorites.join(', ')}`;
});

// 页面加载时自动读取收藏
window.onload = function () {
    console.log('国清寺旅游指南网站加载完成！');
    const savedFavs = JSON.parse(localStorage.getItem('guoqingsi_favorites') || '[]');
    spotCheckboxes.forEach(checkbox => {
        if (savedFavs.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });
    if (savedFavs.length > 0) {
        favResult.textContent = `📌 已加载收藏：${savedFavs.join(', ')}`;
    }
};