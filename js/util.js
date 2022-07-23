'use strict'

//---Random Int----without max-
function getRandomInt(min, max) {
  var min = Math.ceil(min)
  var max = Math.floor(max)
  var randNum = Math.floor(Math.random() * (max - min)) + min
  return randNum
}

function startTime() {
  gStartTime = Date.now()
  gIntervalStoperGlueId = setInterval(updateTime, 80)
}

function updateTime() {
  var now = Date.now()
  var distance = now - gStartTime
  var secondsPast = Math.floor((distance % (1000 * 60)) / 1000)
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  var strTime = minutes + ':' + secondsPast

  var elTime = document.querySelector('.stoperGlue-span')
  elTime.innerText = strTime
}

function playSound() {
  var sound = new Audio('sound/laser.wav')
  sound.play()
}
// location such as: {i: 2, j: 7}
function renderCell(location, value) {
  // Select the elCell and set the value
  const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
  elCell.innerHTML = value
}

function openModal(res) {
  const elModal = document.querySelector('.modal')
  const elMsgModal = elModal.querySelector('h3')

  const msg = res === 'win' ? 'VICTORY' : 'YOU LOSE'

  elMsgModal.innerText = msg
  elModal.style.display = 'block'
}
function closeModal() {
  const elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
