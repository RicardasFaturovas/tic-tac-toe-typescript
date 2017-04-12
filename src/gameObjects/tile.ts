export default function Tile (x,y) {
	let tile = Tile.prototype.BLANK;
	let anim = 0;


    this.x = x;
    this.y = y;

    if(tile==null){
      let _c= document.createElement('canvas');
      _c.width = _c.height = 100;
      let _ctx = _c.getContext("2d");

      _ctx.fillStyle = "skyblue"
      _ctx.lineWidth = 4;
      _ctx.strokeStyle = "white";

      //Blank Tile
      _ctx.fillRect(0,0,100,100);
      Tile.prototype.BLANK = new Image();
      Tile.prototype.BLANK.src = _c.toDataURL();

      //Kappa Tile
      Tile.prototype.NOUGHT = new Image(20,20);
      Tile.prototype.NOUGHT.src = 'http://i.picresize.com/images/2017/04/12/TqxYX.png';
      Tile.prototype.NOUGHT.onload = function() {
        _ctx.drawImage(Tile.prototype.NOUGHT, 20, 20);
      };


      //PogChamp Tile
      Tile.prototype.CROSS = new Image();
      Tile.prototype.CROSS.src = 'http://i.picresize.com/images/2017/04/12/g8RX.png';
      Tile.prototype.CROSS.onload = function() {
        _ctx.drawImage(Tile.prototype.CROSS, 20, 20);
      };

      tile = Tile.prototype.BLANK;
    }


  this.hasData = () => {
    return tile!==Tile.prototype.BLANK;
  }

  this.active = () => {
    return anim > 0;
  }

  this.equals = (_tile) => {
    return tile === _tile;
  }

  this.set = (next) => {
    tile = next;
  }

  this.flip = (next) => {
    tile = next;
    anim = 1;
  }

  this.update = () => {
    if(anim > 0){
      anim -=0.08;
    }
  };

  this.draw = (ctx) => {
    if(anim<=0){
     ctx.drawImage(tile,x,y);
     return;
    }
    const res = 4;
    let t;

    if(anim > 0.5){
      t = this.BLANK;
    } else t = tile

    const p =  -Math.abs(2*anim-1)+1;
    for(let i=0; i<100; i+=res){

      let j = anim > 0.5 ? 100 - i : i;
      ctx.drawImage(t, i, 0, res, 100,
        x + i - p*i+50*p,
        y - j*p*0.2,
        res,
        100 + j*p*0.4);
    }
  };
}
