// contextMenu.js
class ContextMenu {
    constructor() {
        this.$menu = null;
        this.init();
    }
    init() {
        $(document).ready(() => {
            this.$menu = $(
                `<div id="context-menu" style="position:absolute; display:none; z-index:9999; background:#fff; border:2px solid #333; border-radius:6px; box-shadow:0 2px 8px #0002; min-width:150px; min-height:40px;">
                    <div id="add-point" style="padding:8px 16px; cursor:pointer;">Добавить точку</div>
                </div>`
            ).appendTo('body');
            this.$menu.on('click', '#add-point', () => {
                this.onAddPoint && this.onAddPoint(this.lastX, this.lastY);
                this.hide();
            });
        });
    }
    show(x, y) {
        this.lastX = x;
        this.lastY = y;
        const menuWidth = 150, menuHeight = 40;
        const winWidth = window.innerWidth, winHeight = window.innerHeight;
        if (x + menuWidth > winWidth) x = winWidth - menuWidth;
        if (y + menuHeight > winHeight) y = winHeight - menuHeight;
        const menuElement = this.$menu[0];
        menuElement.style.left = x + 'px';
        menuElement.style.top = y + 'px';
        menuElement.style.display = 'block';
        menuElement.style.zIndex = '9999';
        menuElement.style.background = '#fff';
        menuElement.style.border = '2px solid #333';
        menuElement.style.position = 'fixed';
        $(document).on('click.contextMenu', (e) => {
            if (!this.$menu.is(e.target) && this.$menu.has(e.target).length === 0) {
                this.hide();
            }
        });
    }
    hide() {
        this.$menu.hide();
        $(document).off('click.contextMenu');
    }
    setAddPointHandler(handler) {
        this.onAddPoint = handler;
    }
}
window.contextMenu = new ContextMenu(); 