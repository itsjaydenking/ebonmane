// script.js

document
  .getElementById("darkModeToggle")
  .addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");
  });

// Dice Roller
function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

document.addEventListener("DOMContentLoaded", function () {
  let diceResults = [];
  const diceResultsContainer = document.getElementById("diceResults");
  const rollButton = document.getElementById("rollButton");
  const rerollButton = document.getElementById("rerollButton");
  const resetButton = document.getElementById("resetButton");

  rollButton.addEventListener("click", function () {
    const numD6 = parseInt(document.getElementById("numD6").value);
    const numD12 = parseInt(document.getElementById("numD12").value);
    const targetNumber = parseInt(
      document.getElementById("targetNumber").value
    );

    diceResults = [];

    for (let i = 0; i < numD6; i++) {
      diceResults.push({ sides: 6, value: rollDice(6) });
    }

    for (let i = 0; i < numD12; i++) {
      diceResults.push({ sides: 12, value: rollDice(12) });
    }

    updateResults(diceResults, targetNumber);
  });

  rerollButton.addEventListener("click", function () {
    const targetNumber = parseInt(
      document.getElementById("targetNumber").value
    );
    const selectedDice = document.querySelectorAll(
      'input[name="dice"]:checked'
    );

    if (selectedDice.length > 2) {
      alert("You can only reroll up to two dice at a time.");
      return;
    }

    selectedDice.forEach((checkbox) => {
      const index = parseInt(checkbox.value);
      diceResults[index].value = rollDice(diceResults[index].sides);
    });

    updateResults(diceResults, targetNumber);
  });

  resetButton.addEventListener("click", function () {
    diceResults = [];
    diceResultsContainer.innerHTML = "";
    document.getElementById("successResult").innerText = "";
    document.getElementById("harmonyResult").innerText = "";
    document.getElementById("complicationResult").innerText = "";
  });

  function updateResults(diceResults, targetNumber) {
    let successes = 0;
    let complications = 0;
    diceResultsContainer.innerHTML = "";

    diceResults.forEach((result, index) => {
      if (result.sides === 6 && result.value >= 6) {
        successes++;
      } else if (result.sides === 12) {
        if (result.value >= 10) {
          successes += 2;
        } else if (result.value >= 6) {
          successes++;
        }
      }

      if (result.value <= targetNumber) {
        complications++;
      }

      if (result.value === 1) {
        complications++;
      }

      const dieResult = document.createElement("div");
      dieResult.innerHTML = `<input type="checkbox" name="dice" value="${index}"> Die ${
        index + 1
      } (${result.sides}-sided): ${result.value}`;
      diceResultsContainer.appendChild(dieResult);
    });

    document.getElementById(
      "successResult"
    ).innerText = `Successes: ${successes}`;
    document.getElementById(
      "harmonyResult"
    ).innerText = `Harmony Points: ${Math.max(0, successes - targetNumber)}`;
    document.getElementById(
      "complicationResult"
    ).innerText = `Complications: ${complications}`;
  }
});
