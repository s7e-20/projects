const canvas = document.querySelector('#canvas')
const context = canvas.getContext('2d')
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 10,
}
const paddle = {
  height: 10,
  width: 75,
}
const bricks = []
const brick = {
  rowCount: 3,
  columnCount: 5,
  width: 75,
  height: 20,
  padding: 10,
  offsetTop: 40,
  offsetLeft: 30,
}
const winningScore = brick.rowCount * brick.columnCount
const keyCodes = {
  left: [37, 65],
  right: [39, 68],
  space: 32,
}
const colours = {
  blue: '#2196F3',
  orange: '#FF9800',
  green: '#4CAF50',
}
const font = '16px Open Sans'
let paused = false
let dx = 2
let dy = -2
let paddleX = (canvas.width - paddle.width) / 2
let rightPressed = false
let leftPressed = false
let score = 0
let lives = 3

/**
 * Generates bricks arranged into columns and rows
 * @returns {Array} Returns an array of arrays of bricks
 */
function generateBricks() {
  for (let column = 0; column < brick.columnCount; column += 1) {
    bricks[column] = []
    for (let row = 0; row < brick.rowCount; row += 1) {
      bricks[column][row] = { x: 0, y: 0, status: 'unbroken' }
    }
  }
}

/**
 * Renders brick on canvas
 * @param {Number} brickX
 * @param {Number} brickY
 */
function renderBrick(brickX, brickY) {
  context.beginPath()
  context.rect(brickX, brickY, brick.width, brick.height)
  context.fillStyle = colours.orange
  context.fill()
  context.closePath()
}

/**
 * Renders unbroken bricks on canvas
 * @param {Number} brickX
 * @param {Number} brickY
 */
function renderUnbrokenBricks() {
  for (let column = 0; column < brick.columnCount; column += 1) {
    for (let row = 0; row < brick.rowCount; row += 1) {
      const selectedBrick = bricks[column][row]
      if (selectedBrick.status === 'unbroken') {
        const brickX = column * (brick.width + brick.padding) + brick.offsetLeft
        const brickY = row * (brick.height + brick.padding) + brick.offsetTop
        selectedBrick.x = brickX
        selectedBrick.y = brickY
        renderBrick(brickX, brickY)
      }
    }
  }
}

/**
 * Renders ball on canvas
 */
function renderBall() {
  const startAngle = 0
  const endAngle = Math.PI * 2
  context.beginPath()
  context.arc(ball.x, ball.y, ball.radius, startAngle, endAngle)
  context.fillStyle = colours.green
  context.fill()
  context.closePath()
}

/**
 * Renders score on canvas
 */
function renderScore() {
  const scoreX = 8
  const scoreY = 20
  context.font = font
  context.fillStyle = colours.blue
  context.fillText(`Score: ${score}`, scoreX, scoreY)
}

/**
 * Renders lives on canvas
 */
function renderLives() {
  const livesX = canvas.width - 65
  const livesY = 20
  context.font = font
  context.fillStyle = colours.blue
  context.fillText(`Lives: ${lives}`, livesX, livesY)
}

/**
 * Renders pandle on canvas
 */
function renderPaddle() {
  context.fillStyle = colours.blue
  context.beginPath()
  context.rect(paddleX, canvas.height - paddle.height, paddle.width, paddle.height)
  context.fill()
  context.closePath()
}

/**
 * Handles when the player wins the game
 */
function handleWin() {
  alert('You Win, Congratulations!')
  document.location.reload()
}

/**
 * Handles when the ball collides with bricks
 */
function handleBrickCollisions() {
  for (let column = 0; column < brick.columnCount; column += 1) {
    for (let row = 0; row < brick.rowCount; row += 1) {
      const selectedBrick = bricks[column][row]
      if (selectedBrick.status === 'unbroken') {
        if (
          ball.x > selectedBrick.x &&
          ball.x < selectedBrick.x + brick.width &&
          ball.y > selectedBrick.y &&
          ball.y < selectedBrick.y + brick.height
        ) {
          dy = -dy
          selectedBrick.status = 'broken'
          score += 1
          if (score === winningScore) {
            handleWin()
          }
        }
      }
    }
  }
}

/**
 * Handles when the game ends
 */
function handleGameOver() {
  alert('Game Over')
  document.location.reload()
}

/**
 * Clears canvas content to prevent the ball leaving a trail
 */
function removeBallTrail() {
  context.clearRect(0, 0, canvas.width, canvas.height)
}

/**
 * Handles all of the rendering
 */
function handleRenderFunctions() {
  const renderFunctions = [renderUnbrokenBricks, renderBall, renderPaddle, renderScore, renderLives]
  renderFunctions.forEach((func) => func())
}

/**
 * Resets ball and paddle to their original state
 */
function resetBallAndPaddlePosition() {
  ball.x = canvas.width / 2
  ball.y = canvas.height - 30
  dx = 2
  dy = -2
  paddleX = (canvas.width - paddle.width) / 2
}

/**
 * Handles position of paddle
 */
function handlePaddlePosition() {
  if (rightPressed && paddleX < canvas.width - paddle.width) {
    paddleX += 7
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }
}

function render() {
  if (!paused) {
    removeBallTrail()
    handleRenderFunctions()
    handleBrickCollisions()
    if (ball.x + dx > canvas.width - ball.radius || ball.x + dx < ball.radius) {
      dx = -dx
    }
    if (ball.y + dy < ball.radius) {
      dy = -dy
    } else if (ball.y + dy > canvas.height - ball.radius) {
      if (ball.x > paddleX && ball.x < paddleX + paddle.width) {
        dy = -dy
      } else {
        lives -= 1
        if (!lives) {
          handleGameOver()
        } else {
          resetBallAndPaddlePosition()
        }
      }
    }
    handlePaddlePosition()
    ball.x += dx
    ball.y += dy
    requestAnimationFrame(render)
  }
}

function handlePause() {
  if (paused) {
    paused = false
    render()
  } else {
    paused = true
  }
}

function handleKeys(event) {
  const { keyCode, type } = event
  if (keyCodes.left.includes(keyCode)) {
    leftPressed = type === 'keydown'
  } else if (keyCodes.right.includes(keyCode)) {
    rightPressed = type === 'keydown'
  }
}

// document functions
;['keydown', 'keyup'].forEach((listener) => {
  document.addEventListener(listener, handleKeys, false)
})
document.body.onkeydown = (event) => {
  if (event.keyCode === keyCodes.space) {
    handlePause()
  }
}

generateBricks()
render()
