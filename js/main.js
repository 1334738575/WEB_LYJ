// 平滑滚动（点击导航跳转到对应区域）
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        window.scrollTo({
            top: targetElement.offsetTop - 80, // 避开导航栏
            behavior: 'smooth'
        });
    });
});

// 页面加载完成提示（可选）
window.onload = function () {
    console.log('国清寺旅游指南网站加载完成！');
};