var canvas = document.getElementById("canvas")

var GRID_WIDTH = 400;
var GRID_HEIGHT = 800;
canvas.width = GRID_WIDTH;
canvas.height = GRID_HEIGHT;

var g = canvas.getContext("2d");
//empty square
var EMPTY = 0;

//number of columns
var COLS = 10;
//number of rows
var ROWS = 20;
var SQUARE_SIZE = 40;
//grid array
var grid = [];

function drawSquare(r,c){
    g.beginPath();
    g.lineWidth = "1";
    g.strokeStyle = "white"
    g.rect(c*SQUARE_SIZE, r*SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    g.stroke();
}

function initGrid(){
   
    for(var row = 0; row < ROWS; row++){
        grid[row] = new Array(COLS);
    }

    for (var r = 0; r < ROWS; r++){
        for(var c = 0; c < COLS; c++){
            grid[r][c] = EMPTY;
            drawSquare(r,c);
        }
    }
}

