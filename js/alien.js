'use strict'

const ALIEN_SPEED = 500
var gIntervalAliens

var gAliensTopRowIdx = 1
var gAliensBottomRowIdx = 3
var gAliensLeftColIdx = 4
var gAliensRightColIdx = 12
var gIsAlienFreeze
var gIsAlienDirection = false

var gAliens
var gSpaceships = []
var gIsShield = false

var gIntervalAliensShoot
var gIntervalAliensShooter
var gAliensShoots = []
var gIsAliensShoot = false

//----create Alien------
function createAlien(board, idxI, idxJ) {
  var alien = {
    location: {
      i: 1 + idxI,
      j: 4 + idxJ,
    },
    currCellContent: SKY,
    score: 40 - 10 * idxI,
    img: getAlienImg(idxI + 1),
  }

  gAliens.push(alien)
  board[alien.location.i][alien.location.j] = createCell(alien.img)
  gGame.aliensCount++
}

function createAliens(board) {
  gAliens = []
  for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
    for (var j = 0; j < ALIENS_ROW_LENGTH; j++) {
      createAlien(board, i, j)
    }
  }
  return
}

//-------move alien-------
function moveAliens() {
  if (gIsAlienFreeze) return
  if (gAliensBottomRowIdx === BOARD_SIZE - 2) {
    gameOver()
  }

  if (gIsAlienDirection && gAliensRightColIdx < BOARD_SIZE) {
    toRightAliens()
    gAliensRightColIdx++
    gAliensLeftColIdx++
    return
  } else if (!gIsAlienDirection && gAliensLeftColIdx > 0) {
    toLeftAliens()
    gAliensRightColIdx--
    gAliensLeftColIdx--
    return
  } else {
    gIsAlienDirection = !gIsAlienDirection
    gAliensTopRowIdx++
    gAliensBottomRowIdx++
    toDownAliens()
    return
  }
}
function toLeftAliens() {
  for (var i = 0; i < gAliens.length; i++) {
    const alien = gAliens[i]
    var nextPos = {
      i: alien.location.i,
      j: alien.location.j - 1,
    }
    updateAlienCell(alien, nextPos, alien.img)
  }
}
function toRightAliens() {
  for (var i = gAliens.length - 1; i >= 0; i--) {
    const alien = gAliens[i]
    var nextPos = {
      i: alien.location.i,
      j: alien.location.j + 1,
    }
    updateAlienCell(alien, nextPos, alien.img)
  }
}
function toDownAliens() {
  for (var i = gAliens.length - 1; i >= 0; i--) {
    const alien = gAliens[i]
    var nextPos = {
      i: alien.location.i + 1,
      j: alien.location.j,
    }
    updateAlienCell(alien, nextPos, alien.img)
  }
}

function updateAlienCell(alien, nextPos, value) {
  updateCell(alien.location, SKY)
  alien.location = nextPos
  updateCell(alien.location, alien.img)
  // moving from current position:
  //  update the model
  // gBoard[alien.location.i][alien.location.j] = SKY
  // //  update the DOM
  // renderCell(alien.location, SKY)

  // //  Move the alien to new location
  // //  update the model
  // alien.location = nextPos // {i:2 ,j:3}
  // gBoard[alien.location.i][alien.location.j] = alien.img
  // //  update the DOM
  // renderCell(alien.location, value)
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

//---Spaceship--------
function createSpaceship() {
  const randCol = getRandomInt(0, BOARD_SIZE)

  if (gBoard[0][randCol].gameObject)
    gSpaceships.push({
      pos: { i: 0, j: randCol },
      sign: SPACESHIP,
      score: 50,
    })
}
function removeSpaceships(location) {
  updateCell(location, SKY)
  // gBoard[location.i][location.j] = SKY
  // renderCell(location, SKY)
}
function setAliensFreeze() {
  gIsAlienFreeze = true

  setTimeout(() => (gIsAlienFreeze = false), 5000)
}
function getAlienImg(rowIdx) {
  var alien = ALIEN1
  switch (rowIdx) {
    case 2:
      alien = ALIEN2
      break
    case 3:
      alien = ALIEN3
      break
    case 4:
      alien = ALIEN4
      break
  }
  return alien
}

//------Aliens Shoot-----

function selectAliensShoot() {
  const randCol = getRandomInt(0, gAliens.length)
  const alien = gAliens[randCol]
  const location = { i: alien.location.i, j: alien.location.j }
  // console.log('location:', location)
  location.i++
  // console.log('location:', location)
  var cell = gBoard[location.i][location.j]
  // console.log('cell:', cell)
  while (location.i < BOARD_SIZE && cell.gameObject !== SKY) {
    location.i++
    var cell = gBoard[location.i][location.j]
  }
  if (cell.gameObject === SKY) return location
  else {
    return null
  }
}

function aliensShoot() {
  // debugger
  var location = getLocation()
  // if (gAliensShoots.length === 1) {
  //   updateCell(location, SKY)
  // }
  if (location.i === BOARD_SIZE - 1) {
    endAliensShoot()
    return
  }

  var nextCell = gBoard[location.i + 1][location.j].gameObject

  if (nextCell === WALL1 || nextCell === WALL2) {
    endAliensShoot()
    removeLivesWall({ i: location.i + 1, j: location.j })
    updateWalls()
    return
  }
  if (nextCell === HERO) {
    if (!gIsShield) {
      updateLives()
    } else {
      updateShields()
    }
    endAliensShoot()
    return
  }

  updateCell(location, SKY)
  console.log('location:', location)
  location.i++
  console.log('location:', location)
  updateCell(location, ALIEN_SHOOT)

  gAliensShoots.push({ i: location.i, j: location.j })
  console.log('gAliensShoots:', gAliensShoots)
}

function playAliensShoot() {
  gIntervalAliensShoot = setInterval(aliensShoot, 280)
}

function endAliensShoot() {
  clearInterval(gIntervalAliensShoot)
  gIsAliensShoot = false
  updateCell(gAliensShoots[gAliensShoots.length - 1], SKY)
  gAliensShoots = []
}
function getLocation() {
  var location
  if (gIsAliensShoot) {
    var pos = gAliensShoots[gAliensShoots.length - 1]
    location = { i: pos.i, j: pos.j }
    console.log('location:', location)
  } else {
    location = selectAliensShoot()
    // gAliensShoots = []
    console.log('location:', location)
    if (!location) {
      return
    }
    console.log('location:', location)
    // gAliensShoots = []
    gAliensShoots.push(location)
    console.log('hhhhhhhh')
    gIsAliensShoot = true
  }
  return location
}
