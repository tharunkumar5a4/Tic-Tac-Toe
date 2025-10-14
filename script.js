// Tic-Tac-Toe logic (two-player + optional simple CPU)
// Save this file as script.js and make sure index.html links it

(() => {
  const cells = Array.from(document.querySelectorAll('.cell'));
  const turnEl = document.getElementById('turn');
  const restartBtn = document.getElementById('restart');
  const aiToggle = document.getElementById('aiToggle');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreDEl = document.getElementById('scoreD');

  let board = Array(9).fill(null); // null, 'X' or 'O'
  let current = 'X';
  let playing = true;
  let vsAI = false;
  let scores = { X: 0, O: 0, D: 0 };

  const winCombos = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diags
  ];

  function render() {
    // update cells
    cells.forEach((c, i) => {
      c.classList.remove('x','o','win');
      c.disabled = !playing || board[i] !== null;
      if (board[i]) {
        c.textContent = board[i];
        c.classList.add(board[i].toLowerCase());
      } else {
        c.textContent = '';
      }
    });
    turnEl.textContent = current;
  }

  function checkWin() {
    for (const combo of winCombos) {
      const [a,b,c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], combo };
      }
    }
    if (board.every(Boolean)) return { winner: null }; // draw
    return null; // no result
  }

  function showWin(w) {
    if (w.combo) {
      w.combo.forEach(i => cells[i].classList.add('win'));
    }
    if (w.winner === 'X') scores.X++;
    else if (w.winner === 'O') scores.O++;
    else scores.D++;
    updateScoreboard();
  }

  function updateScoreboard() {
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDEl.textContent = scores.D;
  }

  function makeMove(index) {
    if (!playing || board[index]) return;
    board[index] = current;
    const res = checkWin();
    if (res) {
      playing = false;
      showWin(res);
      setTimeout(() => {
        if (res.winner) alert(`${res.winner} wins!`);
        else alert(`It's a draw!`);
      }, 80);
      render();
      return;
    }
    // next turn
    current = current === 'X' ? 'O' : 'X';
    render();

    // if vsAI and it's O's turn (AI plays O)
    if (vsAI && current === 'O' && playing) {
      setTimeout(aiMove, 300);
    }
  }

  // Simple AI: choose winning move > blocking move > center > random
  function aiMove() {
    // try to win
    for (let i=0;i<9;i++){
      if (!board[i]) {
        board[i] = 'O';
        if (checkWin()?.winner === 'O') {
          finalizeAIMove(i);
          return;
        }
        board[i] = null;
      }
    }
    // try to block X
    for (let i=0;i<9;i++){
      if (!board[i]) {
        board[i] = 'X';
        if (checkWin()?.winner === 'X') {
          board[i] = 'O';
          finalizeAIMove(i);
          return;
        }
        board[i] = null;
      }
    }
    // take center
    if (!board[4]) {
      board[4] = 'O';
      finalizeAIMove(4);
      return;
    }
    // random
    const empties = board.map((v,i)=> v?null:i).filter(Number.isFinite);
    const choice = empties[Math.floor(Math.random()*empties.length)];
    board[choice] = 'O';
    finalizeAIMove(choice);
  }

  function finalizeAIMove(i) {
    render();
    const res = checkWin();
    if (res) {
      playing = false;
      showWin(res);
      setTimeout(() => {
        if (res.winner) alert(`${res.winner} wins!`);
        else alert(`It's a draw!`);
      }, 80);
      return;
    }
    current = 'X';
    render();
  }

  // event handlers
  cells.forEach((cell, idx) => {
    cell.addEventListener('click', () => makeMove(Number(cell.dataset.index)));
  });

  restartBtn.addEventListener('click', () => {
    board.fill(null);
    current = 'X';
    playing = true;
    cells.forEach(c => c.classList.remove('win'));
    render();
  });

  aiToggle.addEventListener('click', () => {
    vsAI = !vsAI;
    aiToggle.textContent = vsAI ? 'Play vs Computer: On' : 'Play vs Computer: Off';
    // reset board when toggling to avoid confusion
    board.fill(null);
    current = 'X';
    playing = true;
    cells.forEach(c => c.classList.remove('win'));
    render();
  });

  // keyboard: allow R to restart
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') restartBtn.click();
  });

  // initial render
  render();
  updateScoreboard();
})();
