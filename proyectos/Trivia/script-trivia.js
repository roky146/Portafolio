const quizData = [
  {
    question: "¿Qué método convierte JSON a objeto?",
    options: ["stringify()", "parse()", "toObject()", "JSON.stringify"],
    answer: "parse()"
  },
  {
    question: "¿Cuál es el símbolo del operador de igualdad estricta?",
    options: ["==", "=", "===", "!=="],
    answer: "==="
  },
  {
    question: "¿Qué tipo de variable permite reasignación con let?",
    options: ["const", "var", "let", "int"],
    answer: "let"
  },
  {
    question: "¿Qué método añade un elemento al final de un array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    answer: "push()"
  },
  {
    question: "¿Qué método crea un nuevo array con los resultados de llamar a una función?",
    options: ["forEach()", "map()", "filter()", "reduce()"],
    answer: "map()"
  },
  {
    question: "¿Qué propiedad devuelve la longitud de un string?",
    options: ["size", "length", "count", "items"],
    answer: "length"
  }
];

const questionEl = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const resultContainer = document.getElementById('result-container');
const finalScoreEl = document.getElementById('final-score');
const historyEl = document.getElementById('history');
const restartBtn = document.getElementById('restart-btn');
const progressBar = document.getElementById('progress-bar');

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;
let quizHistory = JSON.parse(localStorage.getItem('quizHistory')) || [];

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  updateScore();
  showQuestion();
}

function showQuestion() {
  resetTimer();
  startTimer();
  
  const question = quizData[currentQuestion];
  questionEl.textContent = question.question;
  optionsContainer.innerHTML = '';
  
  question.options.forEach(option => {
    const button = document.createElement('button');
    button.textContent = option;
    button.classList.add('option-btn');
    button.addEventListener('click', () => selectAnswer(option));
    optionsContainer.appendChild(button);
  });
  
  updateProgress();
}

function updateProgress() {
  const progress = ((currentQuestion) / quizData.length) * 100;
  progressBar.style.width = `${progress}%`;
}

function selectAnswer(selectedOption) {
  clearInterval(timer);
  
  const correctAnswer = quizData[currentQuestion].answer;
  const options = document.querySelectorAll('.option-btn');
  
  options.forEach(option => {
    option.disabled = true;
    if (option.textContent === correctAnswer) {
      option.classList.add('correct');
    } else if (option.textContent === selectedOption && selectedOption !== correctAnswer) {
      option.classList.add('incorrect');
    }
  });
  
  if (selectedOption === correctAnswer) {
    score++;
    updateScore();
    feedbackEl.textContent = "¡Correcto!";
    feedbackEl.style.color = "var(--correct)";
  } else {
    feedbackEl.textContent = `Incorrecto. La respuesta correcta es: ${correctAnswer}`;
    feedbackEl.style.color = "var(--incorrect)";
  }
  
  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      showQuestion();
      feedbackEl.textContent = '';
    } else {
      showResult();
    }
  }, 1500);
}

function startTimer() {
  timeLeft = 10;
  timerEl.textContent = `Tiempo: ${timeLeft}`;
  
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Tiempo: ${timeLeft}`;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      feedbackEl.textContent = "¡Tiempo agotado!";
      feedbackEl.style.color = "var(--incorrect)";
      
      setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
          showQuestion();
          feedbackEl.textContent = '';
        } else {
          showResult();
        }
      }, 1000);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 10;
  timerEl.textContent = `Tiempo: ${timeLeft}`;
}

function updateScore() {
  scoreEl.textContent = `Puntaje: ${score}`;
}

function showResult() {
  clearInterval(timer); // Asegurarse de detener el temporizador
  progressBar.style.width = '100%'; // Llenar completamente la barra de progreso
  
  document.getElementById('question-container').classList.add('hidden');
  resultContainer.classList.remove('hidden');
  
  finalScoreEl.textContent = `Obtuviste ${score} de ${quizData.length} puntos`;
  
  // Guardar historial
  const attempt = {
    date: new Date().toLocaleString(),
    score: score,
    total: quizData.length
  };
  
  quizHistory.push(attempt);
  localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
  
  // Mostrar historial
  historyEl.innerHTML = '<h3>Intentos anteriores:</h3>';
  quizHistory.slice().reverse().forEach((attempt, index) => {
    if (index >= 5) return;
    
    const item = document.createElement('div');
    item.classList.add('history-item');
    item.innerHTML = `
      <p><strong>Fecha:</strong> ${attempt.date}</p>
      <p><strong>Puntaje:</strong> ${attempt.score}/${attempt.total}</p>
    `;
    historyEl.appendChild(item);
  });
}

restartBtn.addEventListener('click', () => {
  resultContainer.classList.add('hidden');
  document.getElementById('question-container').classList.remove('hidden');
  startQuiz();
});

// Iniciar el quiz al cargar
startQuiz();