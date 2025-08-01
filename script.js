
// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCXB6lJFAVcBNQ5VFp0Pbr-wuZbEp5m4AQ",
  authDomain: "caraquinhas-drop.firebaseapp.com",
  databaseURL: "https://caraquinhas-drop-default-rtdb.firebaseio.com",
  projectId: "caraquinhas-drop",
  storageBucket: "caraquinhas-drop.firebasestorage.app",
  messagingSenderId: "102170747527",
  appId: "1:102170747527:web:a21c2bbd0fcefd31684e22"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let players = [];
let items = [];
let currentPlayer = null;

// Carregar jogadores e itens do Firebase
async function loadData() {
  const snapshot = await get(ref(db));
  const data = snapshot.val();
  players = data.players || [];
  items = data.items || [];
}

loadData();

window.login = async function() {
  await loadData();
  const nick = document.getElementById('nick-input').value.trim();
  const player = players.find(p => p.nick.toLowerCase() === nick.toLowerCase());

  if (!player) {
    document.getElementById('login-error').innerText = "Nick não encontrado.";
    return;
  }

  currentPlayer = player;
  document.getElementById('login-section').style.display = 'none';
  document.getElementById('items-section').style.display = 'block';
  showAvailableItems();
};

function showAvailableItems() {
  const list = document.getElementById('item-list');
  list.innerHTML = '';

  const eligibleItems = items.filter(item => {
    return currentPlayer.cp >= item.cp_min && currentPlayer.lvl >= item.lvl_min;
  });

  if (eligibleItems.length === 0) {
    list.innerHTML = '<li>Nenhum item disponível para você.</li>';
  } else {
    eligibleItems.forEach(item => {
      const li = document.createElement('li');
      li.innerText = `${item.nome} (CP min: ${item.cp_min}, Nível min: ${item.lvl_min})`;
      list.appendChild(li);
    });
  }
}

window.logout = function() {
  currentPlayer = null;
  document.getElementById('nick-input').value = '';
  document.getElementById('items-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('login-error').innerText = '';
};
