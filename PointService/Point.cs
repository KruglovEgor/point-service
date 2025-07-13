using System.Collections.Generic;

namespace PointService
{
    public class Point
    {
        public int Id { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public double Radius { get; set; }
        public string Color { get; set; } = "#FF0000";
        public string? UserId { get; set; }
        public List<Comment> Comments { get; set; } = new();
    }
} 