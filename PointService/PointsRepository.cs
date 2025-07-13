using Microsoft.EntityFrameworkCore;

namespace PointService
{
    public class PointsRepository
    {
        private readonly PointsDbContext _context;
        public PointsRepository(PointsDbContext context)
        {
            _context = context;
        }

        public async Task<List<Point>> GetAllPointsAsync()
        {
            return await _context.Points.Include(p => p.Comments).ToListAsync();
        }

        public async Task<Point?> GetPointByIdAsync(int id)
        {
            return await _context.Points.Include(p => p.Comments).FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task AddPointAsync(Point point)
        {
            _context.Points.Add(point);
            await _context.SaveChangesAsync();
        }

        public async Task UpdatePointAsync(Point point)
        {
            _context.Points.Update(point);
            await _context.SaveChangesAsync();
        }

        public async Task DeletePointAsync(int id)
        {
            var point = await _context.Points.FindAsync(id);
            if (point != null)
            {
                _context.Points.Remove(point);
                await _context.SaveChangesAsync();
            }
        }

        public async Task AddCommentAsync(Comment comment)
        {
            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateCommentAsync(Comment comment)
        {
            _context.Comments.Update(comment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCommentAsync(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment != null)
            {
                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Comment?> GetCommentByIdAsync(int id)
        {
            return await _context.Comments.FindAsync(id);
        }
    }
} 