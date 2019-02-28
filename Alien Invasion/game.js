var canvas = document.getElementById('game');

var ctx = canvas.getContext('2d');
startGame();

//  开始游戏
function startGame() {
  ctx.fillStyle = '#ffff00';
  ctx.fillRect(50, 100, 380, 400);

  //  填充一个蓝色的半透明区块
  ctx.fillStyle = 'rgba(0,0,128,.8)';
  ctx.fillRect(25, 50, 380, 400);

  SpriteSheet.load(
    {
      ship: {
        sx: 0,
        sy: 0,
        w: 37,
        h: 42,
        frame: 1,
      },
    },
    function() {
      SpriteSheet.draw(ctx, 'ship', 0, 0);
      SpriteSheet.draw(ctx, 'ship', 100, 50);
      SpriteSheet.draw(ctx, 'ship', 150, 100, 1);
    },
  );
}
