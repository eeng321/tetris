var canvas = document.getElementById("canvas"); //current view

var GRID_WIDTH = 480;
var GRID_HEIGHT = 840;
canvas.width = GRID_WIDTH;
canvas.height = GRID_HEIGHT;

var g = canvas.getContext("2d");

var EMPTY = -1; //empty square
var BORDER = -9999; //border
var COLS = 12; //number of columns
var ROWS = 21; //number of rows
var SQUARE_SIZE = 40;
var grid = []; //grid array
var speed; //piece fall speed
var active; //active piece
var next; //next active piece
var spawn = { r: 0, c: 6 }; //row,col
var right = { r: 0, c: 1 };
var left = { r: 0, c: -1 };
var down = { r: 1, c: 0 };
var pivot = spawn; //pivot of active piece

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
        this.isActive = true;
    }
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
    }
});

function setLocation(piece){
    var r, c;
    
    for(var i = 0; i < piece.length; i++){
        r = piece[i][0];
        c = piece[i][1];
        active.location[i][0] = r + pivot.r;
        active.location[i][1] = c + pivot.c;
    }
}

function checkEmpty(piece){
    var isEmpty = true;
    var r,c;
    for (var i = 0; i < piece.length; i++) {
        r = piece[i][0];
        c = piece[i][1];
        if(grid[r][c] === BORDER || grid[r][c] !== EMPTY){
            isEmpty = false;
        }
    }
    console.log("isEmpty = " + isEmpty);
    return isEmpty;
}

function tryRotate(){
    //O actives cannot rotate
    if(active.type === OPiece){
        // console.log(active.type);
        return false;
    }
    var newOrientation = active.orientation + 1;
    undrawActive();
    //compute rotation
    if(newOrientation >= active.type.length){
        newOrientation = 0;
    }
    setLocation(active.type[newOrientation]);
    if(!checkEmpty(active.location)){
        setLocation(active.type[active.orientation]);
    }
    else{
        active.orientation = newOrientation;
    }
    console.log(newOrientation);
    console.log(active.location);
    mapPiece();
    drawBoardState();
    return false;
}

function undrawActive(){
    for (var i = 0; i < active.location.length; i++) {
        r = active.location[i][0];
        c = active.location[i][1];
        removeSquare(r, c);
    }
}

function tryMove(direction){
    console.log("tryMove");
    var r,c;
    var canMove = true;
    undrawActive();
    for(var i = 0; i < active.location.length; i++){
        //add direction to location
        r = active.location[i][0];
        c = active.location[i][1];
        r += direction.r;
        c += direction.c;
        if(grid[r][c] !== EMPTY || grid[r][c] === BORDER){
            canMove = false;
        }
    }
    if(canMove){
        for(var i = 0; i < active.location.length; i++){
            active.location[i][0] += direction.r;
            active.location[i][1] += direction.c;
        }
        pivot.r += direction.r;
        pivot.c += direction.c;
    }
    console.log(grid);
    mapPiece();
    drawBoardState();
}

function spawnRandomPiece() {
    var rand = Math.floor(Math.random() * (pieces.length));
    var type = pieces[rand]; //piece type
    var o = Math.floor(Math.random() * type.length); //orientation
    var p = type[o];
    var location = [];
    pivot = spawn;
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

function mapPiece(){
    for(var i = 0; i < active.location.length; i++){
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


function drop() {
    //temporary conditions
    if (active.isActive && pivot.r < 19) {
        var r, c;
        for (var i = 0; i < active.location.length; i++) {
            r = active.location[i][0];
            c = active.location[i][1];
            removeSquare(r, c);
            active.location[i][0] += 1;
            pivot.r++;
            
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
            if(r === ROWS - 1 || c === 0 || c === COLS -1){
                grid[r][c] = BORDER;
            }
            else{
                drawGrid(r, c);
            }
        }
    }
}

function play() {
    g.clearRect(0, 0, canvas.width, canvas.height);

    initGrid();

    spawnRandomPiece();
    drawBoardState();

    // setInterval(drop, 1000);
}

function setup() {
    play();
}

