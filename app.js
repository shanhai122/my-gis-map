// 初始化地图，以北京为中心
var map = L.map('map').setView([39.9042, 116.4074], 12);

// 使用可靠的地图底图源
L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

// 添加一个默认标记
var defaultMarker = L.marker([39.9042, 116.4074])
    .addTo(map)
    .bindPopup("<b>欢迎使用GIS地图!</b><br>这是城市中心位置。")
    .openPopup();

// 添加公园圆形区域
var parks = [
    { name: "中心公园", latlng: [39.9100, 116.4000], area: "25公顷" },
    { name: "河边绿地", latlng: [39.9080, 116.4150], area: "15公顷" }
];

parks.forEach(function(park) {
    L.circle(park.latlng, {
        color: 'green',
        fillColor: '#90EE90',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(map).bindPopup(`<h3>${park.name}</h3><p>面积: ${park.area}</p>`);
});

// 添加比例尺
L.control.scale({ imperial: false }).addTo(map);
