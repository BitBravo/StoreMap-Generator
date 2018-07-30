window.onload = function() {
  document.mouseState = false;
  var walls = Array();
  var closedNode = Array();
  var openNode = Array();
  walls = [[1, 2], [1, 3], [1, 4], [1, 5]];
  var canvas = document.getElementById("canvas"),
    c = canvas.getContext("2d"),
    boxSize = 40,
    boxes = Math.floor(600 / boxSize);

  canvas.onmousedown = function(e) {
    document.mouseState = true;
  };
  canvas.onmouseup = function(e) {
    document.mouseState = false;
  };
  canvas.onmouseleave = function(e) {
    document.mouseState = false;
  };
  canvas.addEventListener("mousemove", handleClick);

  function drawBox() {
    c.beginPath();
    c.fillStyle = "white";
    c.lineWidth = 0.5;
    c.strokeStyle = "graw";
    for (var row = 0; row < boxes; row++) {
      for (var column = 0; column < boxes; column++) {
        var x = column * boxSize;
        var y = row * boxSize;
        c.rect(x, y, boxSize, boxSize);
        c.fill();
        c.stroke();
      }
    }
    c.closePath();
  }

  function handleClick(e) {
    if (document.mouseState) {
      setTimeout(() => {
        var x = Math.floor(e.offsetX / boxSize);
        var y = Math.floor(e.offsetY / boxSize);

        // walls.push([x, y]);
        const flag = walls.findIndex(wall => wall[0] === x && wall[1] === y);
        if (flag > -1) {
          walls.splice(flag, 1);
        }
        console.log(flag, walls);
        c.fillStyle = "black";
        c.fillRect(
          Math.floor(e.offsetX / boxSize) * boxSize,
          Math.floor(e.offsetY / boxSize) * boxSize,
          boxSize,
          boxSize
        );
      }, 400);

      // if(flag) {

      // } else{
      // }
      // c.fillStyle = "black";
      // c.fillRect(
      //   Math.floor(e.offsetX / boxSize) * boxSize,
      //   Math.floor(e.offsetY / boxSize) * boxSize,
      //   boxSize,
      //   boxSize
      // );
    }
  }

  drawBox();
};
