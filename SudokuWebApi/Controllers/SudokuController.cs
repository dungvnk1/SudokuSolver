using System;
using System.Linq;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SudokuWebApi.Data;
using SudokuWebApi.Models;

namespace SudokuWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]    
    public class SudokuController : ControllerBase
    {
        private readonly SudokuDbContext _context;

        public SudokuController(SudokuDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Solve(Sudoku sudoku)
        {
            if (sudoku.Table.Length != 81)
            {
                return BadRequest("Invalid Sudoku table");
            }

            var newsudoku = new Sudoku
            {
                Table = sudoku.Table,
                SolvedAt = DateTime.Now
            };

            _context.Sudokus.Add(newsudoku);
            await _context.SaveChangesAsync();

            return Ok(sudoku);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sudoku>>> GetSudokus()
        {
            // Use Entity Framework to retrieve the Sudoku data from the database
            var sudokus = await _context.Sudokus.ToListAsync();

            // Return the Sudoku data as JSON in the response body
            return Ok(sudokus);
        }
    }
}
