// api.js
class Api {
    constructor(baseUrl = '/api/points') {
        this.baseUrl = baseUrl;
    }
    async getAllPoints() {
        const res = await fetch(this.baseUrl);
        if (!res.ok) throw new Error('Ошибка загрузки точек');
        return await res.json();
    }
    async createPoint(data) {
        const res = await fetch(this.baseUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Ошибка создания точки');
        return await res.json();
    }
    async updatePoint(id, data) {
        const res = await fetch(`${this.baseUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Ошибка обновления точки');
    }
    async deletePoint(id) {
        const res = await fetch(`${this.baseUrl}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Ошибка удаления точки');
    }
    async addComment(pointId, data) {
        const res = await fetch(`${this.baseUrl}/${pointId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Ошибка добавления комментария');
        return await res.json();
    }
    async updateComment(id, data) {
        const res = await fetch(`${this.baseUrl}/comments/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Ошибка обновления комментария');
    }
    async deleteComment(id) {
        const res = await fetch(`${this.baseUrl}/comments/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Ошибка удаления комментария');
    }
}
window.api = new Api(); 