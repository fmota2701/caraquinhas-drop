
let players = [];
let items = [];
let currentPlayer = null;

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    players = data.players;
    items = data.items;
  });

function login() {
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
}

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

function logout() {
  currentPlayer = null;
  document.getElementById('nick-input').value = '';
  document.getElementById('items-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
  document.getElementById('login-error').innerText = '';
}
