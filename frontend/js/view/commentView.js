// commentView.js
class CommentView {
    constructor(comment) {
        this.comment = comment;
        this.group = null;
    }
    render(layer, x, y) {
        if (this.group) {
            this.group.destroy();
        }
        this.group = new Konva.Group();
        const rect = new Konva.Rect({
            width: 220,
            height: 30,
            fill: this.comment.backgroundColor,
            stroke: '#888',
            cornerRadius: 6,
            shadowColor: '#aaa',
            shadowBlur: 4
        });
        const text = new Konva.Text({
            text: this.comment.text,
            fontSize: 16,
            fill: '#222',
            padding: 5,
            width: 200,
            ellipsis: true
        });
        const minWidth = 120;
        const maxWidth = 360;
        text.width(maxWidth);
        text.height('auto');
        let textWidth = Math.max(minWidth, Math.min(text.getTextWidth(), maxWidth));
        text.width(textWidth);
        rect.width(textWidth + 30);
        rect.height(text.height() + 10);
        this.group.x(x - (rect.width() / 2));
        this.group.y(y);
        const editIcon = new Konva.Label({ x: textWidth + 5, y: 2 });
        editIcon.add(new Konva.Tag({ fill: '#fff', stroke: '#888', cornerRadius: 4 }));
        editIcon.add(new Konva.Text({ text: '✎', fontSize: 14, fill: '#333', padding: 2 }));
        editIcon.on('click', (e) => {
            e.cancelBubble = true;
            window.dialogs.showCommentDialog(this.comment, ({ text, backgroundColor }) => {
                api.updateComment(this.comment.id, { text, backgroundColor })
                    .then(() => {
                        this.comment.text = text;
                        this.comment.backgroundColor = backgroundColor;
                        this.render(layer, x, y);
                        layer.draw();
                    })
                    .catch(err => alert('Ошибка обновления комментария: ' + err.message));
            });
        });
        editIcon.on('mouseenter', () => { document.body.style.cursor = 'pointer'; });
        editIcon.on('mouseleave', () => { document.body.style.cursor = 'default'; });
        const deleteIcon = new Konva.Label({ x: textWidth + 25, y: 2 });
        deleteIcon.add(new Konva.Tag({ fill: '#fff', stroke: '#888', cornerRadius: 4 }));
        deleteIcon.add(new Konva.Text({ text: '✖', fontSize: 14, fill: '#d00', padding: 2 }));
        deleteIcon.on('click', (e) => {
            e.cancelBubble = true;
            if (confirm('Удалить комментарий?')) {
                api.deleteComment(this.comment.id)
                    .then(() => {
                        if (this.comment.point && this.comment.point.comments) {
                            const idx = this.comment.point.comments.findIndex(c => c.id === this.comment.id);
                            if (idx !== -1) this.comment.point.comments.splice(idx, 1);
                        }
                        this.group.destroy();
                        layer.draw();
                        if (this.onDelete) this.onDelete();
                    })
                    .catch(err => alert('Ошибка удаления комментария: ' + err.message));
            }
        });
        deleteIcon.on('mouseenter', () => { document.body.style.cursor = 'pointer'; });
        deleteIcon.on('mouseleave', () => { document.body.style.cursor = 'default'; });
        this.group.add(rect);
        this.group.add(text);
        this.group.add(editIcon);
        this.group.add(deleteIcon);
        layer.add(this.group);
    }
} 