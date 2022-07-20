'use strict'

const LASER_SPEED = 80
var gHero
var gLeaser = {
  pos: {
    i: 1,
    j: 1,
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
    life: 1,
  }

  board[gHero.pos.i][gHero.pos.j] = HERO
}

function moveHero(step) {
  if (!gGame.isOn) return

  const nextLocation = getNextLocation(step)
  //return if cannot move
  if (!isValid(nextLocation)) return

  var nextCell = gBoard[nextLocation.i][nextLocation.j]

  // return if cannot move
  if (nextCell === WALL) return

  //  hitting a alian?  call gameOver
  if (nextCell === ALIEN) {
    // gameOver()
    return
  }

  // moving from current position:
  //  update the model
  gBoard[gHero.pos.i][gHero.pos.j] = SKY
  //  update the DOM
  renderCell(gHero.pos, SKY)

  //  Move the hero to new location
  //  update the model
  gHero.pos = nextLocation // {i:2 ,j:3}
  gBoard[gHero.pos.i][gHero.pos.j] = HERO
  //  update the DOM
  renderCell(gHero.pos, HERO)
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
    i: gLeaser.pos.i,
    j: gLeaser.pos.j,
  }

  if (location.i === 0) {
    endBlinkLeaser()
    return
  }

  var nextCell = gBoard[location.i - 1][location.j]

  if (nextCell === WALL) {
    endBlinkLeaser()
    return
  }

  if (nextCell === ALIEN) {
    //TODO:kill alien
    setScore(SCORE_ALIEN)
    endBlinkLeaser()
    killAlien(1)
    return
  }

  gBoard[gLeaser.pos.i][gLeaser.pos.j] = SKY
  renderCell(gLeaser.pos, SKY)

  //  Move the laser to new location
  gLeaser.pos.i = location.i - 1
  gLeaser.pos.j = location.j

  gBoard[gLeaser.pos.i][gLeaser.pos.j] = LASER
  renderCell(gLeaser.pos, LASER)
}

function shoot() {
  if (gHero.isShoot) return
  gHero.isShoot = true

  const location = {
    i: gHero.pos.i - 1,
    j: gHero.pos.j,
  }

  gLeaser.pos.i = location.i
  gLeaser.pos.j = location.j

  gBoard[location.i][location.j] = LASER
  renderCell(location, LASER)

  gIntervalShoot = setInterval(blinkLaser, 80)
}

function endBlinkLeaser() {
  clearInterval(gIntervalShoot)
  gHero.isShoot = false

  const location = {
    i: gLeaser.pos.i,
    j: gLeaser.pos.j,
  }
  gBoard[gLeaser.pos.i][gLeaser.pos.j] = SKY
  renderCell(gLeaser.pos, SKY)
}

function killAlien(num) {
  gGame.aliensCount--
  gLeaser.pos.i -= 1

  //model
  removeAlien(gLeaser.pos)
  gBoard[gLeaser.pos.i][gLeaser.pos.j] = SKY
  renderCell(gLeaser.pos, SKY)

  if (checkGameOver()) {
    console.log('checkGameOver():', checkGameOver())
    gameOver()
  }
}
