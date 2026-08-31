document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';

  // Función para renderizar tareas
  function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, originalIndex) => {
      // Aplicar filtro sin perder el índice real
      if (currentFilter === 'pending' && task.completed) return;
      if (currentFilter === 'completed' && !task.completed) return;

      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;

      li.innerHTML = `
        <span>${task.text} - <strong>${task.priority}</strong> (${task.date})</span>
        <div>
          <button class="btn-toggle">✓</button>
          <button class="btn-delete">X</button>
        </div>
      `;

      // Eventos directos sobre los botones
      li.querySelector('.btn-toggle').addEventListener('click', () => {
        tasks[originalIndex].completed = !tasks[originalIndex].completed;
        saveAndRender();
      });

      li.querySelector('.btn-delete').addEventListener('click', () => {
        tasks.splice(originalIndex, 1);
        saveAndRender();
      });

      taskList.appendChild(li);
    });
  }

  // Guardar en localStorage y re-renderizar
  function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }

  // Agregar tarea
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newTask = {
      text: document.getElementById('task-input').value,
      priority: document.getElementById('task-priority').value,
      date: document.getElementById('task-date').value,
      completed: false
    };

    tasks.push(newTask);
    saveAndRender();
    taskForm.reset();
  });

  // Eventos de los botones de filtro
  document.querySelectorAll('.filters button').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  // Carga inicial
  renderTasks();
});