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
const SPACESHIP = '🛰'
const LASER = '🔸'
const SUPER_LASER = '🚀'
const ALIEN_LASER = '🔻'
const SKY = ' '
const WALL = 'X'
const BOOM = '💥'
const LIVES = '💚'

var gSetTimeId
var gIntervalSpaceshipId

// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
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

// function getElement(cell) {
//   var element = ''
//   switch (cell) {
//     case HERO:
//       element = 'hero'
//       break
//     case ALIEN:
//       element = 'alien'
//       break

//     default:
//       element = 'sky'
//   }
//   return element
// }

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

function setScore(num) {
  gGame.score += num

  const elScore = document.querySelector('.score h2 span')
  elScore.innerText = gGame.score
}

function checkGameOver() {
  return gGame.aliensCount === 0
}
function gameOver() {
  onStop()
  gGame.isOn = false
  if (gGame.aliensCount === 0) {
    openModal('win')
  } else {
    openModal('lose')
  }
}

function onRestart() {
  setClearIntervalTime()
  setLevel(gGame.level)
  gAliens = []
  gGame.score = 0
  gLeaser.super.count = 3
  gGame.aliensCount = 0
  setScore(0)
  closeModal()
  onInit()
  gGame.isOn = false
}

function onStart() {
  gGame.isOn = true
  if (gIntervalAliens) {
    clearInterval(gIntervalAliens)
  }
  gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)
  gIsAlienFreeze = false
  gIntervalSpaceshipId = setInterval(showSpaceship, 10000)
  gIsAlienDirection = false
}

function onStop() {
  gGame.isOn = false
  gIsAlienFreeze = true
  setClearIntervalTime()
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
      ALIENS_ROW_LENGTH = 5
      ALIENS_ROW_COUNT = 2
      gAliensBottomRowIdx = 2
      gAliensRightColIdx = 9
      gAliensLeftColIdx = 4
      gIsAlienDirection = false
      break
    case 'Normal':
      gAliensTopRowIdx = 1
      ALIENS_ROW_LENGTH = 8
      ALIENS_ROW_COUNT = 3
      gAliensBottomRowIdx = 3
      gAliensRightColIdx = 11
      gAliensLeftColIdx = 4
      gIsAlienDirection = false
      break
    case 'Hard':
      gAliensTopRowIdx = 1
      ALIENS_ROW_LENGTH = 10
      ALIENS_ROW_COUNT = 4
      gAliensBottomRowIdx = 4
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
  clearTimeout(gSetTimeId)
}
function setLevel(val) {
  onLevel(val)
}
