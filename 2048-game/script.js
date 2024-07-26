document.addEventListener("DOMContentLoaded", () => {
  const gridDisplay = document.querySelector(".grid");
  const scoreDisplay = document.getElementById("score");
  const restartButton = document.getElementById("restart");
  const width = 4;
  let squares = [];
  let score = 0;
  let startX, startY, endX, endY;

  // Create the playing board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      let square = document.createElement("div");
      square.innerHTML = 0;
      square.classList.add("tile");
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generate();
    generate();
  }

  // Generate a number randomly
  function generate() {
    let emptySquares = squares.filter((square) => square.innerHTML == 0);
    if (emptySquares.length > 0) {
      let randomSquare =
        emptySquares[Math.floor(Math.random() * emptySquares.length)];
      randomSquare.innerHTML = 2;
      randomSquare.setAttribute("data-value", 2);
      randomSquare.classList.add("new-tile");
      checkForGameOver();
    }
  }

  // Swipe right
  function moveRight() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].innerHTML;
        let totalTwo = squares[i + 1].innerHTML;
        let totalThree = squares[i + 2].innerHTML;
        let totalFour = squares[i + 3].innerHTML;
        let row = [
          parseInt(totalOne),
          parseInt(totalTwo),
          parseInt(totalThree),
          parseInt(totalFour),
        ];

        let filteredRow = row.filter((num) => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = zeros.concat(filteredRow);

        squares[i].innerHTML = newRow[0];
        squares[i].setAttribute("data-value", newRow[0]);
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 1].setAttribute("data-value", newRow[1]);
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 2].setAttribute("data-value", newRow[2]);
        squares[i + 3].innerHTML = newRow[3];
        squares[i + 3].setAttribute("data-value", newRow[3]);
      }
    }
  }

  // Swipe left
  function moveLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].innerHTML;
        let totalTwo = squares[i + 1].innerHTML;
        let totalThree = squares[i + 2].innerHTML;
        let totalFour = squares[i + 3].innerHTML;
        let row = [
          parseInt(totalOne),
          parseInt(totalTwo),
          parseInt(totalThree),
          parseInt(totalFour),
        ];

        let filteredRow = row.filter((num) => num);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = filteredRow.concat(zeros);

        squares[i].innerHTML = newRow[0];
        squares[i].setAttribute("data-value", newRow[0]);
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 1].setAttribute("data-value", newRow[1]);
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 2].setAttribute("data-value", newRow[2]);
        squares[i + 3].innerHTML = newRow[3];
        squares[i + 3].setAttribute("data-value", newRow[3]);
      }
    }
  }

  // Swipe down
  function moveDown() {
    for (let i = 0; i < 4; i++) {
      let totalOne = squares[i].innerHTML;
      let totalTwo = squares[i + width].innerHTML;
      let totalThree = squares[i + width * 2].innerHTML;
      let totalFour = squares[i + width * 3].innerHTML;
      let column = [
        parseInt(totalOne),
        parseInt(totalTwo),
        parseInt(totalThree),
        parseInt(totalFour),
      ];

      let filteredColumn = column.filter((num) => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = zeros.concat(filteredColumn);

      squares[i].innerHTML = newColumn[0];
      squares[i].setAttribute("data-value", newColumn[0]);
      squares[i + width].innerHTML = newColumn[1];
      squares[i + width].setAttribute("data-value", newColumn[1]);
      squares[i + width * 2].innerHTML = newColumn[2];
      squares[i + width * 2].setAttribute("data-value", newColumn[2]);
      squares[i + width * 3].innerHTML = newColumn[3];
      squares[i + width * 3].setAttribute("data-value", newColumn[3]);
    }
  }

  // Swipe up
  function moveUp() {
    for (let i = 0; i < 4; i++) {
      let totalOne = squares[i].innerHTML;
      let totalTwo = squares[i + width].innerHTML;
      let totalThree = squares[i + width * 2].innerHTML;
      let totalFour = squares[i + width * 3].innerHTML;
      let column = [
        parseInt(totalOne),
        parseInt(totalTwo),
        parseInt(totalThree),
        parseInt(totalFour),
      ];

      let filteredColumn = column.filter((num) => num);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = filteredColumn.concat(zeros);

      squares[i].innerHTML = newColumn[0];
      squares[i].setAttribute("data-value", newColumn[0]);
      squares[i + width].innerHTML = newColumn[1];
      squares[i + width].setAttribute("data-value", newColumn[1]);
      squares[i + width * 2].innerHTML = newColumn[2];
      squares[i + width * 2].setAttribute("data-value", newColumn[2]);
      squares[i + width * 3].innerHTML = newColumn[3];
      squares[i + width * 3].setAttribute("data-value", newColumn[3]);
    }
  }

  // Combine numbers in a row to the right
  function combineRowRight() {
    for (let i = 15; i >= 0; i--) {
      if (i % 4 !== 3 && squares[i].innerHTML === squares[i + 1].innerHTML) {
        let combinedTotal =
          parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i].setAttribute("data-value", combinedTotal);
        squares[i].classList.add("combine-tile");
        squares[i + 1].innerHTML = 0;
        squares[i + 1].setAttribute("data-value", 0);
        score += combinedTotal;
        scoreDisplay.innerText = score;
      }
    }
  }

  // Combine numbers in a row to the left
  function combineRowLeft() {
    for (let i = 0; i < 15; i++) {
      if (i % 4 !== 3 && squares[i].innerHTML === squares[i + 1].innerHTML) {
        let combinedTotal =
          parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i].setAttribute("data-value", combinedTotal);
        squares[i].classList.add("combine-tile");
        squares[i + 1].innerHTML = 0;
        squares[i + 1].setAttribute("data-value", 0);
        score += combinedTotal;
        scoreDisplay.innerText = score;
      }
    }
  }

  // Combine numbers in a column downwards
  function combineColumnDown() {
    for (let i = 15; i >= 4; i--) {
      if (squares[i].innerHTML === squares[i - width].innerHTML) {
        let combinedTotal =
          parseInt(squares[i].innerHTML) +
          parseInt(squares[i - width].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i].setAttribute("data-value", combinedTotal);
        squares[i].classList.add("combine-tile");
        squares[i - width].innerHTML = 0;
        squares[i - width].setAttribute("data-value", 0);
        score += combinedTotal;
        scoreDisplay.innerText = score;
      }
    }
  }

  // Combine numbers in a column upwards
  function combineColumnUp() {
    for (let i = 0; i <= 11; i++) {
      if (squares[i].innerHTML === squares[i + width].innerHTML) {
        let combinedTotal =
          parseInt(squares[i].innerHTML) +
          parseInt(squares[i + width].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i].setAttribute("data-value", combinedTotal);
        squares[i].classList.add("combine-tile");
        squares[i + width].innerHTML = 0;
        squares[i + width].setAttribute("data-value", 0);
        score += combinedTotal;
        scoreDisplay.innerText = score;
      }
    }
  }

  // Move tiles right after combining
  function moveRightAfterCombine() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let row = [
          squares[i].innerHTML,
          squares[i + 1].innerHTML,
          squares[i + 2].innerHTML,
          squares[i + 3].innerHTML,
        ];

        let filteredRow = row.filter((num) => num != 0);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = zeros.concat(filteredRow);

        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
    generate();
  }

  // Move tiles left after combining
  function moveLeftAfterCombine() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let row = [
          squares[i].innerHTML,
          squares[i + 1].innerHTML,
          squares[i + 2].innerHTML,
          squares[i + 3].innerHTML,
        ];

        let filteredRow = row.filter((num) => num != 0);
        let missing = 4 - filteredRow.length;
        let zeros = Array(missing).fill(0);
        let newRow = filteredRow.concat(zeros);

        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
    generate();
  }

  // Move tiles down after combining
  function moveDownAfterCombine() {
    for (let i = 0; i < 4; i++) {
      let column = [
        squares[i].innerHTML,
        squares[i + width].innerHTML,
        squares[i + width * 2].innerHTML,
        squares[i + width * 3].innerHTML,
      ];

      let filteredColumn = column.filter((num) => num != 0);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = zeros.concat(filteredColumn);

      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + width * 2].innerHTML = newColumn[2];
      squares[i + width * 3].innerHTML = newColumn[3];
    }
    generate();
  }

  // Move tiles up after combining
  function moveUpAfterCombine() {
    for (let i = 0; i < 4; i++) {
      let column = [
        squares[i].innerHTML,
        squares[i + width].innerHTML,
        squares[i + width * 2].innerHTML,
        squares[i + width * 3].innerHTML,
      ];

      let filteredColumn = column.filter((num) => num != 0);
      let missing = 4 - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = filteredColumn.concat(zeros);

      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + width * 2].innerHTML = newColumn[2];
      squares[i + width * 3].innerHTML = newColumn[3];
    }
    generate();
  }

  // Check for win
  function checkForWin() {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 2048) {
        setTimeout(() => alert("You win!"), 100);
        document.removeEventListener("keydown", control);
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchend", handleTouchEnd);
      }
    }
  }

  // Check for game over
  function checkForGameOver() {
    let zeros = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) {
        zeros++;
      }
    }
    if (zeros === 0) {
      setTimeout(() => alert("Game Over!"), 100);
      document.removeEventListener("keydown", control);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
    }
  }

  // Restart game
  restartButton.addEventListener("click", restartGame);

  function restartGame() {
    gridDisplay.innerHTML = "";
    score = 0;
    scoreDisplay.innerText = score;
    squares = [];
    createBoard();
    document.addEventListener("keydown", control);
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchend", handleTouchEnd);
  }

  // Assign functions to keycodes
  function control(e) {
    if (e.keyCode === 39) {
      keyRight();
    } else if (e.keyCode === 37) {
      keyLeft();
    } else if (e.keyCode === 38) {
      keyUp();
    } else if (e.keyCode === 40) {
      keyDown();
    }
  }
  document.addEventListener("keydown", control);

  function keyRight() {
    moveRight();
    combineRowRight();
    moveRightAfterCombine();
    generate();
  }

  function keyLeft() {
    moveLeft();
    combineRowLeft();
    moveLeftAfterCombine();
    generate();
  }

  function keyDown() {
    moveDown();
    combineColumnDown();
    moveDownAfterCombine();
    generate();
  }

  function keyUp() {
    moveUp();
    combineColumnUp();
    moveUpAfterCombine();
    generate();
  }

  // Touch event handlers for mobile devices
  function handleTouchStart(e) {
    startX = e.changedTouches[0].clientX;
    startY = e.changedTouches[0].clientY;
  }

  function handleTouchEnd(e) {
    endX = e.changedTouches[0].clientX;
    endY = e.changedTouches[0].clientY;
    handleSwipe();
  }

  function handleSwipe() {
    let deltaX = endX - startX;
    let deltaY = endY - startY;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        keyRight();
      } else {
        keyLeft();
      }
    } else {
      if (deltaY > 0) {
        keyDown();
      } else {
        keyUp();
      }
    }
  }

  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchend", handleTouchEnd);

  createBoard();
});

// JavaScript for menu toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const navList = document.querySelector("nav ul");

  menuToggle.addEventListener("click", function () {
    navList.classList.toggle("show");
  });
});

document.addEventListener("DOMContentLoaded", (event) => {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;
  const header = document.querySelector("header");
  const footer = document.querySelector("footer");
  const gridContainer = document.querySelector(".grid-container");

  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    header.classList.toggle("dark-mode");
    footer.classList.toggle("dark-mode");
    gridContainer.classList.toggle("dark-mode");
    squares.forEach((square) => square.classList.toggle("dark-mode"));
  });
});
