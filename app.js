// 初始化地图，以北京为中心
var map = L.map('map').setView([39.9042, 116.4074], 11);

// 添加地图底图
L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

// 添加一个默认标记
var defaultMarker = L.marker([39.9042, 116.4074])
    .addTo(map)
    .bindPopup(`
        <div style="text-align: center;">
            <h3 style="color: #2c3e50; margin: 0;">🏙️ 北京中心</h3>
            <hr style="margin: 8px 0;">
            <p>欢迎使用城市公园地图系统！</p>
            <p>点击下方的绿色区域查看公园详细信息</p>
        </div>
    `)
    .openPopup();

// 加载并显示GeoJSON数据
fetch('data/parks.geojson')
    .then(response => {
        if (!response.ok) {
            throw new Error('网络响应不正常');
        }
        return response.json();
    })
    .then(geojsonData => {
        // 创建GeoJSON图层并自定义样式
        var parksLayer = L.geoJSON(geojsonData, {
            style: {
                fillColor: '#27ae60',
                color: '#2ecc71',
                weight: 3,
                opacity: 0.8,
                fillOpacity: 0.4
            },
            onEachFeature: function(feature, layer) {
                // 为每个公园要素创建弹出信息
                var properties = feature.properties;
                var popupContent = `
                    <div style="min-width: 200px;">
                        <h3 style="color: #2c3e50; margin: 0 0 10px 0; border-bottom: 2px solid #3498db; padding-bottom: 5px;">
                            🏞️ ${properties.name}
                        </h3>
                        <div style="margin: 10px 0;">
                            <p><strong>📐 面积:</strong> ${properties.area_hectare} 公顷</p>
                            <p><strong>🎯 类型:</strong> ${properties.type}</p>
                            <p><strong>📅 建立年份:</strong> ${properties.established}年</p>
                        </div>
                        <div style="margin: 10px 0;">
                            <strong>🏗️ 设施:</strong><br>
                `;
                
                // 添加设施列表
                if (properties.facilities && properties.facilities.length > 0) {
                    properties.facilities.forEach(facility => {
                        popupContent += `• ${facility}<br>`;
                    });
                } else {
                    popupContent += `暂无设施信息<br>`;
                }
                
                popupContent += `
                        </div>
                        <div style="margin-top: 10px; padding: 8px; background: #e8f4fd; border-radius: 5px;">
                            <small>点击地图其他位置关闭弹窗</small>
                        </div>
                    </div>
                `;
                
                layer.bindPopup(popupContent);
            }
        }).addTo(map);

        // 调整地图视图以包含所有公园
        if (parksLayer.getBounds().isValid()) {
            map.fitBounds(parksLayer.getBounds().pad(0.1));
        }
        
        console.log('公园数据加载成功！', geojsonData);
    })
    .catch(error => {
        console.error('加载公园数据失败:', error);
        // 如果加载失败，显示错误信息
        L.marker([39.9042, 116.4074])
            .addTo(map)
            .bindPopup('<div style="color: red;">❌ 加载公园数据失败，请检查网络连接</div>')
            .openPopup();
    });

// 添加一些示例圆形标记作为补充
var additionalParks = [
    { name: "朝阳公园", latlng: [39.933, 116.480], area: "288公顷", type: "城市公园" },
    { name: "玉渊潭公园", latlng: [39.912, 116.317], area: "137公顷", type: "自然公园" }
];

additionalParks.forEach(function(park) {
    L.circle(park.latlng, {
        color: '#e74c3c',
        fillColor: '#eaa79b',
        fillOpacity: 0.3,
        radius: 400
    }).addTo(map).bindPopup(`
        <div style="text-align: center;">
            <h4 style="margin: 0; color: #c0392b;">${park.name}</h4>
            <p><strong>面积:</strong> ${park.area}</p>
            <p><strong>类型:</strong> ${park.type}</p>
        </div>
    `);
});

// 添加比例尺控件
L.control.scale({ imperial: false }).addTo(map);

// 添加地图事件监听
map.on('click', function(e) {
    console.log('地图点击位置 - 纬度:', e.latlng.lat, '经度:', e.latlng.lng);
});

// 页面加载完成后的提示
console.log('🌍 GIS地图应用加载完成！');
