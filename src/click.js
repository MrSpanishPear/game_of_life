let Grid = document.getElementById('Grid');
let gridEntry = document.getElementsByClassName('box');
Grid.onmousedown = enableToggle;
var isToggling = false;

function enableToggle(e) {
  console.log('enableToggle')
  isToggling = true;

  if (e.target !== Grid) {
    toggle(e);
  }
}

function disableToggle() {
  console.log('disableToggle')
  isToggling = false;
}

function toggle(e) {
  if (isToggling === false) {
    return;
  }

  console.log('toggle:', e.target);

  if(e.target.classList.contains('on')){

  }
}

function startGame() {
  table.onmousedown = enableToggle;

  for (var i = 0, il = gridEntry.length; i < il; i++) {
    gridEntry[i].onmouseenter = toggle; //changes color 
  }

  table.onmouseup = disableToggle;
}

startGame();