const attackValue = 10;
const monsterAttackValue = 14;
const strongAttackValue = 17;
const healValue = 20;
let lastLoggedEntry;
let battleLog = [];
let MODE_ATTACK = "ATTACK";
let MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_STRONG_PLAYER_ATTACK = "STRONG_PLAYER_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
const LOG_EVENT_PLAYER_BONUS_LIFE = "PLAYER BONUS LIFE";

function getMaxLifeValues() {
  let enteredValue = prompt("Maximum for you and Monster.", "100");
  const parsedValue = parseInt(enteredValue);

  return parsedValue;
}
let chooseMaxLife;
try {
  chooseMaxLife = getMaxLifeValues();
  if (isNaN(chooseMaxLife) || chooseMaxLife <= 0) {
    throw { message: "Invalid input" };
  }
} catch (e) {
  console.log(e);
  chooseMaxLife = 100;
  alert(`default value taken`);
}
let currentMonsterLife = chooseMaxLife;
let currentPlayerLife = chooseMaxLife;
let hasBonusLife = true;
adjustHealthBars(chooseMaxLife);
function writeToLog(ev, val, monsterHealth, playerHealth) {
  let logEntry = {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };
  switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_STRONG_PLAYER_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = "PLAYER";
      break;
    default:
      logEntry = {};
  }
  battleLog.push(logEntry);
}
function reset() {
  currentPlayerLife = chooseMaxLife;
  currentMonsterLife = chooseMaxLife;
  resetGame(chooseMaxLife);
}
function endRound() {
  const initialHealth = currentPlayerLife;
  const playerDamage = dealPlayerDamage(monsterAttackValue);
  currentPlayerLife = currentPlayerLife - playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterLife,
    currentPlayerLife
  );
  if (currentPlayerLife <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    let bonusValue = initialHealth - currentPlayerLife;
    currentPlayerLife = initialHealth;
    setPlayerHealth(initialHealth);
    writeToLog(
      LOG_EVENT_PLAYER_BONUS_LIFE,
      bonusValue,
      currentMonsterLife,
      currentPlayerLife
    );
    alert("you would have died but bonus life saved you.");
  }
  if (currentMonsterLife <= 0 && currentPlayerLife > 0) {
    alert("You Won");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "Player Won",
      currentMonsterLife,
      currentPlayerLife
    );
  } else if (currentPlayerLife <= 0 && currentMonsterLife > 0) {
    alert("You Lost");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "Monster Won",
      currentMonsterLife,
      currentPlayerLife
    );
  } else if (currentMonsterLife === 0 && currentPlayerLife === 0) {
    alert("You have a draw");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A Draw",
      currentMonsterLife,
      currentPlayerLife
    );
  }
  if (currentMonsterLife <= 0 || currentPlayerLife <= 0) {
    reset();
  }
}
function attackMonster(mode) {
  let maxDamage = mode === MODE_ATTACK ? attackValue : strongAttackValue;
  let logEvent = MODE_ATTACK
    ? LOG_EVENT_PLAYER_ATTACK
    : LOG_EVENT_STRONG_PLAYER_ATTACK;

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterLife = currentMonsterLife - damage;
  writeToLog(logEvent, damage, currentMonsterLife, currentPlayerLife);
  endRound();
}
function attackHandler() {
  attackMonster(MODE_ATTACK);
}
function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
}
function healPlayerHandler() {
  let heal_value;
  if (currentPlayerLife >= chooseMaxLife - healValue) {
    alert("You can't heal more than your max initial health");
    heal_value = chooseMaxLife - currentPlayerLife;
  } else {
    heal_value = healValue;
  }
  increasePlayerHealth(heal_value);
  currentPlayerLife = currentPlayerLife + heal_value;
  endRound();
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    heal_value,
    currentMonsterLife,
    currentPlayerLife
  );
}
function printLogHandler() {
  // for (let i = 0; i < battleLog.length; i++) {
  //   console.log(battleLog[i]);
  // }
  // let i = 3;
  // do {
  //   i++;
  //   console.log(i);
  // } while (i < 3);

  let i = 0;
  for (const element of battleLog) {
    if ((!lastLoggedEntry && lastLoggedEntry != 0) || lastLoggedEntry < i) {
      console.log(`#${i}`);
      for (const key in element) {
        console.log(element[key]);
      }
      lastLoggedEntry = i;
      break;
    }
    i++;
  }
}
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
