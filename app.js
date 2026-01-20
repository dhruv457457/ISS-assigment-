/* -------- NAV -------- */
const buttons = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view");

buttons.forEach(btn => {
  btn.onclick = () => {
    buttons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    views.forEach(v => v.classList.add("hidden"));
    document.getElementById(`view-${btn.dataset.view}`)
      .classList.remove("hidden");
  };
});

/* -------- PLAYFAIR LOGIC -------- */

function generateKeyMatrix(key) {
  key = (key || "").toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  let used = new Set();
  let arr = [];

  for (let c of key) if (!used.has(c)) {
    used.add(c); arr.push(c);
  }

  for (let i = 65; i <= 90; i++) {
    let c = String.fromCharCode(i);
    if (c !== 'J' && !used.has(c)) arr.push(c);
  }

  return Array.from({ length: 5 }, (_, i) => arr.slice(i * 5, i * 5 + 5));
}

function updateMatrixVisual() {
  const matrix = generateKeyMatrix(globalKey.value);
  matrixDisplay.innerHTML = "";
  matrix.flat().forEach(c => {
    const d = document.createElement("div");
    d.textContent = c;
    d.className = "w-10 h-10 flex items-center justify-center rounded border text-sm";
    matrixDisplay.appendChild(d);
  });
}

function formatText(t) {
  t = t.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  let r = "";
  for (let i = 0; i < t.length; i++) {
    if (t[i] === t[i + 1]) r += t[i] + "X";
    else r += t[i] + (t[i + 1] || "X"), i++;
  }
  return r;
}

function find(m, c) {
  for (let r = 0; r < 5; r++)
    for (let col = 0; col < 5; col++)
      if (m[r][col] === c) return { r, col };
}

function process(mode) {
  if (!globalKey.value) return alert("Enter key first");
  const m = generateKeyMatrix(globalKey.value);
  let text = mode === "encrypt"
    ? formatText(plaintext.value)
    : ciphertextInput.value.toUpperCase().replace(/[^A-Z]/g, "");

  let out = "";
  for (let i = 0; i < text.length; i += 2) {
    let a = find(m, text[i]), b = find(m, text[i + 1]);
    if (a.r === b.r) {
      let s = mode === "encrypt" ? 1 : 4;
      out += m[a.r][(a.col + s) % 5] + m[b.r][(b.col + s) % 5];
    } else if (a.col === b.col) {
      let s = mode === "encrypt" ? 1 : 4;
      out += m[(a.r + s) % 5][a.col] + m[(b.r + s) % 5][b.col];
    } else {
      out += m[a.r][b.col] + m[b.r][a.col];
    }
  }

  mode === "encrypt"
    ? ciphertextResult.value = out
    : plaintextResult.textContent = out;
}

function encrypt() { process("encrypt"); }
function decrypt() { process("decrypt"); }

updateMatrixVisual();
