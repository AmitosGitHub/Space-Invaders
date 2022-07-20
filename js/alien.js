'use strict'

const ALIEN_SPEED = 800
var gIntervalAliens

var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = 2
var gIsAlienFreeze
var gIsAlienDirection = false

const gAliens = []

function createAlien(board, idxI, idxJ) {
  var alien = {
    location: {
      i: idxI,
      j: 4 + idxJ,
    },
    currCellContent: SKY,
  }

  gAliens.push(alien)
  board[alien.location.i][alien.location.j] = ALIEN
}

function createAliens(board) {
  for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
    for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
      createAlien(board, i, j)
      gGame.aliensCount++
    }
  }
  console.log('gGame.aliensCount:', gGame.aliensCount)
  return
}

function moveAliens() {
  if (gIsAlienFreeze) return

  const firstAlien = gAliens[0]
  const lastAlien = gAliens[gAliens.length - 1]

  if (gIsAlienDirection && lastAlien.location.j < BOARD_SIZE - 1) {
    toRightAliens()
    return
  }
  if (!gIsAlienDirection && firstAlien.location.j > 0) {
    toLeftAliens()
    return
  } else {
    //model
    gIsAlienDirection = !gIsAlienDirection
    gAliensTopRowIdx++
    gAliensBottomRowIdx++

    toDownAliens()
    return
  }
}

function toLeftAliens() {
  var step = 1

  for (var i = 0; i < gAliens.length; i++) {
    const alien = gAliens[i]
    const nextPos = {
      i: alien.location.i,
      j: alien.location.j - step,
    }
    updateAlienCell(alien, nextPos, ALIEN)
  }
}
function toRightAliens() {
  var step = 1

  for (var i = gAliens.length - 1; i >= 0; i--) {
    const alien = gAliens[i]
    const nextPos = {
      i: alien.location.i,
      j: alien.location.j + step,
    }
    updateAlienCell(alien, nextPos, ALIEN)
  }
}
function toDownAliens() {
  var step = 1

  for (var i = gAliens.length - 1; i >= 0; i--) {
    const alien = gAliens[i]
    const nextPos = {
      i: alien.location.i + step,
      j: alien.location.j,
    }
    updateAlienCell(alien, nextPos, ALIEN)
  }
}

function updateAlienCell(alien, nextPos, value) {
  // moving from current position:
  //  update the model
  gBoard[alien.location.i][alien.location.j] = SKY
  //  update the DOM
  renderCell(alien.location, SKY)

  //  Move the alien to new location
  //  update the model
  alien.location = nextPos // {i:2 ,j:3}
  gBoard[alien.location.i][alien.location.j] = ALIEN
  //  update the DOM
  renderCell(alien.location, value)
}

function removeAlien(pos) {
  for (var i = 0; i < gAliens.length; i++) {
    const alien = gAliens[i]

    if (alien.location.i === pos.i && alien.location.j === pos.j) {
      gAliens.splice(i, 1)
      return
    }
  }
}
