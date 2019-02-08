var canvas = document.getElementById("canvas"); //current view

var GRID_WIDTH = 400;
var GRID_HEIGHT = 800;
canvas.width = GRID_WIDTH;
canvas.height = GRID_HEIGHT;

var g = canvas.getContext("2d");

var EMPTY = -1; //empty square
var COLS = 10; //number of columns
var ROWS = 20; //number of rows
var BUFFER = 10; //invisible grid
var SQUARE_SIZE = 40;
var grid = []; //grid array
var speed; //piece fall speed
var active; //active piece
var next; //next active piece
var spawn = { r: 0, c: 5 }; //row,col

//row, col
var OPiece = [
    [[0, -1], [0, 0], [1, -1], [1, 0]]
]

var IPiece = [
    [[0, -2], [0, -1], [0, 0], [0, 1]],
    [[0, 0], [1, 0], [2, 0], [3, 0]]
]

var SPiece = [
    [[0, 0], [0, 1], [1, 0], [1, -1]],
    [[1, 0], [0, 0], [1, 1], [2, 1]]
]

var ZPiece = [
    [[0, 0], [0, -1], [1, 0], [1, 1]],
    [[1, 0], [0, 1], [2, 0], [1, 1]]
]

var LPiece = [
    [[0, 0], [0, -1], [0, 1], [1, -1]],
    [[1, 0], [0, 0], [2, 0], [2, 1]],
    [[1, 0], [1, -1], [1, 1], [0, 1]],
    [[1, 0], [2, 0], [0, -1], [0, 0]]
]

var JPiece = [
    [[0, 0], [0, -1], [0, 1], [1, 1]],
    [[1, 0], [2, 0], [0, 0], [0, 1]],
    [[1, 0], [0, -1], [1, -1], [1, 1]],
    [[1, 0], [2, -1], [2, 0], [0, 0]]
]

var TPiece = [
    [[0, 0], [0, -1], [0, 1], [1, 0]],
    [[1, 0], [0, 0], [1, 1], [2, 0]],
    [[1, 0], [1, -1], [1, 1], [0, 0]],
    [[1, 0], [0, 0], [1, -1], [2, 0]]
]

var pieces = [
    OPiece, IPiece, SPiece, ZPiece, LPiece, JPiece, TPiece
]

var colors = ["#ffff00", "#00bfff", "#80ff00", "#ff4000", "#ffbf00", "#0000ff", "#8000ff"];


class Piece {
    constructor(piece, o, location, color) {
        this.type = piece;
        this.orientation = o; //int
        this.location = location;
        this.color = color; //int
        this.isFalling = true;
        this.isActive = true;
    }
}

function spawnRandomPiece() {
    var rand = Math.floor(Math.random() * (pieces.length));
    var type = pieces[rand]; //piece type
    var o = Math.floor(Math.random() * type.length); //orientation
    var p = type[o];
    var location = [];
    for (var i = 0; i < p.length; i++) {
        location[i] = new Array(2);
        location[i][0] = p[i][0] + spawn.r; //compute row location
        location[i][1] = p[i][1] + spawn.c; //compute col location
    }
    var rp = new Piece(type, o, location, rand); //random piece
    active = rp;
    //var col = Math.floor(Math.random() * COLS);
    drawPiece(rp); //spawn base orientation of a random piece at start location
}

function drawPiece(piece) {
    for (var i = 0; i < piece.type[piece.orientation].length; i++) {
        mapSquare(piece.location[i], piece.color);
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
                drawSquare(r, c);
            }
        }
    }
}

function drawSquare(r, c, ) {
    g.fillStyle = colors[grid[r][c]];
    g.fillRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    g.strokeStyle = "white";
    g.strokeRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}


function drop() {
    //temporary conditions
    if (active.isActive && active.location[0][0] < 21) {
        var r, c;
        for (var i = 0; i < active.location.length; i++) {
            r = active.location[i][0];
            c = active.location[i][1];
            removeSquare(r, c);
            active.location[i][0] += 1;
        }
        for (var i = 0; i < active.location.length; i++) {
            mapSquare(active.location[i], active.color);
        }
        drawBoardState();
    }
    else {
        spawnRandomPiece();
        drawBoardState();
    }

}

function removeSquare(r, c) {
    g.fillStyle = "black";
    g.fillRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    g.strokeStyle = "white";
    g.strokeRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    grid[r][c] = -1;
}

function collision(){

}

function drawGrid(r, c) {
    g.beginPath();
    g.lineWidth = "1";
    g.strokeStyle = "white"
    g.strokeRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}

function initGrid() {
    //init grid array
    for (var row = 0; row < ROWS + BUFFER; row++) {
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
    g.clearRect(0, 0, canvas.width, canvas.height);

    initGrid();

    spawnRandomPiece();
    drawBoardState();

    setInterval(drop,100);
}

function setup() {
    play();
}

