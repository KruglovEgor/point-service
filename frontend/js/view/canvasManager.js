// canvasManager.js
class CanvasManager {
    constructor(containerId) {
        this.containerId = containerId;
        this.stage = null;
        this.layer = null;
        this.pointViews = [];
    }
    init() {
        this.stage = new Konva.Stage({
            container: this.containerId,
            width: window.innerWidth,
            height: window.innerHeight
        });
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);
        this.stage.on('contextmenu', (e) => {
            e.evt.preventDefault();
            const pointer = this.stage.getPointerPosition();
            window.contextMenu.show(pointer.x, pointer.y);
        });
        const container = document.getElementById(this.containerId);
        if (container) {
            container.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                window.contextMenu.show(x, y);
            });
        }
        this.stage.on('click', (e) => {
            if (e.target === this.stage) {
                this.hideAllPointIcons();
                this.pointViews.forEach(pointView => {
                    if (!pointView.autoShowComments && pointView.commentsVisible) {
                        pointView.toggleComments(this.layer);
                    }
                });
            }
        });
    }
    hideAllPointIcons() {
        this.pointViews.forEach(pointView => {
            if (pointView.group) {
                pointView.group.children.forEach(child => {
                    if (child instanceof Konva.Label) {
                        child.visible(false);
                    }
                });
            }
        });
        this.layer.draw();
    }
    enablePointDragging(pointView) {
        this.pointViews.push(pointView);
        pointView.group.on('dragmove', () => {
            pointView.point.x = pointView.group.x();
            pointView.point.y = pointView.group.y();
            if (pointView.commentsVisible) {
                pointView.toggleComments(this.layer);
                pointView.toggleComments(this.layer);
            }
        });
        pointView.group.on('dragend', () => {
            api.updatePoint(pointView.point.id, {
                x: pointView.point.x,
                y: pointView.point.y,
                color: pointView.point.color,
                radius: pointView.point.radius
            }).catch(err => alert('Ошибка перемещения точки: ' + err.message));
        });
    }
}
window.canvasManager = new CanvasManager('canvas-container'); 