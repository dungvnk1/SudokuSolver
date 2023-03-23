const solveButton = document.getElementById("solveButton");
solveButton.addEventListener("click", function() {
    solveClickButton();
});

function solveClickButton() {
    const puzzle = readFromTable(); // Read the current puzzle from the HTML table
    const solution = solveSudoku(puzzle); // Call the solver algorithm
    if (solution && solution.length === 9 && solution[0].length === 9) {
        writeSolutionToTable(solution); // Update the HTML table with the computed values
    } else {
        alert("Unable to solve Sudoku puzzle. Please check your input.");
    }

    const sudoku = JSON.stringify(solution); // gets the Sudoku string from the input fields
    
    const strWithoutBrackets = sudoku.replace(/\[|\]/g, ''); // delete characters [ and ]
    const arr = strWithoutBrackets.split(',');
    const result = arr.join('').trim(); // combine array to string
    
    const solvedAt = new Date().toISOString();

    $.ajax({
        url: 'https://localhost:7040/api/Sudoku',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            Table: result,
            SolvedAt: solvedAt
        }),
        success: function(data) {
            console.log(data);
        },
        error: function(error) {
            console.error(error);
        }
    });

    $(function() {
        $("#gridContainer").dxDataGrid({
            dataSource: new DevExpress.data.CustomStore({
                loadMode: "raw",
                load: function() {
                    return $.getJSON("https://localhost:7040/api/Sudoku")
                        .fail(function() { throw "Data loading error" });
                }
            })
        });
    });
}

function readFromTable() {
    const table = document.getElementById("sudokuTable");
    const values = [];
    for (let i = 0; i < 9; i++) {
        const row = [];
        for (let j = 0; j < 9; j++) {
            const cell = table.rows[i].cells[j].getElementsByTagName("input")[0];
            const value = parseInt(cell.value);
            row.push(isNaN(value) ? 0 : value);
        }
        values.push(row);
    }
    return values;
}

// This is JS for Sudoku solver
function solveSudoku(grid) {
    // Find an empty cell
    const emptyCell = findEmptyCell(grid);

    // If there are no empty cells, the puzzle is solved
    if (!emptyCell) {
        return grid;
    }

    const [row, col] = emptyCell;

    // Try each possible value in the empty cell
    for (let num = 1; num <= 9; num++) {
        if (isValidMove(grid, row, col, num)) {
            grid[row][col] = num;

            let result = solveSudoku(grid);
            // Recursively try to solve the puzzle with the new value
            if (result) {
                return result;
            }

            // If the puzzle cannot be solved with the new value, backtrack and try a different value
            grid[row][col] = 0;
        }
    }

    // If no values can be placed in the empty cell, the puzzle cannot be solved
    return null;
}
function findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                return [row, col];
            }
        }
    }

    // If there are no empty cells, return null
    return null;
}
function isValidMove(grid, row, col, num) {
    // Check if num is already in the same row or column
    for (let i = 0; i < 9; i++) {
        if (grid[row][i] === num || grid[i][col] === num) {
            return false;
        }
    }

    // Check if num is already in the same 3x3 sub-grid
    const subGridRow = Math.floor(row / 3) * 3;
    const subGridCol = Math.floor(col / 3) * 3;

    for (let i = subGridRow; i < subGridRow + 3; i++) {
        for (let j = subGridCol; j < subGridCol + 3; j++) {
            if (grid[i][j] === num) {
                return false;
            }
        }
    }

    // If num is not already in the same row, column, or sub-grid, it is a valid move
    return true;
}

function writeSolutionToTable(solution) {
    const table = document.getElementById("sudokuTable");
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = table.rows[i].cells[j].getElementsByTagName("input")[0];
            cell.value = solution[i][j];
            cell.textContent = solution[i][j];
        }
    }
}
