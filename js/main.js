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
const fileInput = document.getElementById('file-input');
const loadPlanBtn2 = document.getElementById('load-plan-btn2');

// 保存计划到 localStorage
savePlanBtn.addEventListener('click', () => {
    if (!planDate.value) {
        planResult.textContent = '请选择游玩日期！';
        return;
    }
    // localStorage 存储格式：键值对（字符串）
    localStorage.setItem('guoqingsi_plan_date', planDate.value);
    planResult.textContent = `✅ 计划已保存：${planDate.value}`;
    // 构造JSON数据结构
    const jsonData = {
        content: planDate.value,
        exportTime: new Date().toLocaleString(),
        format: "JSON"
    };
    // 转换为格式化的JSON字符串
    const jsonStr = JSON.stringify(jsonData, null, 2);
    // 创建Blob对象
    const blob = new Blob([jsonStr], { type: 'application/json' });
    // 创建下载链接
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `数据保存_${new Date().getTime()}.json`;
    downloadLink.click();
    // 释放资源
    URL.revokeObjectURL(downloadLink.href);

    alert("✅ JSON文件已导出！");
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

// 从 localStorage 读取计划
loadPlanBtn2.addEventListener('click', () => {
    // 检查是否选择了文件
    if (!fileInput.files || fileInput.files.length === 0) {
        alert("请先选择要读取的JSON文件！");
        return;
    }
    const file = fileInput.files[0];
    // 检查文件类型是否为JSON
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        alert("请选择正确的JSON文件！");
        return;
    }

    // 创建FileReader对象读取文件内容
    const reader = new FileReader();
    // 读取完成后的回调
    reader.onload = function (e) {
        try {
            // 1. 读取文件内容（字符串）
            const jsonStr = e.target.result;
            // 2. 解析JSON字符串为JavaScript对象（核心步骤）
            const jsonData = JSON.parse(jsonStr);

            // 3. 展示解析后的数据
            const result = document.getElementById('plan-result');
            result.innerHTML = `
                        <h4>✅ 读取JSON文件成功：</h4>
                        <p>游玩日期：${jsonData.content || '无'}</p>
                        <p>导出时间：${jsonData.exportTime || '无'}</p>
                        <p>格式：${jsonData.format || '无'}</p>
                        <p><strong>原始JSON内容：</strong><br>${JSON.stringify(jsonData, null, 2)}</p>
                    `;

            // 4. 回填到输入框（可选）
            document.getElementById('plan-date').value = jsonData.content;
        } catch (error) {
            alert("❌ JSON文件格式错误，无法解析！");
            console.error("解析错误：", error);
        }
    };

    // 以文本方式读取文件
    reader.readAsText(file, 'UTF-8');
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