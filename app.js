// 初始化地图，以北京为中心
var map = L.map('map').setView([39.9042, 116.4074], 12);

// 添加OpenStreetMap底图图层
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

// 添加一个默认标记
var defaultMarker = L.marker([39.9042, 116.4074])
    .addTo(map)
    .bindPopup("<b>欢迎使用GIS地图!</b><br>这是城市中心位置。")
    .openPopup();

// 添加一些示例圆形标记（模拟公园位置）
var parks = [
    { name: "中心公园", latlng: [39.9100, 116.4000], area: "25公顷" },
    { name: "河边绿地", latlng: [39.9080, 116.4150], area: "15公顷" },
    { name: "西山公园", latlng: [39.9000, 116.4250], area: "30公顷" },
    { name: "儿童乐园", latlng: [39.8950, 116.3950], area: "8公顷" }
];

// 为每个公园创建圆形标记
parks.forEach(function(park) {
    L.circle(park.latlng, {
        color: 'green',
        fillColor: '#90EE90',
        fillOpacity: 0.5,
        radius: 500  // 半径500米
    }).addTo(map).bindPopup(`
        <div style="text-align: center;">
            <h3 style="margin: 0; color: #2c3e50;">${park.name}</h3>
            <hr style="margin: 8px 0;">
            <p><strong>面积:</strong> ${park.area}</p>
            <p><strong>类型:</strong> 城市公园</p>
            <p><em>点击地图其他区域关闭此弹窗</em></p>
        </div>
    `);
});

// 添加比例尺控件
L.control.scale({ imperial: false }).addTo(map);

// 添加地图事件监听
map.on('click', function(e) {
    console.log('地图点击位置:', e.latlng);
});

// 页面加载完成后的提示
console.log('GIS地图应用加载完成！');
