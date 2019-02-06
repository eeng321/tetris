var canvas = document.getElementById("canvas")

var GRID_WIDTH = 400;
var GRID_HEIGHT = 800;
canvas.width = GRID_WIDTH;
canvas.height = GRID_HEIGHT;
var g = canvas.getContext("2d");

var EMPTY = 0; //empty square
var COLS = 10; //number of columns
var ROWS = 20; //number of rows
var SQUARE_SIZE = 40;
var grid = []; //grid array
var speed; //piece fall speed
var active; //active piece

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
    var rp = new Piece(type, o, colors[rand]); //random piece
    active = rp;
    //var col = Math.floor(Math.random() * COLS);
    var spawn = [0, 5]; //row,col
    drawPiece(rp, spawn); //spawn base orientation of a random piece at start location
}

//piece object, draw location, color of piece
function drawPiece(piece, location) {
    var p = piece.type[piece.orientation];
    for (var i = 0; i < p.length; i++) {
        drawSquare(p[i], location, piece.color);
    }
}

function drawSquare(piece, loc, color) {
    g.fillStyle = color;
    g.fillRect((piece[1] + loc[1]) * SQUARE_SIZE, (piece[0] + loc[0]) * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    g.lineWidth = "1";
    g.rect((piece[1] + loc[1]) * SQUARE_SIZE, (piece[0] + loc[0]) * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    g.stroke();
}

function fallingPiece(){
    console.log("excuting fall");
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
    console.log(active);
    // while(active.isFalling && active.isActive){
    //     setInterval(fallingPiece(), 500);
    // }
}

function setup() {
    initGrid();
    play();
}
