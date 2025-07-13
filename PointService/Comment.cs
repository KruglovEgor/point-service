namespace PointService
{
    public class Comment
    {
        public int Id { get; set; }
        public int PointId { get; set; }
        public string Text { get; set; } = string.Empty;
        public string BackgroundColor { get; set; } = "#FFFF00";
        public string? UserId { get; set; }
        public Point Point { get; set; } = null!;
    }
} 