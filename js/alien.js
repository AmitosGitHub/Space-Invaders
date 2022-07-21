'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens

var gAliensTopRowIdx = 1
var gAliensBottomRowIdx = 3
var gAliensLeftColIdx = 4
var gAliensRightColIdx = 12
var gIsAlienFreeze
var gIsAlienDirection = false

var gAliens = []
var gSpaceships = []

function createAlien(board, idxI, idxJ) {
  var alien = {
    location: {
      i: 1 + idxI,
      j: 4 + idxJ,
    },
    currCellContent: SKY,
    score: 30 - 10 * idxI,
  }

  gAliens.push(alien)
  board[alien.location.i][alien.location.j] = ALIEN
  gGame.aliensCount++
}

function createAliens(board) {
  for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
    for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
      createAlien(board, i, j)
    }
  }
  return
}

function moveAliens() {
  if (gIsAlienFreeze) return
  if (gAliensBottomRowIdx === BOARD_SIZE - 2) {
    gameOver()
  }

  const firstAlien = gAliens[0]
  const lastAlien = gAliens[gAliens.length - 1]

  if (gIsAlienDirection && gAliensRightColIdx < BOARD_SIZE) {
    toRightAliens()
    gAliensRightColIdx++
    gAliensLeftColIdx++
    return
  }
  if (!gIsAlienDirection && gAliensLeftColIdx > 0) {
    toLeftAliens()
    gAliensRightColIdx--
    gAliensLeftColIdx--
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
      gGame.aliensCount--
      return
    }
  }
}

function getAlien(pos) {
  for (var i = 0; i < gAliens.length; i++) {
    const alien = gAliens[i]

    if (alien.location.i === pos.i && alien.location.j === pos.j) {
      return gAliens[i]
    }
  }
}
function createSpaceship() {
  const randCol = getRandomInt(0, BOARD_SIZE)
  const location = { i: 0, j: randCol }

  gSpaceships.push({
    pos: { i: location.i, j: location.j },
    sign: SPACESHIP,
    score: 50,
  })
}

function removeSpaceships(location) {
  gBoard[location.i][location.j] = SKY
  renderCell(location, SKY)
}

function setAliensFreeze() {
  gIsAlienFreeze = true

  setTimeout(() => (gIsAlienFreeze = false), 5000)
}
