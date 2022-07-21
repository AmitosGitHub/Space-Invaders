'use strict'

const LASER_SPEED = 80
var gHero
var gLeaser = {
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
  if (nextCell === WALL) return

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

  // // moving from current position:
  // //  update the model
  // gBoard[gHero.pos.i][gHero.pos.j] = SKY
  // //  update the DOM
  // renderCell(gHero.pos, SKY)

  //  Move the hero to new location
  //  update the model
  // gHero.pos = nextLocation // {i:2 ,j:3}
  // gBoard[gHero.pos.i][gHero.pos.j] = HERO
  // //  update the DOM
  // renderCell(gHero.pos, HERO)
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

  var nextCell = gBoard[location.i - 1][location.j].gameObject

  if (nextCell === SPACESHIP) {
    setAliensFreeze()
    clearInterval(gIntervalSpaceshipId)

    clearTimeout(gSetTimeId)
    setScore(50)
    const spaceship = gSpaceships.splice(0, 1)[0]
    removeSpaceships({ i: spaceship.pos.i, j: spaceship.pos.j })
    endBlinkLeaser()
    gIntervalSpaceshipId = setInterval(showSpaceship, 10000)
    return
  }
  if (nextCell === WALL) {
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
  updateCell(gLeaser.pos, SKY)

  //  Move the laser to new location
  gLeaser.pos.i = location.i - 1
  gLeaser.pos.j = location.j

  const laser = gHero.laser === 'super' ? SUPER_LASER : LASER
  updateCell(gLeaser.pos, laser)
}

function shoot(sign) {
  if (gHero.isShoot) return
  gHero.isShoot = true

  const location = {
    i: gHero.pos.i - 1,
    j: gHero.pos.j,
  }

  gLeaser.pos.i = location.i
  gLeaser.pos.j = location.j

  const speed =
    sign === gLeaser.regular.sign ? gLeaser.regular.speed : gLeaser.super.speed
  var laser = LASER
  if (gLeaser.super.count === 0 || sign === gLeaser.regular.sign) {
    gHero.laser = 'regular'
  } else {
    gHero.laser = 'super'
    laser = SUPER_LASER
  }
  updateCell(location, laser)
  // gBoard[location.i][location.j] = laser
  // renderCell(location, laser)

  gIntervalShoot = setInterval(blinkLaser, speed)
}

function endBlinkLeaser() {
  clearInterval(gIntervalShoot)
  gHero.isShoot = false
  updateCell(gLeaser.pos, SKY)
}

function killAlien(num) {
  if (num === 1) {
    gLeaser.pos.i -= 1

    removeAlien(gLeaser.pos)
    updateCell(gLeaser.pos, SKY)
  } else if (num === 2) {
    killAroundAlien(gLeaser.pos)
  }

  if (checkGameOver()) {
    gameOver()
  }
}

function BlowUpNeighbors() {
  clearInterval(gIntervalShoot)
  gHero.isShoot = false

  updateCell(gLeaser.pos, BOOM)

  killAlien(2)

  setTimeout(() => {
    updateCell(gLeaser.pos, SKY)
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
}

function updateCell(location, element) {
  gBoard[location.i][location.j] = createCell(element)
  renderCell(location, element)
}

function updateSuperLaser() {
  if (gLeaser.super.count === 0) return
  gLeaser.super.count--
  var srtHTML = ''
  for (var i = 0; i < gLeaser.super.count; i++) {
    srtHTML += SUPER_LASER
  }
  const elSuper = document.querySelector('.main-btn-game .super-laser span')
  elSuper.innerText = srtHTML
}

function updateLives() {
  if (gHero.lives === 0) return
  gHero.lives--

  var srtHTML = ''
  for (var i = 0; i < gHero.lives; i++) {
    srtHTML += LIVES
  }
  const elSuper = document.querySelector('.main-btn-game .lives span')
  elSuper.innerText = srtHTML
}
