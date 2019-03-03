// var canvas = document.getElementById('game');

// var ctx = canvas.getContext('2d');
// startGame();

// //  开始游戏
// function startGame() {
//   ctx.fillStyle = '#ffff00';
//   ctx.fillRect(50, 100, 380, 400);

//   //  填充一个蓝色的半透明区块
//   ctx.fillStyle = 'rgba(0,0,128,.8)';
//   ctx.fillRect(25, 50, 380, 400);

//   SpriteSheet.load(
//     {
//       ship: {
//         sx: 0,
//         sy: 0,
//         w: 37,
//         h: 42,
//         frame: 1,
//       },
//     },
//     function() {
//       SpriteSheet.draw(ctx, 'ship', 0, 0);
//       SpriteSheet.draw(ctx, 'ship', 100, 50);
//       SpriteSheet.draw(ctx, 'ship', 150, 100, 1);
//     },
//   );
// }

var sprites = {
  ship: { sx: 0, sy: 0, w: 39, h: 42, frames: 1 },
};

var startGame = function() {
  // SpriteSheet.draw(Game.ctx, 'ship', 100, 100, 1);
  Game.setBoard(0, new Starfield(20, 0.4, 100, true));
  Game.setBoard(1, new Starfield(50, 0.6, 100));
  Game.setBoard(2, new Starfield(100, 1, 50));
  Game.setBoard(3, new TitleScreen('Alien Invasion', 'Press space to start playing', playGame));
};

var playGame = function() {
  Game.setBoard(3, new PlayerShip());
};

window.addEventListener('load', function() {
  Game.initialize('game', sprites, startGame);
});

//  星空背景
var Starfield = function(speed, opacity, numStarts, clear) {
  //  初始化背景的canvas
  var stars = document.createElement('canvas');
  stars.width = Game.width;
  stars.height = Game.height;

  var starCtx = stars.getContext('2d');
  var offset = 0;

  //  clear 如果存在，则背景是黑色的，而不是透明了
  if (clear) {
    starCtx.fillStyle = '#000';
    starCtx.fillRect(0, 0, stars.width, stars.height);
  }

  //  画两个像素的白色，当作星星
  starCtx.fillStyle = '#fff';
  starCtx.globalAlpha = opacity;
  for (let i = 0; i < numStarts; i += 1) {
    starCtx.fillRect(
      Math.floor(Math.random() * stars.width),
      Math.floor(Math.random() * stars.height),
      2,
      2,
    );
  }

  this.draw = function(ctx) {
    var intOffset = Math.floor(offset);
    var remaining = stars.height - intOffset;
    // console.log('intOffset', intOffset, 'remaining', remaining);

    //  这两段画画只是为了滚动效果，使得一出来就有星星能画
    //  这个画星空的下半部分
    if (intOffset > 0) {
      ctx.drawImage(stars, 0, remaining, stars.width, intOffset, 0, 0, stars.width, intOffset);
    }
    //  这个画星空的上半部分
    if (remaining > 0) {
      ctx.drawImage(stars, 0, 0, stars.width, remaining, 0, intOffset, stars.width, remaining);
    }
  };

  this.step = function(dt) {
    offset += dt * speed;
    offset = offset % stars.height;
  };
};

//  标题
var TitleScreen = function(title, subtitle, callback) {
  this.step = function(dt) {
    if (Game.keys['fire'] && callback) callback();
  };

  this.draw = function(ctx) {
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    //  大标题
    ctx.font = 'bold 40px bangers';
    ctx.fillText(title, Game.width / 2, Game.height / 2);
    //  副标题
    ctx.font = 'bold 20px bangers';
    ctx.fillText(subtitle, Game.width / 2, Game.height / 2 + 40);
  };
};

//  玩家飞船
var PlayerShip = function() {
  this.w = SpriteSheet.map.ship.w;
  this.h = SpriteSheet.map.ship.h;
  this.x = Game.width / 2 - this.w / 2;
  this.y = Game.height - 10 - this.h;
  this.vx = 0;

  this.step = function(dt) {
    //  玩家的控制
    this.maxVel = 200;
    this.step = function(dt) {
      if (Game.keys['left']) {
        this.vx = -this.maxVel;
      } else if (Game.keys['right']) {
        this.vx = this.maxVel;
      } else {
        this.vx = 0;
      }

      this.x += this.vx * dt;

      //  防止飞船超出canvas边界
      if (this.x < 0) {
        this.x = 0;
      } else if (this.x > Game.width - this.w) {
        this.x = Game.width - this.w;
      }
    };
  };

  this.draw = function(ctx) {
    SpriteSheet.draw(ctx, 'ship', this.x, this.y, 1);
  };
};
