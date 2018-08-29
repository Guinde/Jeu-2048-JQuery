var grid;
var score = 0;


function blankGrid() {
    return [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
}

function setup() {
    grid = blankGrid();
    addNumber();
    addNumber();
}


//Creation de la grid a laffichage
function draw() {
    $(".container").empty();
    for (var i = 0; i < 4; i++) {
        $(".container").append('<div class ="grid-line" id="line"' + i + '></div>');
        for (var j = 0; j < 4; j++) {
            if (grid[i][j] === 0)
                $(".container").append('<div class ="grid-cell empty"></div>');
            else
                $(".container").append('<div class ="grid-cell">' + grid[i][j] + '</div>');
        }
    }
}

//Ajoute un numero (2 ou 4) dans les cases 0(libre)
function addNumber() {
    var options = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (grid[i][j] === 0)
                options.push({x: i, y: j});
        }
    }
    if (options.length > 0) {
        var spot = options[Math.floor(Math.random() * options.length)];
        var r = Math.floor(Math.random() * 10);
        grid[spot.x][spot.y] = r < 9 ? 2 : 4;
    }
}

//Permet de slide a droite
function slide_right(line) {
    var arr = line.filter(val => val);
    var miss = 4 - arr.length;
    var zeros = Array(miss).fill(0);
    arr = zeros.concat(arr);
    return arr;
}

//Permet de slide a gauche
function slide_left(line) {
    var arr = line.filter(val => val);
    var miss = 4 - arr.length;
    var zeros = Array(miss).fill(0);
    arr = arr.concat(zeros);
    return arr;
}

//Permet de fusionner
function combine_left(line) {
    for (var i = 0; i < 4; i++) {
        var a = line[i];
        var b = line[i - 1];
        if (a == b) {
            line[i] = a + b;
            score += line[i];
            $("#score").html(score);
            line[i - 1] = 0;
        }
    }
    return line;
}

//Permet de fusionner
function combine_right(line) {
    for (var i = 3; i >= 0; i--) {
        var a = line[i];
        var b = line[i - 1];
        if (a == b) {
            line[i] = a + b;
            score += line[i];
            $("#score").html(score);
            line[i - 1] = 0;    
        }
    }
    return line;
}

//Permet de slide et de fusionner a droite
function op_right(line) {
    line = slide_right(line);
    line = combine_right(line);
    line = slide_right(line);
    return line;
}

//Permet de slide et de fusionner a gauche
function op_left(line) {
    line = slide_left(line);
    line = combine_left(line);
    line = slide_left(line);
    return line;
}

//Rotate le tableau afin de gerer le le haut et le bas en ligne
function rotateGrid() {
    var newGrid = blankGrid();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            newGrid[i][j] = grid[j][i];
        }
    }
    return newGrid;
}

//Copier le tableau pour comparer
function copyGrid(grid) {
    var extra = blankGrid();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            extra[i][j] = grid[i][j];
        }
    }
    return extra;
}

//Comparer 2 tableaux
function compare(a, b) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (a[i][j] !== b[i][j])
                return true;
        }
    }
    return false;
}

function doit_left() {
    var past = copyGrid(grid)
    for (var i = 0; i < 4; i++) {
        grid[i] = op_left(grid[i]);
    }
    var changed = compare(past, grid);
    if(changed == true)
        addNumber();
}

function doit_right() {
    var past = copyGrid(grid);
    for (var i = 0; i < 4; i++) {
        grid[i] = op_right(grid[i]);
    }
    var changed = compare(past, grid);
    if(changed == true)
        addNumber();
}

//Verifie s'il reste des cases vides
function isEmpty() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (grid[i][j] === 0)
                return false;
        }
    }
    return true;
}

//Verifie les doublons par ligne
function isCombinaison_line() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
            if (grid[i][j] == grid[i][j + 1])
                return false;
        }
    }
    return true;
}

//Verifie les doublons par colone
function isCombinaison_col() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {
            if (grid[i][j] === grid[i + 1][j])
                return false;
        }
    }
    return true;
}

//Appelle les 3 fonction de verification
function GameOver() {
  var empty = isEmpty();
  var line = isCombinaison_line();
  var col = isCombinaison_col()
    if (empty == true && line == true && col == true){
             return true;
    }
}

//VErifie si on a gagne
function winGame() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (grid[i][j] === 2048)
                return true;
        }
    }
    return false;
}

//Gestion des touches fleches
$(document).on("keyup", function (e) {
    var game = GameOver();
    var win = winGame();
    var rotated = false;
    switch (e.which) {
        case 37:
            //left arrow key
            doit_left();
            break;
        case 38:
            //up arrow key
            grid = rotateGrid();
            rotated = true;
            doit_left();
            break;
        case 39:
            //right arrow key
            doit_right();
            break;
        case 40:
            //bottom arrow key
            grid = rotateGrid();
            rotated = true;
            doit_right();
            break;
    }

    if (rotated) {
        grid = rotateGrid();
        grid = rotateGrid();
        grid = rotateGrid();
    }

    if(game)
        alert("Game Over");
    if(win)
    {
        alert("Good job !!")
    }
       
    draw();
});

$(document).ready(function () {
    $('.game').hide();
    $("#jouer").click(function () {
        $(".game").show();
        $('#jouer').hide();
        setup();
        draw();
    });
    $("#new").click(function (){
        setup();
        draw();
        score = 0;
    });
});