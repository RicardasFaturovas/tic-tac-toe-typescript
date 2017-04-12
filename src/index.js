var canvas;
var ctx;
var data;
var player;
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
};
var tick = function () {
    window.requestAnimationFrame(tick);
    update();
    render();
};
function Tile(x, y) {
    var _this = this;
    var tile = Tile.prototype.BLANK;
    var anim = 0;
    this.x = x;
    this.y = y;
    if (tile == null) {
        var _c = document.createElement('canvas');
        _c.width = _c.height = 100;
        var _ctx_1 = _c.getContext("2d");
        _ctx_1.fillStyle = "skyblue";
        _ctx_1.lineWidth = 4;
        _ctx_1.strokeStyle = "white";
        _ctx_1.fillRect(0, 0, 100, 100);
        Tile.prototype.BLANK = new Image();
        Tile.prototype.BLANK.src = _c.toDataURL();
        Tile.prototype.NOUGHT = new Image(20, 20);
        Tile.prototype.NOUGHT.src = 'http://i.picresize.com/images/2017/04/12/TqxYX.png';
        Tile.prototype.NOUGHT.onload = function () {
            _ctx_1.drawImage(Tile.prototype.NOUGHT, 20, 20);
        };
        Tile.prototype.CROSS = new Image();
        Tile.prototype.CROSS.src = 'http://i.picresize.com/images/2017/04/12/g8RX.png';
        Tile.prototype.CROSS.onload = function () {
            _ctx_1.drawImage(Tile.prototype.CROSS, 20, 20);
        };
        tile = Tile.prototype.BLANK;
    }
    this.hasData = function () {
        return tile !== Tile.prototype.BLANK;
    };
    this.flip = function (next) {
        tile = next;
        anim = 1;
    };
    this.update = function () {
        if (anim > 0) {
            anim -= 0.08;
        }
    };
    this.draw = function (ctx) {
        if (anim <= 0) {
            ctx.drawImage(tile, x, y);
            return;
        }
        var res = 4;
        var t;
        if (anim > 0.5) {
            t = _this.BLANK;
        }
        else
            t = tile;
        var p = -Math.abs(2 * anim - 1) + 1;
        for (var i = 0; i < 100; i += res) {
            var j = anim > 0.5 ? 100 - i : i;
            ctx.drawImage(t, i, 0, res, 100, x + i - p * i + 50 * p, y - j * p * 0.2, res, 100 + j * p * 0.4);
        }
    };
}
var update = function () {
    for (var i = data.length; i--;) {
        data[i].update();
    }
};
var render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = data.length; i--;) {
        data[i].draw(ctx);
    }
};
var mouseDown = function (evt) {
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
        if (player === Tile.prototype.NOUGHT) {
            player = Tile.prototype.CROSS;
        }
        else
            player = Tile.prototype.NOUGHT;
        console.log(index);
    }
};
//# sourceMappingURL=index.js.map