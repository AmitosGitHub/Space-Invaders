'use strict'

const BOARD_SIZE = 14
const ALIENS_ROW_LENGTH = 5
const ALIENS_ROW_COUNT = 3
const SCORE_ALIEN = 10

const HERO = '<img src="img/hero.png" >'
const ALIEN = '<img src="img/alien-green.png" />'
const LASER = '<img src="img/leaser.jpeg" >'
const SKY = ' '
const WALL = 'X'

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
  gGame.isOn = true
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
      shoot()
      break
    case 'KeyZ':
      console.log('hiiKeyZ')
      break
    case 'KeyX':
      console.log('hiiKeyX')
      break
    case 'KeyN':
      console.log('hiiKeyN')
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
  //   clearInterval(gIntervalAliens)
  gGame.isOn = false
  if (gGame.aliensCount === 0) {
    openModal('win')
  } else {
    openModal('lose')
  }
}

function onRestart() {
  gGame.score = 0
  setScore(0)
  onInit()
  closeModal()
}

function onStart() {
  gIntervalAliens = setInterval(moveAliens, ALIEN_SPEED)
  gIsAlienFreeze = false
}

function onStop() {
  gIsAlienFreeze = true
  clearInterval(gIntervalAliens)
}
