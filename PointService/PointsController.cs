using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PointService
{
    [ApiController]
    [Route("api/[controller]")]
    public class PointsController : ControllerBase
    {
        private readonly PointsRepository _repo;
        public PointsController(PointsRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPoints()
        {
            var points = await _repo.GetAllPointsAsync();
            var result = points.Select(p => new PointDto
            {
                Id = p.Id,
                X = p.X,
                Y = p.Y,
                Radius = p.Radius,
                Color = p.Color,
                Comments = p.Comments.Select(c => new CommentDto
                {
                    Id = c.Id,
                    Text = c.Text,
                    BackgroundColor = c.BackgroundColor
                }).ToList()
            }).ToList();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPoint(int id)
        {
            var p = await _repo.GetPointByIdAsync(id);
            if (p == null) return NotFound();
            var result = new PointDto
            {
                Id = p.Id,
                X = p.X,
                Y = p.Y,
                Radius = p.Radius,
                Color = p.Color,
                Comments = p.Comments.Select(c => new CommentDto
                {
                    Id = c.Id,
                    Text = c.Text,
                    BackgroundColor = c.BackgroundColor
                }).ToList()
            };
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddPoint([FromBody] CreatePointDto dto)
        {
            if (dto.Radius <= 0 || string.IsNullOrWhiteSpace(dto.Color))
                return BadRequest("Некорректные данные точки");
            var point = new Point
            {
                X = dto.X,
                Y = dto.Y,
                Radius = dto.Radius,
                Color = dto.Color
            };
            await _repo.AddPointAsync(point);
            return CreatedAtAction(nameof(GetPoint), new { id = point.Id }, point);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePoint(int id, [FromBody] UpdatePointDto dto)
        {
            if (dto.Radius <= 0 || string.IsNullOrWhiteSpace(dto.Color))
                return BadRequest("Некорректные данные точки");
            var point = await _repo.GetPointByIdAsync(id);
            if (point == null) return NotFound();
            point.X = dto.X;
            point.Y = dto.Y;
            point.Radius = dto.Radius;
            point.Color = dto.Color;
            await _repo.UpdatePointAsync(point);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePoint(int id)
        {
            await _repo.DeletePointAsync(id);
            return NoContent();
        }

        // Комментарии
        [HttpPost("{pointId}/comments")]
        public async Task<IActionResult> AddComment(int pointId, [FromBody] CreateCommentDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Text) || string.IsNullOrWhiteSpace(dto.BackgroundColor))
                return BadRequest("Некорректные данные комментария");
            var comment = new Comment
            {
                PointId = pointId,
                Text = dto.Text,
                BackgroundColor = dto.BackgroundColor
            };
            await _repo.AddCommentAsync(comment);
            return Ok(comment);
        }

        [HttpPut("comments/{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] UpdateCommentDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Text) || string.IsNullOrWhiteSpace(dto.BackgroundColor))
                return BadRequest("Некорректные данные комментария");
            var comment = await _repo.GetCommentByIdAsync(id);
            if (comment == null) return NotFound();
            comment.Text = dto.Text;
            comment.BackgroundColor = dto.BackgroundColor;
            await _repo.UpdateCommentAsync(comment);
            return NoContent();
        }

        [HttpDelete("comments/{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            await _repo.DeleteCommentAsync(id);
            return NoContent();
        }
    }
} 