var canvas = null;
var ctx = null;
var spritesheet = null;
var spritesheetLoaded = false;
var check = document.getElementById('check');
var sel = document.getElementById('select');
var currentShelve = 'Lager';
var currentItemType = 'pos';

try{
  console.log(walls)
}catch(e){
  var walls = {}
}
// the world grid: a 2d array of tiles
var world = [[]];

// size in the world in sprite tiles
var worldWidth = 154;
var worldHeight = 35;

// size of a tile in pixels
var tileWidth = 8;
var tileHeight = 15;

// start and end of path
var pathStart = [worldWidth, worldHeight];
var pathEnd = [0, 0];
var currentPath = [];

// ensure that concole.log doesn't cause errors
if (typeof console == "undefined") var console = { log: function() {} };

function onload() {
  console.log("Page loaded.");
  canvas = document.getElementById("gridCanvas");
  canvas.width = worldWidth * tileWidth;
  canvas.height = worldHeight * tileHeight;
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
  if (!canvas) alert("Blah!");
  ctx = canvas.getContext("2d");
  spritesheet = new Image();
  spritesheet.src =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAAAgCAYAAACVf3P1AAAACXBIWXMAAAsTAAALEwEAmpwYAAAABGdBTUEAALGOfPtRkwAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAAIN0lEQVR42mJMWaLzn4FEoCrxC86+/YINRQzER2aj68GmnhDgOx6EV/6T5Tqy7S9zvsnIMAoGDAAEEGPnHrX/6IkAFDm4EgZy4kNPhMSaQUgdTAyW8Oz1pMC0sAw7irq3T36C6YOXnqEkRlLsnx19eTQBDiAACCAWWImBHFnEJD7kkgYbICbykc1Btx+U+NATnqKhBpruG2AySEYRniAPAvWBEiGx9sNzYiQj3prg//L/jLQ0b72zN171gXu3kmQ/qebZiEv9/8fwn+E/UNdfIPEXyPsHpMEYKH/53RuS7CfWPIAA7JXhCoBACIPn9Crq/d83VncghEf0O0GQ4eafD2T1qmbgjf0xVyDOAK1glSfDN+oJ361lXaDKJ7/67f2/gCMadg+s7licaCRoBlN/zLsyI7Apkw63npn2TgHEQqhahEUivioNW7uL2CoQHbxcH4GS+NCrXWRw//wNDDGQelCJCC4NgWbxoVXNhACpJR2p5hAqGUkt6Ug1B1fJyM3KyvDn3z+GTY/uUcX+nU8fYjXHWETs/z8kPkAAsWBrvBPqfOBLiKRWwej2v8SS8LCVftgSH6q6GxhVMykJcaQBHmBJ9evfP5rbAyoF//7/C+cDBBALsaUeMYmP0o4HrPTD1eZDTnTIcjDxM5svgvUiV80gOZRSEZgQxQNXkFU6D2cAShgMDPRIgKhVMEAAseArydBLNPQSktjOC6HqnRgAS2S42oIweVAie/vkIrwURU+I9gxS4KqZAWnoZhQwMPz4+weI/9J+2AWc+hBJECCAmEjtscISDjmRh6wH21giPoDe4cCWOLG1F9ETLkzNaOJDBT+B1S8oEdIaMKF1aQACiAm5tMOVQEgZiiGlR4zRo75/H2V8j1gAS5wgbOKrj7NdiJ6AR6thBPj+5w/DdzokQHQAEEAsuEo4QpGDa/CZmMRHbFsRVHrhKvVwqYVVtbiqa1zup1bvl9zeMbV6v+T2jrc/eUAX+4+8fIZiD0AAMWFLIPgSB7ocKe05UmZXYKUgKEFh6/EiJzyYPHJ1S2zCHQUDCwACiAm5x0ssIGYYBlcbD1vvF109qARDb8+hJ0JsCZNQwsOXkEfBwACAAGIhp2ok1HNGb0sit/UIlbD4hmCQq2RSSzjkxAdqa4pb4lTqAMT5QCwAxI1ArADE8UjyF4C4EMpeD8QTgfgAlL8fSh+A6k3Ao5dYUADE/kD8AaoXRPdD3QWyewNUHcgufSTzDaB4wWBOgAABxIStQ0CNXiJyQiTGrCN95gyqiop4OxrklmIk6qkH4kQgdgTiB9AIdITKOSJFcAA0QcWj6XeEJg4HPHqJBf1IehOREt9CqFg8NJExQBOpANRuBihbnqapJ9T5PxhTAAACiAk94SGXWsTOjBDSi88sZPvR538pBeilJnLb8uHG3/i0wkrAB3jU+ENLIAMkMQFowlMgoJdYADJ7AlJpBhODlbgToe6A2XcQmjFoD5ATHgWJECCAmHAlKmJLQFxjgrg6K5QAUjoX+AauCQBQyfIQiOdDqzVsAFbSfIAmhgAk8Xyo2AMqRrcBtGQ2gNqJLcNshFbH8UOpDQgQQEy4SjRsJSOpHRRizSBQGmEkKljJhq1qRRbHVW2DqnqOr2b47F0ArfJwRWYANLHthyYKf6g4KNEFIslTK/EtQCr1GJDM9oeWeg7QBLoerRqmHVi9lxErm0QAEEAs+Hqx2PjI4qTM/xIDQAtLYQsI0KtO9KEWQu07CoZh9iOxG/FUv4FIpdx5NPmJ0FKpkcIgKYSWxLBSbyNUDJbQDkDlLkAzDKwzAmufJkATJwNSW5Q2iZBMABBAjLiW5GNLgPiqVGwJlFjwcpkhvAOCvBiB2GoZW2LEVfqBFyRAV1CDesObti4aXRE9gAAggJiwtf3IGRskpB5XhwVWDSJ3QPBNxcHk8LUH8SU+WnR2RgH5ACCAmHD1VPENNhMq4YiZH8Ymhi9hQFa5/ERZ4ULFoZdRMEAAIICY8HUkiF0LiCyPa6YDVzUO6gzgG/9DBrCqGV/iQl+aRUypCm6LRDL+J7RamRoAlz2glcqE9nFQA+CyR19I5L8uENPafnR7AAKIhZg1faQuTCCmDYisBrndhy2hYBPDNcwCEsemHt18kJ2w1TejgAG8V+P///90twcggFiQOxCkdh4IdThw7R9GZr9ESmTY5oBJqWrREx6ubZywHvcoQE0Y/wbAHoAAYsG3rIrYxIUvYRKzegaUGLC1/0hdF4gr8WEzB1T6sYueGE15UIC+V4Ne9gAEEAs1Eh+uZfbEVN3iUecZbi+DClzC3ylBTkj4SjdCiQ9W+gm4so+mPHjCIG/7JaX2AAQQyathCPVwYb1pUk5XQE6EyOOB6AkG21ANriob26kJmKXfaAKEAdBe4L//mWhuD/qeEIAAYsHXeSB2TR+lnRZYIgSNCd6+j0gkyAkSX1WNXvXiSnwwM39wn2IQx1H64eoJU/tkBHy9VGzi1D4ZAR1wMbOCaUsxyf/UOBkhSEHlPzsTEwMHMwvYrC9//jB8/f0bY08IQACxkNrGo8a0G67SUd4fFAiQhMjP9Q+aaJD0ETFcg574kHu6oIQHAjCzRwECcLKwgA7SACaPvwx/gAnmDzCIfv8DHa4BzExk9I4hpyEwMbAwARPcPyac1TtAAOGdikOuUolJfLgSFq5pPWLamXtmMsITzM/XFvCEiH56AmyKDX1oBZToQPo/fkNULy7p/+H2jx5ONLAAIIBwno6Fq0rGt3EJ37Fo6ImZmKofmzgoQYIGr3EBUNsOObHBEq9pLCNW+0ePZxtYABBgAEdytom0/RTgAAAAAElFTkSuQmCC";
  spritesheet.onload = loaded;
}

// the spritesheet is ready
function loaded() {
  console.log("Spritesheet loaded.");
  spritesheetLoaded = true;
  createWorld();
}

// fill the world with walls
function createWorld() {
  console.log("Creating world...");

  // create emptiness
  for (var x = 0; x < worldWidth; x++) {
    world[x] = [];

    for (var y = 0; y < worldHeight; y++) {
      world[x][y] = 0;
    }
  }
  currentPath = [];
  redraw();
}

// Draw all inital Squares
function redraw() {
  if (!spritesheetLoaded) return;

  console.log("redrawing...");

  var spriteNum = 0;

  // clear the screen
  ctx.fillStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#000000";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Draw the walls and Empty squares
  let color = "#000000";
  for (var x = 0; x < worldWidth; x++) {
    for (var y = 0; y < worldHeight; y++) {
      ctx.strokeRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);

      // choose a sprite to draw
      switch (world[x][y]) {
        case 1:
          spriteNum = 1;
          color = "#000000";
          break;
        default:
          spriteNum = 0;
          color = "#FFFFFF";
          break;
      }

      // // Draw all walls
      // // Object.keys(data).map(key=>{
      // // })
      // // for(var i=0; i<data['Garten']['pos'].length; i++){
      //   // data['Unknown']['pos'][0][0] = data['Unknown']['pos'][0][0] +1
      // // }
      // // setTimeout(()=>{
      //   walls = data;
      // //   Object.keys(walls).map(key=>{
      //     drawingShelves(walls['Unknown'], walls['Unknown']['col'])
      // //   })
      // // },10000)
      // if (spriteNum) {
      //   ctx.fillStyle = color;
      //   ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
      // }
    }
  }

  // Draw all walls

  Object.keys(walls).map(key=>{
    drawingShelves(walls[key], walls[key]['col'])
  })
  // draw the path
  // var current;
  // var past, first;
  // for (rp = 0; rp < currentPath.length - 1; rp++) {
  //   switch (rp) {
  //     case 0:
  //       last = [
  //         (currentPath[rp][0] + currentPath[rp + 1][0]) / 2 + 0.5,
  //         (currentPath[rp][1] + currentPath[rp + 1][1]) / 2 + 0.5
  //       ];
  //       current = last;
  //       break;
  //     case currentPath.length - 1:
  //       // last = current
  //       // current = [currentPath[rp][0]+0.5, currentPath[rp][1]+0.5]
  //       break;
  //     default:
  //       last = current;
  //       current = [
  //         (currentPath[rp][0] + currentPath[rp + 1][0]) / 2 + 0.5,
  //         (currentPath[rp][1] + currentPath[rp + 1][1]) / 2 + 0.5
  //       ];
  //       break;
  //   }

  //   ctx.beginPath();
  //   ctx.moveTo(last[0] * tileWidth, last[1] * tileHeight);
  //   ctx.lineTo(current[0] * tileWidth, current[1] * tileHeight);
  //   ctx.lineWidth = 5;
  //   ctx.strokeStyle = "#ff0000";
  //   ctx.stroke();
  // }
}


// MAIN ACTION

// walls[currentShelve] = {}
// walls[currentShelve][currentItemType] = []
var stringWalls =''

function handleClick(e) {
  var color;
  if (document.mouseState) {

    var x;
    var y;

    // grab html page coords
    if (e.pageX != undefined && e.pageY != undefined) {
      x = e.pageX;
      y = e.pageY;
    } else {
      x =
        e.clientX +
        document.body.scrollLeft +
        document.documentElement.scrollLeft;
      y =
        e.clientY +
        document.body.scrollTop +
        document.documentElement.scrollTop;
    }

    // make them relative to the canvas only
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    // return tile x,y that we clicked
    var cell = [Math.floor(x / tileWidth), Math.floor(y / tileHeight)];

    // now we know while tile we clicked
    drawingShelves(walls[currentShelve], '#ffffff')
    if (check.checked) {
      if(stringWalls.includes(`${JSON.stringify(cell)}`)) {
        stringWalls = stringWalls.replace(`${JSON.stringify(cell)},`, '');
        walls[currentShelve][currentItemType] = JSON.parse(stringWalls);
      }
    } else {
      if(!stringWalls.includes(JSON.stringify(cell))) {
        try {
          walls[currentShelve][currentItemType].push(cell);
        }catch(e) {
          walls[currentShelve][currentItemType] = []
          walls[currentShelve][currentItemType].push(cell);
        }
        stringWalls = JSON.stringify(walls[currentShelve][currentItemType]);
      }
    }
    drawingShelves(walls[currentShelve], walls[currentShelve]['col']);

    console.log(`Analysis => Salve = ${currentShelve}, Length = ${walls[currentShelve]['pos'].length}, Point = ${cell}`);
  }
}

function drawingShelves (shelve, color) {
  console.log(shelve)

  ctx.fillStyle = color || '#000000';
  for(var i = 0; i<shelve['pos'].length; i++) {
    ctx.fillRect(
      shelve['pos'][i][0] * tileWidth,
      shelve['pos'][i][1] * tileHeight,
      tileWidth,
      tileHeight
    );

    // Drawing the grid in the removed square
    if(color === '#ffffff') {
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(shelve['pos'][i][0] * tileWidth, shelve['pos'][i][1] * tileHeight, tileWidth, tileHeight);
      ctx.stroke();
    }
  }
  result();
}

function result() {
  var result = document.getElementById('status')
  result.innerText = `Selve => ${currentShelve}, Color = ${walls[currentShelve]['col'] || '#000000'}, ItemType => ${currentItemType} ${walls[currentShelve]['end']}`;
}

function download() {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(walls));
  element.setAttribute('download', 'walls.js');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function colorCheck() {
  const color = document.getElementById('colorTxt').value
  walls[currentShelve]['col'] = color || '#000000';
  drawingShelves(walls[currentShelve]);
  result();
}

$(document).ready(function(){
  $('#category').on('change', function () {
    currentShelve = this.selectedOptions[0].value;
    if(walls[currentShelve]) {
    } else {
      walls[currentShelve] = {}
      walls[currentShelve]['pos'] = []
    }
    console.log(walls)
    console.log(`Currently Salve is ${currentShelve}`)
    // download(`BuildMap_${Date.now()}.js`, JSON.stringify(walls));
    
  });
  $('#itemType').on('change', function () {
    currentItemType = this.selectedOptions[0].value;
    walls[currentShelve][currentItemType] = [];
  });
});


onload();