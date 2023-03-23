using System;

namespace SudokuWebApi.Models
{
    public class Sudoku
    {
        public int Id { get; set; }
        public string Table { get; set; }
        public DateTime SolvedAt { get; set; }
    }
}
