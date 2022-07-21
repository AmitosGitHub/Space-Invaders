'use strict'

var BOARD_SIZE = 14
var ALIENS_ROW_LENGTH = 8
var ALIENS_ROW_COUNT = 3
const SCORE_ALIEN = 10

const HERO = '<img src="img/user.png" >'
const ALIEN = '<img src="img/alien2.jpeg" >'
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
      board[i][j] = SKY
    }
  }
  //   console.log('board:', board)
  return board
}

function renderBoard(board) {
  var strHTML = '<tbody>\n'
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n'
    for (var j = 0; j < board[i].length; j++) {
      const cell = board[i][j]
      const element = getElement(cell)
      const className = `cell cell-${i}-${j}`
      strHTML += `<td class="${className} ${element}"> ${cell} </td>\n`
    }
    strHTML += '</tr>\n'
  }
  strHTML += '</tbody>'
  //   console.log('strHTML:', strHTML)
  const elContainer = document.querySelector('main table')
  elContainer.innerHTML = strHTML
}

function getElement(cell) {
  var element = ''
  switch (cell) {
    case HERO:
      element = 'hero'
      break
    case ALIEN:
      element = 'alien'
      break

    default:
      element = 'sky'
  }
  return element
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
  return (
    pos.i >= 0 &&
    pos.i < gBoard.length &&
    pos.j >= 0 &&
    pos.j < gBoard[0].length
  )
}

function setScore(score) {
  gGame.score += score

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
  clearInterval(gIntervalAliens)
  clearInterval(gIntervalSpaceshipId)
  clearTimeout(gSetTimeId)
  gAliensTopRowIdx = 0
  gAliensBottomRowIdx = 2
  gAliensLeftColIdx = 4
  gAliensRightColIdx = 9
  gIsAlienDirection = false
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
}

function onStop() {
  gGame.isOn = false
  gIsAlienFreeze = true
  clearInterval(gIntervalAliens)
  clearInterval(gIntervalSpaceshipId)
  clearTimeout(gSetTimeId)
}
function showSpaceship() {
  createSpaceship()

  var spaceship

  if (gSpaceships.length > 1) {
    spaceship = gSpaceships.splice(0, 1)[0]
    removeSpaceships({ i: spaceship.pos.i, j: spaceship.pos.j })
  }
  spaceship = gSpaceships[0]

  //update model+DOM  spaceship
  gBoard[spaceship.pos.i][spaceship.pos.j] = spaceship.sign
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
  console.log('val:', val)
  switch (val) {
    case 'Easy':
      ALIENS_ROW_LENGTH = 5
      ALIENS_ROW_COUNT = 2
      gAliensBottomRowIdx = 2
      gAliensRightColIdx = 9
      break
    case 'Normal':
      ALIENS_ROW_LENGTH = 8
      ALIENS_ROW_COUNT = 3
      gAliensBottomRowIdx = 3
      gAliensRightColIdx = 12
      break
    case 'Hard':
      ALIENS_ROW_LENGTH = 10
      ALIENS_ROW_COUNT = 4
      gAliensBottomRowIdx = 4
      gAliensRightColIdx = 14
      break
  }
  onInit()
}
