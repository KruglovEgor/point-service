// pointView.js
class PointView {
    constructor(point) {
        this.point = point;
        this.group = null;
        this.circle = null;
        this.commentViews = [];
        this.commentsVisible = false;
        this.autoShowComments = typeof point.autoShowComments === 'boolean' ? point.autoShowComments : true;
        this.point.autoShowComments = this.autoShowComments;
    }
    render(layer) {
        if (this.group) {
            this.group.destroy();
        }
        this.group = new Konva.Group({
            x: this.point.x,
            y: this.point.y,
            draggable: false
        });
        this.circle = new Konva.Circle({
            radius: this.point.radius,
            fill: this.point.color,
            stroke: '#333',
            strokeWidth: 2
        });
        this.group.add(this.circle);
        const editIcon = new Konva.Label({ x: -30, y: -this.point.radius - 30, visible: false, listening: true });
        editIcon.add(new Konva.Tag({ fill: '#fff', stroke: '#888', cornerRadius: 4 }));
        editIcon.add(new Konva.Text({ text: '✎', fontSize: 16, fill: '#333', padding: 2 }));
        this.group.add(editIcon);
        const addCommentIcon = new Konva.Label({ x: 0, y: -this.point.radius - 30, visible: false, listening: true });
        addCommentIcon.add(new Konva.Tag({ fill: '#fff', stroke: '#888', cornerRadius: 4 }));
        addCommentIcon.add(new Konva.Text({ text: '+', fontSize: 18, fill: '#28a745', padding: 2 }));
        this.group.add(addCommentIcon);
        const moveIcon = new Konva.Label({ x: 30, y: -this.point.radius - 30, visible: false, listening: true });
        moveIcon.add(new Konva.Tag({ fill: '#fff', stroke: '#888', cornerRadius: 4 }));
        moveIcon.add(new Konva.Text({ text: '⠿', fontSize: 18, fill: '#007bff', padding: 2 }));
        this.group.add(moveIcon);
        const autoShowIcon = new Konva.Label({ x: 60, y: -this.point.radius - 30, visible: false, listening: true });
        autoShowIcon.add(new Konva.Tag({ fill: '#fff', stroke: '#888', cornerRadius: 4 }));
        const getEyeIcon = () => this.autoShowComments ? '👁️' : '🙈';
        autoShowIcon.add(new Konva.Text({ text: getEyeIcon(), fontSize: 16, fill: this.autoShowComments ? '#007bff' : '#888', padding: 2 }));
        this.group.add(autoShowIcon);
        this.circle.on('mouseenter', () => { document.body.style.cursor = 'pointer'; });
        this.circle.on('mouseleave', () => { document.body.style.cursor = 'default'; });
        this.circle.on('click', (e) => {
            e.cancelBubble = true;
            window.canvasManager.hideAllPointIcons();
            editIcon.visible(true);
            addCommentIcon.visible(true);
            moveIcon.visible(true);
            autoShowIcon.visible(true);
            this.group.moveToTop();
            if (this.autoShowComments && !this.commentsVisible) {
                this.toggleComments(layer);
            }
            if (!this.autoShowComments && this.commentsVisible) {
                this.toggleComments(layer);
            }
            layer.draw();
        });
        editIcon.on('mouseenter', () => { document.body.style.cursor = 'pointer'; });
        editIcon.on('mouseleave', () => { document.body.style.cursor = 'default'; });
        addCommentIcon.on('mouseenter', () => { document.body.style.cursor = 'pointer'; });
        addCommentIcon.on('mouseleave', () => { document.body.style.cursor = 'default'; });
        moveIcon.on('mouseenter', () => { document.body.style.cursor = 'pointer'; });
        moveIcon.on('mouseleave', () => { document.body.style.cursor = 'default'; });
        autoShowIcon.on('mouseenter', () => { document.body.style.cursor = 'pointer'; });
        autoShowIcon.on('mouseleave', () => { document.body.style.cursor = 'default'; });
        autoShowIcon.on('click', (e) => {
            e.cancelBubble = true;
            this.autoShowComments = !this.autoShowComments;
            this.point.autoShowComments = this.autoShowComments;
            autoShowIcon.children[1].text(getEyeIcon());
            autoShowIcon.children[1].fill(this.autoShowComments ? '#007bff' : '#888');
            if (this.autoShowComments && !this.commentsVisible) {
                this.toggleComments(layer);
            } else if (!this.autoShowComments && this.commentsVisible) {
                this.toggleComments(layer);
            }
            layer.draw();
        });
        this.circle.on('dblclick', (e) => {
            e.cancelBubble = true;
            if (confirm('Удалить точку?')) {
                const deleteAllComments = this.point.comments && this.point.comments.length
                    ? Promise.all(this.point.comments.map(c => api.deleteComment(c.id).catch(() => {})))
                    : Promise.resolve();
                deleteAllComments.then(() => {
                    api.deletePoint(this.point.id)
                        .then(() => {
                            const idx = window.canvasManager.pointViews.indexOf(this);
                            if (idx !== -1) window.canvasManager.pointViews.splice(idx, 1);
                            if (this.commentViews && this.commentViews.length) {
                                this.commentViews.forEach(cv => cv.group && cv.group.destroy());
                                this.commentViews = [];
                            }
                            if (this.point.comments) this.point.comments.length = 0;
                            this.group.destroy();
                            layer.draw();
                        })
                        .catch(err => alert('Ошибка удаления точки: ' + err.message));
                });
            }
        });
        editIcon.on('click', (e) => {
            e.cancelBubble = true;
            window.dialogs.showPointDialog(this.point, ({ color, radius }) => {
                api.updatePoint(this.point.id, { x: this.point.x, y: this.point.y, color, radius })
                    .then(() => {
                        this.point.color = color;
                        this.point.radius = radius;
                        this.render(layer);
                        if (this.commentsVisible) {
                            this.toggleComments(layer);
                            this.toggleComments(layer);
                        }
                        layer.draw();
                    })
                    .catch(err => alert('Ошибка обновления точки: ' + err.message));
            });
        });
        addCommentIcon.on('click', (e) => {
            e.cancelBubble = true;
            window.dialogs.showCommentDialog(null, ({ text, backgroundColor }) => {
                api.addComment(this.point.id, { text, backgroundColor })
                    .then(commentData => {
                        const comment = new Comment(commentData);
                        this.point.comments.push(comment);
                        if (this.commentsVisible) {
                            this.toggleComments(layer);
                            this.toggleComments(layer);
                        }
                        editIcon.visible(true);
                        addCommentIcon.visible(true);
                        moveIcon.visible(true);
                        autoShowIcon.visible(true);
                        layer.draw();
                    })
                    .catch(err => {
                        alert('Ошибка добавления комментария: ' + err.message);
                    });
            });
        });
        moveIcon.on('mousedown touchstart', (e) => {
            e.cancelBubble = true;
            this.group.draggable(true);
            this.group.startDrag();
        });
        this.group.on('dragend', () => {
            this.group.draggable(false);
        });
        if (this.autoShowComments && !this.commentsVisible) {
            this.toggleComments(layer);
        }
        if (!this.autoShowComments && this.commentsVisible) {
            this.toggleComments(layer);
        }
        layer.add(this.group);
    }
    toggleComments(layer) {
        if (this.commentsVisible) {
            this.commentViews.forEach(cv => cv.group.destroy());
            this.commentViews = [];
            this.commentsVisible = false;
            layer.draw();
            return;
        }
        let offsetY = this.point.radius + 10;
        let currentY = this.point.y + offsetY;
        this.commentViews = this.point.comments.map((c, i) => {
            const cv = new CommentView(c);
            const commentX = this.point.x;
            const commentY = currentY;
            cv.render(layer, commentX, commentY);
            c.point = this.point;
            cv.onDelete = () => {
                this.toggleComments(layer);
                this.toggleComments(layer);
            };
            if (cv.group && cv.group.children && cv.group.children.length > 0) {
                const rect = cv.group.children[0];
                if (rect && typeof rect.height === 'function') {
                    currentY += rect.height() + 8;
                } else {
                    currentY += 35;
                }
            } else {
                currentY += 35;
            }
            return cv;
        });
        this.commentsVisible = true;
        layer.draw();
    }
} 