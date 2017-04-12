import Tile from "./gameObjects/tile";
import AIPlayer from "./gameObjects/ai";
var canvas;
var ctx;
var data;
var player;
var ai;
var isPlayer;
var aiMoved;
var winner;
window.onload = function (main) {
    canvas = document.createElement('canvas');
    canvas.width = canvas.height = 3 * 120 + 20;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    canvas.addEventListener("mousedown", mouseDown);
    init();
    tick();
};
var init = function () {
    if (data == null) {
        data = [];
        for (var i = 0; i < 9; i++) {
            var x = (i % 3) * 120 + 20;
            var y = Math.floor(i / 3) * 120 + 20;
            data.push(new Tile(x, y));
        }
    }
    player = Tile.prototype.NOUGHT;
    isPlayer = player === Tile.prototype.NOUGHT;
    aiMoved = false;
    ai = new AIPlayer(data);
    ai.setSeed(player === Tile.prototype.NOUGHT ? Tile.prototype.CROSS : Tile.prototype.NOUGHT);
    console.log(ai.move());
};
var tick = function () {
    window.requestAnimationFrame(tick);
    update();
    render();
};
var update = function () {
    var activeAnim = false;
    for (var i = data.length; i--;) {
        data[i].update();
        activeAnim = activeAnim || data[i].active();
    }
    if (!activeAnim) {
        if (!aiMoved && !isPlayer) {
            var move = ai.move();
            if (move === -1) {
                winner = true;
            }
            else
                data[move].flip(ai.getSeed());
            isPlayer = true;
        }
        if (winner && !aiMoved) {
            if (winner === true) {
                console.log("The game was a draw!");
            }
            else if (winner === Tile.prototype.NOUGHT) {
                console.log("The Kappa player won!");
            }
            else {
                console.log("The PogChamp AI won!");
            }
        }
        aiMoved = true;
    }
    else {
        if (aiMoved) {
            winner = ai.hasWinner();
        }
        aiMoved = false;
    }
};
var render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = data.length; i--;) {
        data[i].draw(ctx);
    }
};
var mouseDown = function (evt) {
    if (!isPlayer)
        return;
    var el = evt.target;
    var positionX = evt.clientX - el.offsetLeft;
    var positionY = evt.clientY - el.offsetTop;
    if (positionX % 120 >= 20 && positionY % 120 >= 20) {
        var index = Math.floor(positionX / 120);
        index += Math.floor(positionY / 120) * 3;
        if (data[index].hasData()) {
            return;
        }
        data[index].flip(player);
        isPlayer = false;
    }
};
//# sourceMappingURL=index.js.map