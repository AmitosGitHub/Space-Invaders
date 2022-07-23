'use strict'

var BOARD_SIZE = 14
var ALIENS_ROW_LENGTH = 8
var ALIENS_ROW_COUNT = 3
const SCORE_ALIEN = 10
{
  /* <img src="img/alien1.png" >
<img src="img/alien3.png" >
<img src="img/alien4.jpeg" ></img> */
}
const HERO = '<img src="img/user.png" >'
const ALIEN1 = '<img src="img/alien1.png" >'
const ALIEN2 = '<img src="img/alien2.jpeg" >'
const ALIEN3 = '<img src="img/alien3.png" >'
const ALIEN4 = '<img src="img/alien4.jpeg" >'
const SPACESHIP = '<img src="img/spaceship.jpeg" >'
const LASER = '🔸'
const SUPER_LASER = '🚀'
const ALIEN_LASER = '🔻'
const SKY = ' '
const WALL1 = '<img src="img/wall1.png" >'
const WALL2 = '<img src="img/wall2.jpeg" >'
const BOOM = '💥'
const LIVES = '💚'
const ALIEN_SHOOT = '❄️'
const Shields = '🛡'

var gSetTimeId
var gIntervalSpaceshipId
var gWalls
var gBoard
var gGame = {
  isOn: false,
  aliensCount: 0,
  score: 0,
  level: 'Normal',
}

function onInit() {
  gBoard = buildBoard()
  createHero(gBoard)
  createAliens(gBoard)
  renderBoard(gBoard)
  createWalls()
  printWallBoard()
}

function buildBoard() {
  const size = BOARD_SIZE
  const board = []
  for (var i = 0; i < size; i++) {
    board.push([])
    for (var j = 0; j < size; j++) {
      board[i][j] = createCell(SKY)
    }
  }

  return board
}

function renderBoard(board) {
  var strHTML = '<tbody>\n'
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n'
    for (var j = 0; j < board[i].length; j++) {
      const cell = board[i][j].gameObject
      // const element = getElement(cell)
      const className = `cell cell-${i}-${j}`
      strHTML += `<td class="${className} "> ${cell} </td>\n`
    }
    strHTML += '</tr>\n'
  }
  strHTML += '</tbody>'
  //   console.log('strHTML:', strHTML)
  const elContainer = document.querySelector('main table')
  elContainer.innerHTML = strHTML
}

function onKeyDown(ev) {
  if (!gGame.isOn) return
  switch (ev.code) {
    case 'ArrowLeft':
      moveHero('ArrowLeft')
      break
    case 'ArrowRight':
      moveHero('ArrowRight')
      break
    case 'ArrowDown':
      console.log('hii Down')
      break
    case 'ArrowUp':
      console.log('hii Up')
      break
    case 'Space':
      shoot('LASER')
      break
    case 'KeyZ':
      console.log('hiiKeyZ')
      playShield()
      break
    case 'KeyX':
      shoot('SUPER_LASER')
      updateSuperLaser()
      break
    case 'KeyN':
      BlowUpNeighbors()
      break
  }
}

function isValid(pos) {
  return pos.i >= 0 && pos.i < BOARD_SIZE && pos.j >= 0 && pos.j < BOARD_SIZE
}

//---GAME OVER-----
function checkGameOver() {
  return gGame.aliensCount === 0
}
function gameOver() {
  onStop()

  if (gGame.aliensCount === 0) {
    openModal('win')
  } else {
    openModal('lose')
  }
}

//----BTN GAME---------
function onRestart() {
  setClearIntervalTime()
  gGame.score = 0
  setScore(0)
  gGame.aliensCount = 0
  gAliens = []
  setLevel()
  closeModal()
  setBtmGame()
  gGame.isOn = false
  gIsAliensShoot = false
}
function onStart() {
  gGame.isOn = true
  if (gIntervalAliens) {
    clearInterval(gIntervalAliens)
  }
  gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)
  gIsAlienFreeze = false

  if (gIntervalSpaceshipId) {
    clearInterval(gIntervalSpaceshipId)
  }
  gIntervalSpaceshipId = setInterval(showSpaceship, 10000)
  if (gIntervalAliensShooter) {
    clearInterval(gIntervalAliensShooter)
  }
  gIntervalAliensShooter = setInterval(playAliensShoot, 4000)
}
function onStop() {
  gGame.isOn = false
  gIsAlienFreeze = true
  setClearIntervalTime()
}
function setScore(num) {
  gGame.score += num

  const elScore = document.querySelector('.score h2 span')
  elScore.innerText = gGame.score
}
function setBtmGame() {
  gHero.lives = 3
  gLaser.super.count = 3

  const elBtn = document.querySelector('.main-btn-game')

  const elLives = elBtn.querySelector('.lives span')
  elLives.innerText = `${LIVES + LIVES + LIVES}`

  const elShields = elBtn.querySelector('.shields span')
  elShields.innerText = `${SUPER_LASER + SUPER_LASER + SUPER_LASER}`

  const elSuper = elBtn.querySelector('.super-laser span')
  elSuper.innerText = `${Shields + Shields + Shields}`
}

function showSpaceship() {
  createSpaceship()

  var spaceship = null

  if (gSpaceships.length > 1) {
    spaceship = gSpaceships.splice(0, 1)[0]
    removeSpaceships({ i: spaceship.pos.i, j: spaceship.pos.j })
  }
  spaceship = gSpaceships[0]
  createCell(spaceship.sign)
  //update model+DOM  spaceship
  gBoard[spaceship.pos.i][spaceship.pos.j] = createCell(spaceship.sign)
  renderCell({ i: spaceship.pos.i, j: spaceship.pos.j }, spaceship.sign)

  // console.log('gSetTimeId:', gSetTimeId)
  if (gSetTimeId) {
    clearTimeout(gSetTimeId)
  }
  gSetTimeId = setTimeout(() => {
    removeSpaceships({ i: spaceship.pos.i, j: spaceship.pos.j })
  }, 5000)
}

function onLevel(val) {
  switch (val) {
    case 'Easy':
      gAliensTopRowIdx = 1
      gAliensBottomRowIdx = 2
      ALIENS_ROW_LENGTH = 5
      ALIENS_ROW_COUNT = 2
      gAliensRightColIdx = 9
      gAliensLeftColIdx = 4
      gIsAlienDirection = false
      break
    case 'Normal':
      gAliensTopRowIdx = 1
      gAliensBottomRowIdx = 3
      ALIENS_ROW_LENGTH = 8
      ALIENS_ROW_COUNT = 3
      gAliensRightColIdx = 12
      gAliensLeftColIdx = 4
      gIsAlienDirection = false
      break
    case 'Hard':
      gAliensTopRowIdx = 1
      gAliensBottomRowIdx = 4
      ALIENS_ROW_LENGTH = 10
      ALIENS_ROW_COUNT = 4
      gAliensRightColIdx = 14
      gAliensLeftColIdx = 4
      gIsAlienDirection = false
      break
  }
  gGame.level = val
  onInit()
}

function createCell(gameObject = null) {
  return {
    type: SKY,
    gameObject: gameObject,
  }
}

function setClearIntervalTime() {
  clearInterval(gIntervalAliens)
  clearInterval(gIntervalSpaceshipId)
  clearInterval(gIntervalAliensShooter)
  clearTimeout(gSetTimeId)
}
function setLevel() {
  const val = gGame.level
  onLevel(val)
}

function playShield() {
  console.log('playShield()')
  console.log('gHero.Shields', gHero.shields)
  if (gHero.shields > 0) {
    gHero.shields--
    gIsShield = true
    const elHero = document.querySelector(`.cell-${gHero.pos.i}-${gHero.pos.j}`)
    console.log('elHero:', elHero)
    elHero.classList.add('shieldsOn')
    updateShields()

    setTimeout(() => {
      gIsShield = false
      elHero.classList.remove('shieldsOn')
    }, 5000)
  }
}

//----wall------

function createWalls() {
  gWalls = [
    { pos: { i: 11, j: 1 }, lives: 2 },
    { pos: { i: 11, j: 2 }, lives: 2 },
    { pos: { i: 11, j: 11 }, lives: 2 },
    { pos: { i: 11, j: 12 }, lives: 2 },
  ]
}

function printWallBoard() {
  for (var i = 0; i < gWalls.length; i++) {
    const wall = gWalls[i]
    updateCell(wall.pos, WALL1)
  }
}

function updateWalls() {
  if (!gWalls) return

  for (var i = 0; i < gWalls.length; i++) {
    const wall = gWalls[i]
    if (wall.lives === 2) continue
    if (wall.lives === 1) {
      updateCell(wall.pos, WALL2)
    }
    if (wall.lives === 0) {
      updateCell(wall.pos, SKY)
      gWalls.splice(i, 1)
    }
  }
}
function removeLivesWall(location) {
  const wall = getWall(location)
  wall.lives--
}

function getWall(location) {
  for (var i = 0; i < gWalls.length; i++) {
    const wall = gWalls[i]
    if (wall.pos.i === location.i && wall.pos.j === location.j) {
      return wall
    }
  }
}
