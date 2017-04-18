export default class Tile {
  x: number;
  y: number;
  static _c = document.createElement('canvas');
  static _ctx = Tile._c.getContext("2d");
  static BLANK = new Image();
  static NOUGHT = new Image(20, 20);
  static CROSS = new Image();
  public tile;
  public anim: number = 0;


  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    if(this.tile == null){
      Tile._c.width = Tile._c.height = 100;
      Tile._ctx.fillStyle = "skyblue"
      Tile._ctx.lineWidth = 4;
      Tile._ctx.strokeStyle = "white";

      //BLANK
      Tile._ctx.fillRect(0,0,100,100);
      Tile.BLANK.src = Tile._c.toDataURL();

      //KAPPA
      Tile.NOUGHT.src = 'http://i.picresize.com/images/2017/04/12/TqxYX.png';
      Tile.NOUGHT.onload = function() {
        Tile._ctx.drawImage(Tile.NOUGHT, 20, 20);
      };

      //CROSS
      Tile.CROSS.src = 'http://i.picresize.com/images/2017/04/12/g8RX.png';
      Tile.CROSS.onload = function() {
        Tile._ctx.drawImage(Tile.CROSS, 20, 20);
      };
      this.tile = Tile.BLANK;
    }
  }

  hasData() {
    return this.tile!==Tile.BLANK;
  }

  active() {
    return this.anim > 0;
  }

  equals(_tile) {
    return this.tile === _tile;
  }

  set(next) {
    this.tile = next;
  }

  flip(next)  {
    this.tile = next;
    this.anim = 1;
  }

  update() {
    if(this.anim > 0){
      this.anim -=0.08;
    }
  }

  draw(ctx) {
    if(this.anim<=0){
     ctx.drawImage(this.tile,this.x,this.y);
     return;
    }
    const res = 4;
    let t;

    if(this.anim > 0.5){
      t = Tile.BLANK;
    } else t = this.tile

    const p =  -Math.abs(2*this.anim-1)+1;
    for(let i=0; i<100; i+=res){

      let j = this.anim > 0.5 ? 100 - i : i;
      ctx.drawImage(t, i, 0, res, 100,
        this.x + i - p*i+50*p,
        this.y - j*p*0.2,
        res,
        100 + j*p*0.4);
    }
  }
}
