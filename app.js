// 初始化地图
var map = L.map('map').setView([39.9042, 116.4074], 11);

// 添加地图底图
L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
}).addTo(map);

// 添加比例尺
L.control.scale({ imperial: false }).addTo(map);

// 存储公园数据的全局变量
var allParks = [];
var parkMarkers = [];

// 从GitHub加载公园数据
async function loadParksData() {
    try {
        console.log('开始加载公园数据...');
        
        // 使用Raw GitHub URL直接访问JSON文件
        const response = await fetch('https://raw.githubusercontent.com/shanhai122/my-gis-map/main/data.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('数据加载成功:', data);
        
        allParks = data.parks || [];
        displayParksOnMap();
        createParkList();
        
    } catch (error) {
        console.error('加载数据失败:', error);
        // 显示错误信息
        L.marker([39.9042, 116.4074])
            .addTo(map)
            .bindPopup(`
                <div style="color: red; text-align: center;">
                    <h3>❌ 数据加载失败</h3>
                    <p>${error.message}</p>
                    <small>请检查网络连接或稍后重试</small>
                </div>
            `)
            .openPopup();
    }
}

// 在地图上显示公园
function displayParksOnMap() {
    // 清除之前的标记
    parkMarkers.forEach(marker => map.removeLayer(marker));
    parkMarkers = [];
    
    allParks.forEach(park => {
        // 为每个公园创建圆形标记
        const marker = L.circle(park.location, {
            color: '#27ae60',
            fillColor: '#2ecc71',
            fillOpacity: 0.3,
            radius: 600  // 固定半径600米
        }).addTo(map);
        
        // 创建弹出窗口内容
        const popupContent = `
            <div style="min-width: 250px;">
                <h3 style="color: #2c3e50; margin: 0 0 10px 0; border-bottom: 2px solid #3498db; padding-bottom: 5px;">
                    🏞️ ${park.name}
                </h3>
                <div style="margin: 10px 0;">
                    <p><strong>📐 面积:</strong> ${park.area_hectare} 公顷</p>
                    <p><strong>🎯 类型:</strong> ${park.type}</p>
                    <p><strong>📅 建立年份:</strong> ${park.established}年</p>
                    <p><strong>👥 日均游客:</strong> ${park.visitors_per_day}人</p>
                </div>
                <div style="margin: 10px 0;">
                    <strong>🏗️ 设施:</strong><br>
                    ${park.facilities.map(facility => `• ${facility}`).join('<br>')}
                </div>
                <div style="margin-top: 10px; padding: 8px; background: #e8f4fd; border-radius: 5px; font-size: 12px;">
                    ${park.description}
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        parkMarkers.push(marker);
        
        // 点击标记时居中显示
        marker.on('click', function() {
            map.setView(park.location, 14);
        });
    });
    
    // 调整地图视图以包含所有公园
    if (parkMarkers.length > 0) {
        const group = new L.featureGroup(parkMarkers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// 创建公园列表侧边栏
function createParkList() {
    // 创建列表容器
    const listContainer = L.control({ position: 'topright' });
    
    listContainer.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'park-list');
        div.innerHTML = `
            <div style="background: white; padding: 15px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); max-width: 300px; max-height: 400px; overflow-y: auto;">
                <h4 style="margin: 0 0 15px 0; color: #2c3e50;">🏞️ 公园列表 (${allParks.length})</h4>
                <div id="parks-list">
                    ${allParks.map(park => `
                        <div style="padding: 10px; margin: 5px 0; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #27ae60; cursor: pointer;" 
                             onclick="focusOnPark('${park.id}')">
                            <strong>${park.name}</strong><br>
                            <small>${park.type} • ${park.area_hectare}公顷</small>
                        </div>
                    `).join('')}
                </div>
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
                    点击公园名称或地图上的绿色区域查看详情
                </div>
            </div>
        `;
        return div;
    };
    
    listContainer.addTo(map);
}

// 聚焦到指定公园
function focusOnPark(parkId) {
    const park = allParks.find(p => p.id === parkId);
    if (park) {
        map.setView(park.location, 15);
        // 打开该公园的弹出窗口
        parkMarkers.forEach(marker => {
            if (marker.getLatLng().equals(park.location)) {
                marker.openPopup();
            }
        });
    }
}

// 搜索公园功能
function searchParks(query) {
    const filteredParks = allParks.filter(park => 
        park.name.toLowerCase().includes(query.toLowerCase()) ||
        park.type.toLowerCase().includes(query.toLowerCase())
    );
    
    // 更新地图显示
    parkMarkers.forEach(marker => {
        const shouldShow = filteredParks.some(park => 
            marker.getLatLng().equals(park.location)
        );
        if (shouldShow) {
            map.addLayer(marker);
        } else {
            map.removeLayer(marker);
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化地图...');
    loadParksData();
});

// 添加控制台提示
console.log('🗺️ GIS公园地图系统已加载');
