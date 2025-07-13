// main.js
$(function() {
    try {
        window.canvasManager.init();
        window.toolbar.init();
        api.getAllPoints()
            .then(pointsData => {
                const points = pointsData.map(p => new Point(p));
                points.forEach(point => {
                    const pv = new PointView(point);
                    pv.render(window.canvasManager.layer);
                    window.canvasManager.enablePointDragging(pv);
                });
                window.canvasManager.layer.draw();
            })
            .catch(err => {
                alert('Ошибка загрузки точек: ' + err.message);
            });
        window.contextMenu.setAddPointHandler((x, y) => {
            window.dialogs.showPointDialog(null, ({ color, radius }) => {
                api.createPoint({ x, y, radius, color })
                    .then(pointData => {
                        const point = new Point(pointData);
                        const pv = new PointView(point);
                        pv.render(window.canvasManager.layer);
                        window.canvasManager.enablePointDragging(pv);
                        window.canvasManager.layer.draw();
                    })
                    .catch(err => {
                        alert('Ошибка создания точки: ' + err.message);
                    });
            });
        });
    } catch (error) {
        alert('Ошибка инициализации: ' + error.message);
    }
}); 