//Representa el tablero de juego X=> columnas, y => filas
let board = [];

//variables globales
let boardShoots = [];
let boards = 0;
let puntos = 0;
let fallos = 0;
let aguas = 0;
let numbers1 = 0;
let totalNumbers = 0;
let probability1 = 0;

//CONSTANTES globales
const BOARD_EXIST = 1;
const BOARD_NOT_EXIST = 0;
const BOARD_SIZE = 7;
const PROBABILITY_1 = 0.3;
const MAX_RANDOM_NUMBERS = 2;

//Calcula un número aleatorio
function getNumber() {
  const random = Math.random() * MAX_RANDOM_NUMBERS;
  const value = Math.floor(random);

  totalNumbers++;
  probability1 = numbers1 / totalNumbers;
  if (probability1 > PROBABILITY_1) return 0;
  if (value === 1) numbers1++;
  return value;
}

//Genera un nuevo tablero aleatorio
const generateBoard = () => {
  numbers1 = 0;
  totalNumbers = 0;
  probability1 = 0;

  for (let i = 0; i < BOARD_SIZE; i++) {
    board[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      board[i][j] = getNumber();
    }
  }
};

/**
 * Recibe las posiciones x,y
 * @param {in} position 
 * @returns 0 si no hay barco o 1 si hay barco
 */
const checkPosition = (x, y) => {
  if (isNaN(x) || x > board.length || typeof x === Number) return false;
  if (isNaN(y) || y > board.length || typeof y === Number) return false;

  return board[y][x];
};

/**
 * Conta os '1' da matriz 
 */
const getBoards = () => {
  let boards = 0;
  board.forEach(fila => {
    fila.forEach(valor => {
      if (valor === BOARD_EXIST) boards++;
    });
  });
  return boards;
};

/**
 * Muestra el panel en el HTML
 */
const showBoard = () => {
  const containerBoardHTML = document.querySelector("#board");
  const table = document.createElement("table");
  const tBody = table.createTBody();

  for (let row = 0; row < board.length; row++) {
    const tr = document.createElement("tr");
    tBody.appendChild(tr);

    for (let col = 0; col < board[row].length; col++) {
      const td = document.createElement("td");
      td.setAttribute("onclick", `showResult(${col},${row})`);
      td.setAttribute("data-position", `${col},${row}`);
      td.setAttribute("class", "td");
      tr.appendChild(td);
    }
  }

  //Reseteamos os valores
  containerBoardHTML.innerHTML = "";
  puntos = 0;
  fallos = 0;
  boards = 0;
  reloadPuntuacion();
  reloadShoots();

  //calculamos valores
  boards = getBoards();
  if (aguas === 0) aguas = getAguas();

  reloadAguas();
  containerBoardHTML.appendChild(table);
};

//Devolve o número de aguas
const getAguas = () => {
  return BOARD_SIZE * BOARD_SIZE - boards;
};

//Recarga o número de aguas
const reloadAguas = () => {
  document.getElementById("agua").textContent = aguas;
};

//Rearga o número de disparos
const reloadShoots = () => {
  for (let i = 0; i < BOARD_SIZE; i++) {
    boardShoots[i] = [];
    for (let j = 0; j < BOARD_SIZE; j++) {
      boardShoots[i][j] = 0;
    }
  }
};

/**
 * Refresca o valor da puntuación
 */
const reloadPuntuacion = () => {
  document.querySelector("#puntuacion").innerHTML = puntos;
};

//Devolve se finalizou o xogo
const isFinishGame = () => {
  return isWinGame() || isLoseGame();
};

//Devolve se o xogador gañou
const isWinGame = () => {
  return puntos === boards;
};

//Devolve se o xogador perdeu
const isLoseGame = () => {
  return BOARD_SIZE * BOARD_SIZE - boards === fallos;
};

/**
 * Mostra se o usuario acertou a celda seleccionada
 */
const showResult = (x, y) => {
  let celda = document.querySelector(`td[data-position='${x},${y}']`);

  if (boardShoots[x][y] === 0) {
    if (checkPosition(x, y) === BOARD_EXIST) {
      celda.setAttribute("class", "td valid");
      celda.textContent = "O";
      puntos++;
      reloadPuntuacion();
    } else {
      celda.setAttribute("class", "td not-valid");
      celda.textContent = "X";
      fallos++;
    }
    boardShoots[x][y] = 1;
  }

  if (isFinishGame()) showAlert();
};

/**
 * Función que se usa cando xogamos mediante o formulario
 */
const disparar = () => {
  const celdaX = document.getElementById("x");
  const celdaY = document.getElementById("y");

  const x = celdaX.valueAsNumber;
  const y = celdaY.valueAsNumber;

  showResult(x, y);
};

//Mostra a alerta de fin do xogo
const showAlert = () => {
  const containerModal = document.querySelector(".container-modal");
  const modalTitle = document.querySelector(".modal-title");

  if (isLoseGame()) {
    modalTitle.textContent = "Has fallado!";
    containerModal.style.visibility = "visible";
  }
  if (isWinGame()) {
    modalTitle.textContent = "Has ganado!";
    containerModal.style.visibility = "visible";
  }
};

//Pecha a alerta
const closeAlert = () => {
  const containerModal = document.querySelector(".container-modal");
  containerModal.style.visibility = "hidden";
};

//Desabilita o xogo
const disableLayout = () => {
  const formInputs = document.querySelectorAll("form input");
  const tds = document.querySelectorAll("td");

  formInputs.forEach(input => {
    input.disabled = true;
  });

  tds.forEach(td => {
    td.style.cursor = "default";
    td.setAttribute("onclick", "");
  });
};

//volve a habilitar os botóns
const enableLayout = () => {
  const formInputs = document.querySelectorAll("form input");

  formInputs.forEach(input => {
    input.disabled = false;
  });
};

//Método que inicia un novo xogo
const newGame = () => {
  enableLayout();
  generateBoard();
  showBoard();
};

//Función anónima autoinvocada que inicia o xogo
(() => {
  newGame();
})();
