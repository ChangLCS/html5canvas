//  初始化游戏对象 Game
var Game = new function() {
  this.initialize = function(canvasElementId, sprite_data, callback) {
    this.canvas = document.getElementById(canvasElementId);
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    //  初始化canvas对象的ctx
    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');

    //  配置键盘监听
    this.setupInput();

    //  开始游戏的循环
    this.loop();

    //  加入图片资源
    SpriteSheet.load(sprite_data, callback);
  };

  //  需要监听的键盘输入
  var KEY_CODES = {
    37: 'left',
    39: 'right',
    32: 'fire',
  };
  this.keys = {};
  this.setupInput = function() {
    //  按下键盘的时候
    window.addEventListener('keydown', function(e) {
      if (KEY_CODES[e.keyCode]) {
        Game.keys[KEY_CODES[e.keyCode]] = true;
        e.preventDefault();
      }
    });
    //  放开键盘的时候
    window.addEventListener('keyup', function(e) {
      if (KEY_CODES[e.keyCode]) {
        Game.keys[KEY_CODES[e.keyCode]] = false;
        e.preventDefault();
      }
    });
  };

  //  游戏的循环事件
  var boards = [];
  this.loop = function() {
    var dt = 30 / 1000;
    for (let i = 0; i < boards.length; i += 1) {
      const item = boards[i];
      if (item) {
        item.step(dt);
        item && item.draw(Game.ctx);
      }
    }
    setTimeout(Game.loop, 30);
  };

  //  修改当前激活的绘制板
  this.setBoard = function(num, board) {
    boards[num] = board;
  };
}();

//  精灵图加载对象
var SpriteSheet = new function() {
  this.map = {};
  this.load = function(spriteData, callback) {
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'images/sprites.png';
  };
  this.draw = function(ctx, sprite, x, y, frame) {
    var s = this.map[sprite];
    if (!frame) {
      frame = 0;
    }
    ctx.drawImage(this.image, s.sx + frame * s.w, s.sy, s.w, s.h, x, y, s.w, s.h);
  };
}();
