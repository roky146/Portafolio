document.addEventListener('DOMContentLoaded', function() {
  const taskInput = document.getElementById('taskInput');
  const addBtn = document.getElementById('addBtn');
  const sortBtn = document.getElementById('sortBtn');
  const searchInput = document.getElementById('searchInput');
  const taskList = document.getElementById('taskList');
  
  // Cargar tareas desde localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  // Renderizar tareas
  function renderTasks(tasksToRender = tasks) {
    taskList.innerHTML = '';
    tasksToRender.forEach((task, index) => {
      const li = document.createElement('li');
      li.dataset.id = index;
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => toggleTask(index));
      
      const span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;
      if (task.completed) span.classList.add('completed');
      
      // Editar al hacer doble clic
      span.addEventListener('dblclick', () => editTask(index, span));
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '🗑️';
      deleteBtn.addEventListener('click', () => deleteTask(index));
      
      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }
  
  // Añadir nueva tarea
  function addTask() {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text, completed: false });
      saveAndRender();
      taskInput.value = '';
      taskInput.focus();
    }
  }
  
  // Eliminar tarea
  function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRender();
  }
  
  // Cambiar estado de tarea
  function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
  }
  
  // Editar tarea
  function editTask(index, spanElement) {
    const newText = prompt('Editar tarea:', tasks[index].text);
    if (newText !== null && newText.trim() !== '') {
      tasks[index].text = newText.trim();
      saveAndRender();
    }
  }
  
  // Ordenar tareas alfabéticamente
  function sortTasks() {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    saveAndRender();
  }
  
  // Filtrar tareas
  function filterTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
      task.text.toLowerCase().includes(searchTerm)
    );
    renderTasks(filteredTasks);
  }
  
  // Guardar y renderizar
  function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }
  
  // Event listeners
  addBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });
  sortBtn.addEventListener('click', sortTasks);
  searchInput.addEventListener('input', filterTasks);
  
  // Renderizar al cargar
  renderTasks();
});