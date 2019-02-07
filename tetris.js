var canvas = document.getElementById("canvas"); //current view

var GRID_WIDTH = 400;
var GRID_HEIGHT = 800;
canvas.width = GRID_WIDTH;
canvas.height = GRID_HEIGHT;

var g = canvas.getContext("2d");
var gNext = canvas.getContext("2d");

var EMPTY = -1; //empty square
var COLS = 10; //number of columns
var ROWS = 20; //number of rows
var SQUARE_SIZE = 40;
var grid = []; //grid array
var speed; //piece fall speed
var active; //active piece
var next; //next active piece

//row, col
var OPiece = [
    [[1, -1], [1, 0], [2, -1], [2, 0]]
]

var IPiece = [
    [[1, -2], [1, -1], [1, 0], [1, 1]],
    [[0, 0], [1, 0], [2, 0], [3, 0]]
]

var SPiece = [
    [[1, 0], [1, 1], [2, 0], [2, -1]],
    [[1, 0], [0, 0], [1, 1], [2, 1]]
]

var ZPiece = [
    [[1, 0], [1, -1], [2, 0], [2, 1]],
    [[1, 0], [0, 1], [2, 0], [1, 1]]
]

var LPiece = [
    [[1, 0], [1, -1], [1, 1], [2, -1]],
    [[1, 0], [0, 0], [2, 0], [2, 1]],
    [[1, 0], [1, -1], [1, 1], [0, 1]],
    [[1, 0], [2, 0], [0, -1], [0, 0]]
]

var JPiece = [
    [[1, 0], [1, -1], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [0, 0], [0, 1]],
    [[1, 0], [0, -1], [1, -1], [1, 1]],
    [[1, 0], [2, -1], [2, 0], [0, 0]]
]

var TPiece = [
    [[1, 0], [1, -1], [1, 1], [2, 0]],
    [[1, 0], [0, 0], [1, 1], [2, 0]],
    [[1, 0], [1, -1], [1, 1], [0, 0]],
    [[1, 0], [0, 0], [1, -1], [2, 0]]
]

var pieces = [
    OPiece, IPiece, SPiece, ZPiece, LPiece, JPiece, TPiece
]

var colors = ["#ffff00", "#00bfff", "#80ff00", "#ff4000", "#ffbf00", "#0000ff", "#8000ff"];


class Piece {
    constructor(piece, o, color) {
        this.type = piece;
        this.orientation = o;
        this.color = color;
        this.isFalling = true;
        this.isActive = true;
    }
}

function spawnRandomPiece() {
    var rand = Math.floor(Math.random() * (pieces.length));
    var type = pieces[rand]; //piece type
    var o = Math.floor(Math.random() * type.length); //orientation
    var rp = new Piece(type, o, rand); //random piece
    active = rp;
    //var col = Math.floor(Math.random() * COLS);
    var spawn = [0, 5]; //row,col
    drawPiece(rp, spawn); //spawn base orientation of a random piece at start location
}

function drawPiece(piece, location) {
    var p = piece.type[piece.orientation];
    for (var i = 0; i < p.length; i++) {
        p[i][0] += location[0]; //compute row location
        p[i][1] += location[1]; //compute col location
        mapSquare(p[i], piece.color);
    }
}

//loc = [row,col] array index
function mapSquare(loc, color) {
    grid[loc[0]][loc[1]] = color;
}

function drawBoardState() {
    for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
            if (grid[r][c] >= 0) {
                drawSquare(r,c);
            }
        }
    }
}

function drawSquare(r, c) {
    g.fillStyle = colors[grid[r][c]];
    g.fillRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    g.lineWidth = "1";
    g.rect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    g.stroke();
}


function fallingPiece() {
    console.log(active);
    
}

function refresh(){
    g = gNext;
    g.stroke();
}

function drawGrid(r, c) {
    g.beginPath();
    g.lineWidth = "1";
    g.strokeStyle = "white"
    g.rect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    g.stroke();
}

function initGrid() {
    //init grid array
    for (var row = 0; row < ROWS; row++) {
        grid[row] = new Array(COLS);
    }

    for (var r = 0; r < ROWS; r++) {
        for (var c = 0; c < COLS; c++) {
            grid[r][c] = EMPTY;
            drawGrid(r, c);
        }
    }
}

function play() {
    spawnRandomPiece();
    if(active.isFalling && active.isActive){
        setInterval(fallingPiece(), 500);
    }
}

function setup() {
    initGrid();
    play();
    drawBoardState();
}
