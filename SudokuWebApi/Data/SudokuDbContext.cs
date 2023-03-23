using Microsoft.EntityFrameworkCore;
using SudokuWebApi.Models;

namespace SudokuWebApi.Data
{
    public class SudokuDbContext : DbContext
    {
        public SudokuDbContext() : base()
        {
        }
        public SudokuDbContext(DbContextOptions<SudokuDbContext> options) : base(options)
        {
        }

        public DbSet<Sudoku> Sudokus { get; set; }
    }
}
