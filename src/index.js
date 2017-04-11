var canvas;
var ctx;
var data;
window.onload = function (main) {
    canvas = document.createElement('canvas');
    canvas.width = canvas.height = 200;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);
    init();
    tick();
};
var init = function () {
    data = new Tile(20, 20);
    data.flip(data.NOUGHT);
};
var tick = function () {
    window.requestAnimationFrame(tick);
    update();
    render();
};
var update = function () {
    data.update();
};
var render = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    data.draw(ctx);
};
var Tile = (function () {
    function Tile(x, y) {
        this.tile = this.BLANK;
        this.anim = 0;
        this.x = x;
        this.y = y;
        if (this.tile == null) {
            var _c = document.createElement('canvas');
            _c.width = canvas.height = 200;
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
            this.anim -= 0.02;
        }
    };
    ;
    Tile.prototype.draw = function (ctx) {
        if (this.anim <= 0) {
            return ctx.drawImage(this.tile, this.x, this.y);
        }
        var res = 2;
        var t = this.anim > 0.5 ? this.BLANK : this.tile;
        var p = -this.anim + 1;
        for (var i = 0; i < 100; i += res) {
            ctx.drawImage(t, i, 0, res, 100, this.x + i - p * i, this.y, res, 100);
        }
        ctx.drawImage(t, this.x, this.y);
    };
    ;
    return Tile;
}());
//# sourceMappingURL=index.js.map