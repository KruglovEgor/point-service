namespace PointService
{
    public class PointDto
    {
        public int Id { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public double Radius { get; set; }
        public string Color { get; set; } = "#FF0000";
        public List<CommentDto> Comments { get; set; } = new();
    }

    public class CommentDto
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public string BackgroundColor { get; set; } = "#FFFF00";
    }

    public class CreatePointDto
    {
        public double X { get; set; }
        public double Y { get; set; }
        public double Radius { get; set; }
        public string Color { get; set; } = "#FF0000";
    }

    public class UpdatePointDto
    {
        public double X { get; set; }
        public double Y { get; set; }
        public double Radius { get; set; }
        public string Color { get; set; } = "#FF0000";
    }

    public class CreateCommentDto
    {
        public string Text { get; set; } = string.Empty;
        public string BackgroundColor { get; set; } = "#FFFF00";
    }

    public class UpdateCommentDto
    {
        public string Text { get; set; } = string.Empty;
        public string BackgroundColor { get; set; } = "#FFFF00";
    }
} 