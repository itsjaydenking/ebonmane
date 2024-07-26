document.addEventListener("DOMContentLoaded", () => {
  let level = 1;
  let experience = 0;
  let gold = 0;
  let expToNextLevel = 100;
  let health = 100;
  let maxHealth = 100;
  let stamina = 100;
  let maxStamina = 100;
  let attack = 20;
  let inventory = [];
  let equippedWeapon = null;
  let equippedArmor = null;
  let quests = [];
  let activeQuest = null;
  let monstersDefeated = 0;
  const skills = [
    { name: "Slash", damageMultiplier: [1.1, 1.5], staminaCost: 30 },
    { name: "Heal", healMultiplier: [0.35, 0.65], staminaCost: 40 },
  ];

  const levelElement = document.getElementById("level");
  const experienceElement = document.getElementById("experience");
  const expToNextLevelElement = document.getElementById("exp-to-next-level");
  const goldElement = document.getElementById("gold");
  const healthElement = document.getElementById("health");
  const healthBarElement = document.getElementById("health-bar");
  const staminaElement = document.getElementById("stamina");
  const staminaBarElement = document.getElementById("stamina-bar");
  const attackElement = document.getElementById("attack");
  const logElement = document.getElementById("log");
  const fightButton = document.getElementById("fight-monster");
  const questButton = document.getElementById("quest");
  const turnInQuestButton = document.getElementById("turn-in-quest");
  const clearLogButton = document.getElementById("clear-log");
  const inventoryElement = document.getElementById("inventory");
  const skillsElement = document.getElementById("skills");
  const questsElement = document.getElementById("quests");
  const monsterSelect = document.getElementById("monster-select");
  const buyHealthPotionButton = document.getElementById("buy-health-potion");
  const buyEnergyPotionButton = document.getElementById("buy-energy-potion");
  const saveYourSoulButton = document.getElementById("save-your-soul");
  const slashButton = document.getElementById("slash");
  const healButton = document.getElementById("heal");

  fightButton.addEventListener("click", fightMonster);
  questButton.addEventListener("click", acceptQuest);
  turnInQuestButton.addEventListener("click", turnInQuest);
  clearLogButton.addEventListener("click", clearLog);
  buyHealthPotionButton.addEventListener("click", buyHealthPotion);
  buyEnergyPotionButton.addEventListener("click", buyEnergyPotion);
  saveYourSoulButton.addEventListener("click", saveYourSoul);
  slashButton.addEventListener("click", useSlash);
  healButton.addEventListener("click", useHeal);

  function fightMonster() {
    const selectedMonster = monsterSelect.value;
    const monster = getMonsters()[selectedMonster];

    if (!monster) {
      log("Invalid monster choice.", "error");
      return;
    }

    let playerDamage = calculateDamage();
    const monsterDamage = monster.damage;
    health -= monsterDamage;

    log(
      `You fought a <span class="monster-name">${monster.name}</span> and received <span class="damage-received">${monsterDamage}</span> damage.`,
      "combat"
    );

    if (health <= 0) {
      log("You have been defeated!", "error");
      saveYourSoulButton.style.display = "block";
      updateStats();
      return;
    }

    if (playerDamage < monster.health) {
      log(
        `You dealt <span class="damage-given">${playerDamage}</span> damage but it was not enough to defeat the <span class="monster-name">${monster.name}</span>.`,
        "combat"
      );
      setTimeout(() => {
        let continueFighting = confirm(
          `The ${monster.name} will deal ${monsterDamage} damage. Do you want to continue fighting?`
        );
        if (!continueFighting) {
          log(
            `You ran away from the <span class="monster-name">${monster.name}</span>, better luck next time.`,
            "combat"
          );
          return;
        } else {
          health -= monsterDamage;
          if (health <= 0) {
            log("You have been defeated!", "error");
            saveYourSoulButton.style.display = "block";
            updateStats();
            return;
          }
          fightMonster();
        }
      }, 100);
    } else {
      log(
        `You defeated the <span class="monster-name">${monster.name}</span>!`,
        "success"
      );
      experience += monster.exp;
      gold += monster.gold;
      log(
        `You gained <span class="exp-earned">${monster.exp}</span> experience and <span class="gold-earned">${monster.gold}</span> gold.`,
        "reward"
      );

      if (activeQuest && activeQuest.monster === monster.name) {
        monstersDefeated++;
        log(
          `You have defeated <span class="monsters-defeated">${monstersDefeated}</span> out of <span class="quest-amount">${activeQuest.amount}</span> <span class="monster-name">${activeQuest.monster}(s)</span> for your quest.`,
          "quest"
        );
        if (monstersDefeated >= activeQuest.amount) {
          log(
            `Quest "<span class="quest-name">${activeQuest.name}</span>" is ready to be turned in!`,
            "success"
          );
          turnInQuestButton.style.display = "block";
        }
      }

      if (experience >= expToNextLevel) {
        levelUp();
      }

      updateStats();
    }
  }

  function levelUp() {
    const healthRecovered = maxHealth - health;
    const staminaRecovered = maxStamina - stamina;
    experience -= expToNextLevel;
    level++;
    expToNextLevel = Math.floor(expToNextLevel * 1.5);
    maxHealth = Math.floor(maxHealth * 1.1);
    health = maxHealth;
    maxStamina = Math.floor(maxStamina * 1.1);
    stamina = maxStamina;
    attack += 5;

    log(
      `Congratulations! You leveled up to level <span class="level">${level}</span>!`,
      "level-up"
    );
    log(
      `You recovered <span class="health-restored">${healthRecovered}</span> health and <span class="stamina-restored">${staminaRecovered}</span> stamina by leveling up.`,
      "level-up"
    );
  }

  function calculateDamage() {
    let damage = attack;
    if (equippedWeapon) {
      damage += equippedWeapon.damage;
    }
    return damage;
  }

  function updateStats() {
    levelElement.textContent = level;
    experienceElement.textContent = experience;
    expToNextLevelElement.textContent = expToNextLevel;
    goldElement.textContent = gold;
    healthElement.textContent = `${health} / ${maxHealth} (${(
      (health / maxHealth) *
      100
    ).toFixed(1)}%)`;
    staminaElement.textContent = `${stamina} / ${maxStamina} (${(
      (stamina / maxStamina) *
      100
    ).toFixed(1)}%)`;
    attackElement.textContent = attack;
    healthBarElement.style.width = `${(health / maxHealth) * 100}%`;
    staminaBarElement.style.width = `${(stamina / maxStamina) * 100}%`;
    inventoryElement.textContent = `Inventory: ${inventory
      .map((item) => item.name)
      .join(", ")}`;
    skillsElement.textContent = `Skills: ${skills
      .map((skill) => skill.name)
      .join(", ")}`;
    questsElement.textContent = `Quests: ${quests
      .map(
        (quest) => `${quest.name} (Defeat ${quest.amount} ${quest.monster}(s))`
      )
      .join(", ")}`;
  }

  function log(message, type = "") {
    const logEntry = document.createElement("p");
    logEntry.innerHTML = message;
    logEntry.className = `log-entry ${type}`;
    logElement.appendChild(logEntry);
    logElement.scrollTop = logElement.scrollHeight;
  }

  function clearLog() {
    logElement.innerHTML = "";
  }

  function getMonsters() {
    return {
      slime: { name: "Slime", health: 20, damage: 3, exp: 15, gold: 5 },
      skeleton: { name: "Skeleton", health: 35, damage: 6, exp: 25, gold: 12 },
      zombie: { name: "Zombie", health: 40, damage: 7, exp: 30, gold: 15 },
      oni: { name: "Oni", health: 50, damage: 10, exp: 50, gold: 20 },
      vampire: { name: "Vampire", health: 60, damage: 12, exp: 60, gold: 30 },
      werewolf: { name: "Werewolf", health: 80, damage: 15, exp: 80, gold: 40 },
      dragon: { name: "Dragon", health: 100, damage: 20, exp: 100, gold: 50 },
    };
  }

  function acceptQuest() {
    const quest = {
      name: "Monster Hunt",
      monster: "slime",
      amount: 3,
      reward: {
        gold: 50,
        item: { name: "Basic Sword", type: "weapon", damage: 5 },
      },
    };
    quests.push(quest);
    activeQuest = quest;
    monstersDefeated = 0;
    log(
      `You accepted the quest: "<span class="quest-name">${quest.name}</span>" - Defeat <span class="quest-amount">${quest.amount}</span> <span class="monster-name">${quest.monster}(s)</span>.`,
      "quest"
    );
    updateStats();
  }

  function turnInQuest() {
    if (!activeQuest || monstersDefeated < activeQuest.amount) {
      log("You have not completed the quest requirements.", "error");
      return;
    }

    gold += activeQuest.reward.gold;
    inventory.push(activeQuest.reward.item);
    log(
      `You completed the quest "<span class="quest-name">${activeQuest.name}</span>"! You received <span class="gold-earned">${activeQuest.reward.gold}</span> gold and a <span class="item-name">${activeQuest.reward.item.name}</span>.`,
      "reward"
    );
    activeQuest = null;
    monstersDefeated = 0;
    turnInQuestButton.style.display = "none";

    // Increase quest difficulty for the next quest
    quests = quests.map((q) => ({ ...q, amount: q.amount + 2 }));

    updateStats();
  }

  function saveYourSoul() {
    if (health <= 0) {
      health = maxHealth;
      log("You saved your soul and restored your health to full!", "success");
      saveYourSoulButton.style.display = "none";
      updateStats();
    }
  }

  function useSlash() {
    if (stamina >= 30) {
      const selectedMonster = monsterSelect.value;
      const monster = getMonsters()[selectedMonster];
      const damage = Math.floor(attack * (1.1 + Math.random() * 0.4));
      monster.health -= damage;
      stamina -= 30;
      log(
        `You used Slash on the <span class="monster-name">${monster.name}</span> and dealt <span class="damage-given">${damage}</span> damage.`,
        "combat"
      );

      if (monster.health <= 0) {
        log(
          `You defeated the <span class="monster-name">${monster.name}</span>!`,
          "success"
        );
        experience += monster.exp;
        gold += monster.gold;
        log(
          `You gained <span class="exp-earned">${monster.exp}</span> experience and <span class="gold-earned">${monster.gold}</span> gold.`,
          "reward"
        );

        if (activeQuest && activeQuest.monster === monster.name) {
          monstersDefeated++;
          log(
            `You have defeated <span class="monsters-defeated">${monstersDefeated}</span> out of <span class="quest-amount">${activeQuest.amount}</span> <span class="monster-name">${activeQuest.monster}(s)</span> for your quest.`,
            "quest"
          );
          if (monstersDefeated >= activeQuest.amount) {
            log(
              `Quest "<span class="quest-name">${activeQuest.name}</span>" is ready to be turned in!`,
              "success"
            );
            turnInQuestButton.style.display = "block";
          }
        }

        if (experience >= expToNextLevel) {
          levelUp();
        }

        updateStats();
      } else {
        setTimeout(() => {
          let continueFighting = confirm(
            `The ${monster.name} will deal ${monster.damage} damage. Do you want to continue fighting?`
          );
          if (!continueFighting) {
            log(
              `You ran away from the <span class="monster-name">${monster.name}</span>, better luck next time.`,
              "combat"
            );
            return;
          } else {
            health -= monster.damage;
            if (health <= 0) {
              log("You have been defeated!", "error");
              saveYourSoulButton.style.display = "block";
              updateStats();
              return;
            }
            useSlash();
          }
        }, 100);
      }
    } else {
      log("Not enough stamina to use Slash.", "error");
    }
    updateStats();
  }

  function useHeal() {
    if (stamina >= 40) {
      const healAmount = Math.floor(maxHealth * (0.35 + Math.random() * 0.3));
      health += healAmount;
      if (health > maxHealth) health = maxHealth;
      stamina -= 40;
      log(
        `You used Heal and restored <span class="health-restored">${healAmount}</span> health.`,
        "success"
      );
      updateStats();
    } else {
      log("Not enough stamina to use Heal.", "error");
    }
  }

  function manageInventory() {
    const itemName = prompt("Enter the name of the item to equip: ");
    const item = inventory.find(
      (i) => i.name.toLowerCase() === itemName.toLowerCase()
    );
    if (item) {
      if (item.type === "weapon") {
        equippedWeapon = item;
        log(
          `You equipped <span class="item-name">${item.name}</span> as your weapon.`,
          "success"
        );
      } else if (item.type === "armor") {
        equippedArmor = item;
        maxHealth += item.health;
        health += item.health;
        log(
          `You equipped <span class="item-name">${item.name}</span> as your armor.`,
          "success"
        );
      }
    } else {
      log("Item not found in inventory.", "error");
    }
    updateStats();
  }

  function buyHealthPotion() {
    const cost = 100;
    if (gold >= cost) {
      gold -= cost;
      const healthRestored = Math.floor(
        maxHealth * (0.2 + Math.random() * 0.1)
      );
      health += healthRestored;
      if (health > maxHealth) health = maxHealth;
      log(
        `You bought a health potion for <span class="gold-cost">${cost}</span> gold and restored <span class="health-restored">${healthRestored}</span> health.`,
        "success"
      );
    } else {
      log("You don't have enough gold to buy a health potion.", "error");
    }
    updateStats();
  }

  function buyEnergyPotion() {
    const cost = 100;
    if (gold >= cost) {
      gold -= cost;
      const staminaRestored = Math.floor(
        maxStamina * (0.3 + Math.random() * 0.2)
      );
      stamina += staminaRestored;
      if (stamina > maxStamina) stamina = maxStamina;
      log(
        `You bought an energy potion for <span class="gold-cost">${cost}</span> gold and restored <span class="stamina-restored">${staminaRestored}</span> stamina.`,
        "success"
      );
    } else {
      log("You don't have enough gold to buy an energy potion.", "error");
    }
    updateStats();
  }

  // Example items
  inventory.push({ name: "Sword", type: "weapon", damage: 10 });
  inventory.push({ name: "Shield", type: "armor", health: 20 });

  // Initialize stats display
  updateStats();
});

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

  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    header.classList.toggle("dark-mode");
    footer.classList.toggle("dark-mode");
    document.getElementById("game-container").classList.toggle("dark-mode");
  });
});
