export default function Tile(x, y) {
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
    this.active = function () {
        return anim > 0;
    };
    this.equals = function (_tile) {
        return tile === _tile;
    };
    this.set = function (next) {
        tile = next;
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
//# sourceMappingURL=tile.js.map