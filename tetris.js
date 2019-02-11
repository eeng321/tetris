var canvas = document.getElementById("canvas"); //current view

var GRID_WIDTH = 480;
var GRID_HEIGHT = 840;
canvas.width = GRID_WIDTH;
canvas.height = GRID_HEIGHT;

var g = canvas.getContext("2d");

var EMPTY = -1; //empty square
var BORDER = -9; //border
var COLS = 12; //number of columns
var ROWS = 21; //number of rows
var SQUARE_SIZE = 40;
var grid = []; //grid array
var speed = 500; //piece fall speed
var active; //active piece
var nextActive; //next piece
var next; //next active piece
var spawnRow = 0;
var spawnCol = 6;
var right = { r: 0, c: 1 };
var left = { r: 0, c: -1 };
var down = { r: 1, c: 0 };
var paused = false;

//row, col
var OPiece = [
    [[0, -1], [0, 0], [1, -1], [1, 0]]
]

var IPiece = [
    [[1, -2], [1, -1], [1, 0], [1, 1]],
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
        this.location = location; //array of [r,c]
        this.color = color; //int
        this.pivot = { r: spawnRow, c: spawnCol }; //spawn
        this.isActive = true;
    }
}

function pause(){
    if(paused){
        paused = false;  
    }
    else{
        paused = true;
    }
    alert("Paused");
}

addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            tryRotate();
            break;
        case 'ArrowDown':
            tryMove(down);
            break;
        case 'ArrowLeft':
            tryMove(left);
            break;
        case 'ArrowRight':
            tryMove(right);
            break;
        case 'p':
            //used mostly for testing
            pause();
            break;
        case 'r':
            restart();
            break;
        case ' ':
            while(tryMove(down)){
                //drop piece until it hits something
            }
            break;
        case 'q':
            gameOver();
            break;
    }
});



function setLocation(piece) {
    for (var i = 0; i < piece.length; i++) {
        active.location[i][0] = piece[i][0] + active.pivot.r;
        active.location[i][1] = piece[i][1] + active.pivot.c;
    }
}

function checkEmpty(piece) {
    var isEmpty = true;
    var r, c;
    for (var i = 0; i < piece.length; i++) {
        r = piece[i][0];
        c = piece[i][1];
        if (grid[r][c] === BORDER || grid[r][c] !== EMPTY) {
            isEmpty = false;
        }
    }
    return isEmpty;
}

function tryRotate() {
    //O type pieces cannot rotate
    if (active.type === OPiece) {
        return false;
    }
    var newOrientation = active.orientation + 1;
    undrawActive();
    //compute rotation
    if (newOrientation >= active.type.length) {
        newOrientation = 0;
    }
    setLocation(active.type[newOrientation]);
    if (!checkEmpty(active.location)) {
        setLocation(active.type[active.orientation]);
    }
    else {
        active.orientation = newOrientation;
    }
    mapPiece();
    drawBoardState();
    return false;
}

function undrawActive() {
    for (var i = 0; i < active.location.length; i++) {
        r = active.location[i][0];
        c = active.location[i][1];
        removeSquare(r, c);
    }
}

function tryMove(direction) {
    var r, c;
    var canMove = true;
    undrawActive();
    for (var i = 0; i < active.location.length; i++) {
        //add direction to location
        r = active.location[i][0];
        c = active.location[i][1];
        r += direction.r;
        c += direction.c;
        if (grid[r][c] !== EMPTY || grid[r][c] === BORDER) {
            canMove = false;
        }
    }
    if (canMove) {
        for (var i = 0; i < active.location.length; i++) {
            active.location[i][0] += direction.r;
            active.location[i][1] += direction.c;
        }
        active.pivot.r += direction.r;
        active.pivot.c += direction.c;
    }
    mapPiece();
    drawBoardState();
    return canMove;
}

function getRandom() {
    var rand = Math.floor(Math.random() * (pieces.length));
    var type = pieces[rand]; //piece type
    var o = Math.floor(Math.random() * type.length); //orientation
    var p = type[o];
    var location = [];
    for (var i = 0; i < p.length; i++) {
        location[i] = new Array(2);
        location[i][0] = p[i][0] + spawnRow; //compute row location
        location[i][1] = p[i][1] + spawnCol; //compute col location
    }
    return new Piece(type, o, location, rand); //random piece
}

function spawnRandomPiece() {
    active = nextActive;
    nextActive = getRandom();
    if (active == null) {
        active = getRandom();
    }
    drawPiece(active);
}

function drawPiece(piece) {
    for (var i = 0; i < piece.type[piece.orientation].length; i++) {
        mapSquare(piece.location[i], piece.color);
    }
}

function mapPiece() {
    for (var i = 0; i < active.location.length; i++) {
        mapSquare(active.location[i], active.color);
    }
}

//loc = [row,col] array index
function mapSquare(loc, color) {
    grid[loc[0]][loc[1]] = color;
}

function drawBoardState() {
    for (var r = 0; r < ROWS; r++) {
        for (var c = 1; c < COLS; c++) {
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

function pieceLanded() {
    if(active.pivot.r < 2 && active.isActive == false) {
        setTimeout(gameOver,100);
    }
    removeLines();
    setTimeout(spawnRandomPiece,100);
}

function removeLines(){
    for(var r = 0; r < ROWS - 1; r++){
        for(var c = 1; c < COLS - 1; c++){
            if(grid[r][c] === EMPTY){
                break;
            }
            if(c === COLS - 2){
                removeLine(r);
            }
        }
    }
}

function removeLine(row){
    for(var c = 1; c < COLS - 1; c++){
        removeSquare(row,c);
    }
    for(var c = 1; c < COLS - 1; c++){
        for(var r = row; r > 0; r--){
            grid[r][c] = grid[r-1][c];
            removeSquare(r-1,c);
            drawBoardState();
        }
    }
}

function restart(){
    document.location.reload();
}

function gameOver() {
    clear();
    alert("Game Over");
    setTimeout(restart,100);
}

function clear() {
    g.clearRect(0, 0, canvas.width, canvas.height);
    active = null;
    nextActive = null;
}

function drop() {
    if (tryMove(down) == false) {
        active.isActive = false;
        pieceLanded();
    }
}

function removeSquare(r, c) {
    if(grid[r][c] === EMPTY || grid[r][c] ===  BORDER){
        return;
    }
    g.fillStyle = "black";
    g.fillRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    g.strokeStyle = "white";
    g.strokeRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
    grid[r][c] = EMPTY;
}

function drawGrid(r, c) {
    g.beginPath();
    g.lineWidth = "1";
    g.strokeStyle = "white"
    g.strokeRect(c * SQUARE_SIZE, r * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
}

function initGrid() {
    //init grid array
    for (var r = 0; r < ROWS; r++) {
        grid[r] = new Array(COLS);
        for (var c = 0; c < COLS; c++) {
            grid[r][c] = EMPTY;
            if (r === ROWS - 1 || c === 0 || c === COLS - 1) {
                grid[r][c] = BORDER;
            }
            else {
                drawGrid(r, c);
            }
        }
    }
}

function play() {
    clear();
    initGrid();
    spawnRandomPiece();
    drawBoardState();
    setInterval(drop, speed); //auto drop each active piece
}
