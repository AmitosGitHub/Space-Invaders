'use strict'

const LASER_SPEED = 80
var gHero
var gLaser = {
  pos: {
    i: 1,
    j: 1,
  },
  regular: {
    sign: 'LASER',
    speed: 80,
  },
  super: {
    sign: 'SUPER_LASER',
    speed: 50,
    count: 3,
  },
}
var gIntervalShoot

function createHero(board) {
  gHero = {
    pos: {
      i: 12,
      j: 5,
    },
    isShoot: false,
    lives: 3,
    laser: 'regular',
    shields: 3,
  }

  board[gHero.pos.i][gHero.pos.j] = createCell(HERO)
}

function moveHero(step) {
  if (!gGame.isOn) return

  const nextLocation = getNextLocation(step)
  //return if cannot move
  if (!isValid(nextLocation)) return

  var nextCell = gBoard[nextLocation.i][nextLocation.j].gameObject

  // return if cannot move
  if (nextCell === WALL1 || nextCell === WALL2) return

  //  hitting a alian?  call gameOver
  if (
    nextCell === ALIEN1 ||
    nextCell === ALIEN2 ||
    nextCell === ALIEN3 ||
    nextCell === ALIEN4
  ) {
    gameOver()
    return
  }

  updateCell(gHero.pos, SKY)
  gHero.pos = nextLocation
  updateCell(gHero.pos, HERO)
}

function getNextLocation(eventKeyboard) {
  const nextLocation = {
    i: gHero.pos.i,
    j: gHero.pos.j,
  }

  switch (eventKeyboard) {
    case 'ArrowUp':
      nextLocation.i--
      break
    case 'ArrowRight':
      nextLocation.j++
      break
    case 'ArrowDown':
      nextLocation.i++
      break
    case 'ArrowLeft':
      nextLocation.j--
      break

    default:
      break
  }
  return nextLocation
}

function blinkLaser() {
  const location = {
    i: gLaser.pos.i,
    j: gLaser.pos.j,
  }

  if (location.i === 0) {
    endBlinkLeaser()
    return
  }

  var cell = gBoard[location.i][location.j].gameObject
  var nextCell = gBoard[location.i - 1][location.j].gameObject

  if (nextCell === SPACESHIP) {
    setAliensFreeze()
    clearTimeout(gSetTimeId)
    setScore(50)
    const spaceship = gSpaceships.splice(0, 1)[0]
    removeSpaceships({ i: spaceship.pos.i, j: spaceship.pos.j })
    endBlinkLeaser()

    return
  }
  if (cell === WALL1 || cell === WALL2) {
    endBlinkLeaser()
    return
  }

  if (
    nextCell === ALIEN1 ||
    nextCell === ALIEN2 ||
    nextCell === ALIEN3 ||
    nextCell === ALIEN4
  ) {
    var alien = getAlien({
      i: location.i - 1,
      j: location.j,
    })
    setScore(alien.score)
    endBlinkLeaser()
    killAlien(1)
    return
  }
  updateCell(gLaser.pos, SKY)

  //  Move the laser to new location
  gLaser.pos.i = location.i - 1
  gLaser.pos.j = location.j

  const laser = gHero.laser === 'super' ? SUPER_LASER : LASER
  updateCell(gLaser.pos, laser)
}

function shoot(sign) {
  if (gHero.isShoot) return
  gHero.isShoot = true

  const location = {
    i: gHero.pos.i - 1,
    j: gHero.pos.j,
  }

  gLaser.pos.i = location.i
  gLaser.pos.j = location.j

  const speed =
    sign === gLaser.regular.sign ? gLaser.regular.speed : gLaser.super.speed
  var laser = LASER
  if (gLaser.super.count === 0 || sign === gLaser.regular.sign) {
    gHero.laser = 'regular'
  } else {
    gHero.laser = 'super'
    laser = SUPER_LASER
  }
  updateCell(location, laser)

  gIntervalShoot = setInterval(blinkLaser, speed)
  playSound()
}

function endBlinkLeaser() {
  clearInterval(gIntervalShoot)
  gHero.isShoot = false
  updateCell(gLaser.pos, SKY)
}

function killAlien(num) {
  if (num === 1) {
    gLaser.pos.i -= 1

    removeAlien(gLaser.pos)
    updateCell(gLaser.pos, SKY)
  } else if (num === 2) {
    killAroundAlien(gLaser.pos)
  }

  if (checkGameOver()) {
    gameOver()
  }
}

function BlowUpNeighbors() {
  clearInterval(gIntervalShoot)
  gHero.isShoot = false

  updateCell(gLaser.pos, BOOM)

  killAlien(2)

  setTimeout(() => {
    updateCell(gLaser.pos, SKY)
  }, 300)
}

function killAroundAlien(pos) {
  gIsAlienFreeze = true

  for (var i = pos.i - 1; i <= pos.i + 1; i++) {
    if (i < 0 || i > BOARD_SIZE - 1) continue
    for (var j = pos.j - 1; j <= pos.j + 1; j++) {
      if (j < 0 || j > BOARD_SIZE - 1) continue
      if (i === pos.i && pos.j === j) continue

      const cell = gBoard[i][j].gameObject

      if (
        cell === ALIEN1 ||
        cell === ALIEN2 ||
        cell === ALIEN3 ||
        cell === ALIEN4
      ) {
        var location = { i: i, j: j }
        const alien = getAlien(location)
        //model
        setScore(alien.score)
        removeAlien(location)
        updateCell(location, SKY)
      }
    }
  }
  gIsAlienFreeze = false
  checkGameOver()
}

function updateCell(location, element) {
  gBoard[location.i][location.j] = createCell(element)
  renderCell(location, element)
}

function updateSuperLaser() {
  if (gLaser.super.count === 0) return
  gLaser.super.count--
  var srtHTML = ''
  for (var i = 0; i < gLaser.super.count; i++) {
    srtHTML += SUPER_LASER
  }
  const elSuper = document.querySelector('.main-btn-game .super-laser span')
  elSuper.innerText = srtHTML
}

function updateLives() {
  if (gHero.lives === 1) {
    gHero.lives--
    gameOver()
  }
  gHero.lives--

  var srtHTML = ''
  for (var i = 0; i < gHero.lives; i++) {
    srtHTML += LIVES
  }
  const elSuper = document.querySelector('.main-btn-game .lives span')
  elSuper.innerText = srtHTML
}
function updateShields() {
  // if (gHero.shields === 0) return

  var srtHTML = ''
  for (var i = 0; i < gHero.shields; i++) {
    srtHTML += Shields
  }
  const elShields = document.querySelector('.main-btn-game .shields span')
  elShields.innerText = srtHTML
}
