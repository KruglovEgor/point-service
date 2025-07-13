using Microsoft.EntityFrameworkCore;

namespace PointService
{
    public class PointsDbContext : DbContext
    {
        public PointsDbContext(DbContextOptions<PointsDbContext> options) : base(options) { }

        public DbSet<Point> Points { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Point>()
                .HasMany(p => p.Comments)
                .WithOne(c => c.Point)
                .HasForeignKey(c => c.PointId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
} 