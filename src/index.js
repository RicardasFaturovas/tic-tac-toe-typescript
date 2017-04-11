var canvas;
var ctx;
var data;
window.onload = function (main) {
    canvas = document.createElement('canvas');
    canvas.width = canvas.height = 3 * 120 + 20;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
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
    data[0].flip(data[0].NOUGHT);
};
var tick = function () {
    window.requestAnimationFrame(tick);
    update();
    render();
};
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
var Tile = (function () {
    function Tile(x, y) {
        this.tile = this.BLANK;
        this.anim = 0;
        this.x = x;
        this.y = y;
        if (this.tile == null) {
            var _c = document.createElement('canvas');
            _c.width = canvas.height = 100;
            var _ctx = _c.getContext("2d");
            _ctx.fillStyle = "skyblue";
            _ctx.lineWidth = 4;
            _ctx.strokeStyle = "white";
            _ctx.fillRect(0, 0, 100, 100);
            this.BLANK = new Image();
            this.BLANK.src = _c.toDataURL();
            _ctx.fillRect(0, 0, 100, 100);
            _ctx.beginPath();
            _ctx.arc(50, 50, 30, 0, 2 * Math.PI);
            _ctx.stroke();
            this.NOUGHT = new Image();
            this.NOUGHT.src = _c.toDataURL();
            _ctx.fillRect(0, 0, 100, 100);
            _ctx.beginPath();
            _ctx.moveTo(20, 20);
            _ctx.lineTo(80, 80);
            _ctx.moveTo(80, 20);
            _ctx.lineTo(20, 80);
            _ctx.stroke();
            this.CROSS = new Image();
            this.CROSS.src = _c.toDataURL();
            this.tile = this.BLANK;
        }
    }
    ;
    Tile.prototype.flip = function (next) {
        this.tile = next;
        this.anim = 1;
    };
    Tile.prototype.update = function () {
        if (this.anim > 0) {
            this.anim -= 0.08;
        }
    };
    ;
    Tile.prototype.draw = function (ctx) {
        if (this.anim <= 0) {
            ctx.drawImage(this.tile, this.x, this.y);
            return;
        }
        var res = 4;
        var t = this.anim > 0.5 ? this.BLANK : this.tile;
        var p = -Math.abs(2 * this.anim - 1) + 1;
        for (var i = 0; i < 100; i += res) {
            var j = this.anim > 0.5 ? 100 - i : i;
            ctx.drawImage(t, i, 0, res, 100, this.x + i - p * i + 50 * p, this.y - j * p * 0.2, res, 100 + j * p * 0.4);
        }
    };
    ;
    return Tile;
}());
//# sourceMappingURL=index.js.map