// models.js — классы данных
class Point {
    constructor({id, x, y, radius, color, comments = []}) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.comments = comments.map(c => new Comment(c));
    }
}
class Comment {
    constructor({id, text, backgroundColor}) {
        this.id = id;
        this.text = text;
        this.backgroundColor = backgroundColor;
    }
} 