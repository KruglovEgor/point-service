// dialogs.js — диалоги
class Dialogs {
    constructor() {}
    
    showPointDialog(point, onSave) {
        const isEdit = !!point;
        
        // Создаем HTML диалог
        const dialogHtml = `
            <div id="point-dialog-overlay" style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0,0,0,0.5); z-index: 10000; display: flex; 
                align-items: center; justify-content: center;">
                <div id="point-dialog" style="
                    background: white; border-radius: 8px; padding: 20px; 
                    min-width: 300px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                    <h3 style="margin: 0 0 20px 0; color: #333;">${isEdit ? 'Редактировать точку' : 'Создать точку'}</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #555;">Цвет:</label>
                        <input type="color" id="point-color" value="${point?.color || '#00BFFF'}" 
                               style="width: 100%; height: 40px; border: 2px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #555;">Радиус: <span id="radius-value">${point?.radius || 25}</span>px</label>
                        <input type="range" id="point-radius" min="5" max="100" value="${point?.radius || 25}" 
                               style="width: 100%; height: 6px; background: #ddd; border-radius: 3px; outline: none;">
                    </div>
                    
                    <div style="text-align: right;">
                        <button id="point-cancel" style="
                            background: #f0f0f0; border: 1px solid #ddd; padding: 8px 16px; 
                            border-radius: 4px; margin-right: 10px; cursor: pointer;">Отмена</button>
                        <button id="point-save" style="
                            background: #007bff; color: white; border: none; padding: 8px 16px; 
                            border-radius: 4px; cursor: pointer;">Сохранить</button>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем диалог в DOM
        $('body').append(dialogHtml);
        
        // Обработчики событий
        const $overlay = $('#point-dialog-overlay');
        const $radiusInput = $('#point-radius');
        const $radiusValue = $('#radius-value');
        
        // Обновление значения радиуса при движении ползунка
        $radiusInput.on('input', function() {
            $radiusValue.text($(this).val());
        });
        
        // Сохранение
        $('#point-save').on('click', function() {
            const color = $('#point-color').val();
            const radius = parseInt($radiusInput.val());
            
            if (!color || isNaN(radius) || radius < 5) {
                alert('Введите корректные значения');
                return;
            }
            
            $overlay.remove();
            onSave({ color, radius });
        });
        
        // Отмена
        $('#point-cancel').on('click', function() {
            $overlay.remove();
        });
        
        // Закрытие по клику вне диалога
        $overlay.on('click', function(e) {
            if (e.target === this) {
                $overlay.remove();
            }
        });
        
        // Закрытие по Escape
        $(document).on('keydown.dialog', function(e) {
            if (e.key === 'Escape') {
                $overlay.remove();
                $(document).off('keydown.dialog');
            }
        });
    }
    
    showCommentDialog(comment, onSave) {
        const isEdit = !!comment;
        
        // Создаем HTML диалог для комментария
        const dialogHtml = `
            <div id="comment-dialog-overlay" style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                background: rgba(0,0,0,0.5); z-index: 10000; display: flex; 
                align-items: center; justify-content: center;">
                <div id="comment-dialog" style="
                    background: white; border-radius: 8px; padding: 20px; 
                    min-width: 350px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
                    <h3 style="margin: 0 0 20px 0; color: #333;">${isEdit ? 'Редактировать комментарий' : 'Добавить комментарий'}</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #555;">Текст:</label>
                        <textarea id="comment-text" rows="3" style="
                            width: 100%; border: 2px solid #ddd; border-radius: 4px; 
                            padding: 8px; resize: vertical;">${comment?.text || ''}</textarea>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #555;">Цвет подложки:</label>
                        <input type="color" id="comment-bg-color" value="${comment?.backgroundColor || '#FFFF00'}" 
                               style="width: 100%; height: 40px; border: 2px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div style="text-align: right;">
                        <button id="comment-cancel" style="
                            background: #f0f0f0; border: 1px solid #ddd; padding: 8px 16px; 
                            border-radius: 4px; margin-right: 10px; cursor: pointer;">Отмена</button>
                        <button id="comment-save" style="
                            background: #007bff; color: white; border: none; padding: 8px 16px; 
                            border-radius: 4px; cursor: pointer;">Сохранить</button>
                    </div>
                </div>
            </div>
        `;
        
        // Добавляем диалог в DOM
        $('body').append(dialogHtml);
        
        // Обработчики событий
        const $overlay = $('#comment-dialog-overlay');
        
        // Сохранение
        $('#comment-save').on('click', function() {
            const text = $('#comment-text').val().trim();
            const backgroundColor = $('#comment-bg-color').val();
            
            if (!text || !backgroundColor) {
                alert('Введите корректные значения');
                return;
            }
            
            $overlay.remove();
            onSave({ text, backgroundColor });
        });
        
        // Отмена
        $('#comment-cancel').on('click', function() {
            $overlay.remove();
        });
        
        // Закрытие по клику вне диалога
        $overlay.on('click', function(e) {
            if (e.target === this) {
                $overlay.remove();
            }
        });
        
        // Закрытие по Escape
        $(document).on('keydown.comment-dialog', function(e) {
            if (e.key === 'Escape') {
                $overlay.remove();
                $(document).off('keydown.comment-dialog');
            }
        });
    }
}
window.dialogs = new Dialogs(); 