export default class Tile {
  static canvas = document.createElement('canvas');
  static context = Tile.canvas.getContext("2d");
  static BLANK = new Image();
  static NOUGHT = new Image(20, 20);
  static CROSS = new Image();

  constructor(public x: number, public y: number, public animation: number = 0, public tile = Tile.BLANK ) {
    this.x = x;
    this.y = y;
  }

  init() {
    Tile.canvas.width = Tile.canvas.height = 100;
    Tile.context.fillStyle = 'skyblue';
    Tile.context.lineWidth = 4;
    Tile.context.strokeStyle = 'white';

    //BLANK
    Tile.context.fillRect(0,0,100,100);
    Tile.BLANK.crossOrigin = "Anonymous";
    Tile.BLANK.src = Tile.canvas.toDataURL();

    //KAPPA
    Tile.NOUGHT.src = 'http://i.picresize.com/images/2017/04/12/TqxYX.png';
    Tile.NOUGHT.onload = function() {
      Tile.context.drawImage(Tile.NOUGHT, 20, 20);
    };

    //CROSS
    Tile.CROSS.src = 'http://i.picresize.com/images/2017/04/12/g8RX.png';
    Tile.CROSS.onload = function() {
      Tile.context.drawImage(Tile.CROSS, 20, 20);
    };
  }

  hasData() {
    return this.tile!==Tile.BLANK;
  }

  isActive() {
    return this.animation > 0;
  }

  equals(_tile) {
    return this.tile === _tile;
  }

  setNextTile(next) {
    this.tile = next;
  }

  flip(next)  {
    this.tile = next;
    this.animation = 1;
  }

  update() {
    if(this.animation > 0){
      this.animation -= 0.08;
    }
  }

  draw(context) {
    if(this.animation <= 0){
     context.drawImage(this.tile,this.x,this.y);
     return;
    }

    let animatedTile;

    if(this.animation > 0.5){
      animatedTile = Tile.BLANK;
    } else animatedTile = this.tile;

    // a math function to emulate the animation of fliping from one side to the other
    // first shrinks the image based on this.animation then expands it again
    const absouluteGraph = -Math.abs(2 * this.animation - 1) + 1;
    const canvasWidth = Tile.canvas.width;
    const resolution = 4;

    for(let i = 0; i<canvasWidth; i+=resolution){
      // variable to indicate which side to flip the tile based on the animation(start or end)
      let flipCheck = this.animation > 0.5 ? canvasWidth - i : i;
      context.drawImage(animatedTile, i, 0, resolution, canvasWidth,
        this.x + i - absouluteGraph * i + canvasWidth /2 * absouluteGraph,
        this.y - flipCheck * absouluteGraph * 0.2,
        resolution,
        100 + flipCheck * absouluteGraph * 0.4);
    }
  }
}
