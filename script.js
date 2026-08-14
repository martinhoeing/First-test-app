const display = document.querySelector('#display');
const form = document.querySelector('#taskForm');
const userInput = document.querySelector('#taskInput');

const API_URL = 'http://127.0.0.1:8000/tasks';

async function loadTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  const oneTask = tasks.map(task => `<li style="text-decoration: ${task.done ? 'line-through' : 'none'}"> ${task.text} <button class="delete-btn" data-id="${task.id}">Delete</button> <button class="complete-btn" data-id="${task.id}">Done</button></li>`).join('');
  display.innerHTML = `<ul>${oneTask}</ul>`;
}

loadTasks();

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const inputValue = userInput.value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Date.now(), text: inputValue, done: false })
  });

  loadTasks();
  userInput.value = '';
});

display.addEventListener("click", async (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const idToDelete = Number(event.target.dataset.id);
    await fetch(`${API_URL}/${idToDelete}`, { method: "DELETE"});
    loadTasks();
  } else if (event.target.classList.contains("complete-btn")) {
    const idToComplete = Number(event.target.dataset.id);
    
    const response = await fetch(API_URL);
    const currentTasks = await response.json();
    const task = currentTasks.find(t => t.id === idToComplete);

    await fetch(`${API_URL}/${idToComplete}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: task.id, text: task.text, done: !task.done })
    });

    loadTasks();
  }
});