const box = document.getElementById("question-box");
let current = parseInt(localStorage.getItem("currentQuestion") || "0");

const TARGET_CATEGORY = "neutral";
let questions = [];
for (const [category, qs] of Object.entries(questionsData)) {
  questions.push(...qs.map(text => ({ text, category })));
}
function setQuestionOrder() {
  let firstCategoryQuestions = questions
    .map((q, i) => ({ q, i }))
    .filter(item => item.q.category === TARGET_CATEGORY);
  let otherQuestions = questions
    .map((q, i) => ({ q, i }))
    .filter(item => item.q.category !== TARGET_CATEGORY);

  shuffle(firstCategoryQuestions);
  const extraFirstCategoryQuestions = firstCategoryQuestions.slice(5);
  firstCategoryQuestions = firstCategoryQuestions.slice(0, 5);

  otherQuestions = [
    ...otherQuestions,
    ...extraFirstCategoryQuestions
  ];

  shuffle(otherQuestions);

  const questionOrder = [
    ...firstCategoryQuestions.slice(0, 5),
    ...otherQuestions
  ].map(item => item.i);
  localStorage.setItem("questionOrder", JSON.stringify(questionOrder));
}

let questionOrder = JSON.parse(localStorage.getItem("questionOrder") || "null");
if (!questionOrder || questionOrder.length !== questions.length) {
  setQuestionOrder();
  current = 0;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showQuestion() {
  if (current >= questions.length) {
    box.innerHTML = `
      <p>🎉 All questions are done!</p>
      <button onclick="restart()">Start Over</button>
    `;
    return;
  }
  const q = questions[questionOrder[current]];
  box.innerHTML = `
    <p>${q.text}</p>
    <button onclick="next()">Lanjut</button>
    <button onclick="restart()">Ulangi</button>
  `;
}


function next() {
  current++;
  localStorage.setItem("currentQuestion", current);
  showQuestion();
}

function restart() {
  current = 0;
  localStorage.removeItem("currentQuestion");
  showQuestion();
}

document.addEventListener("DOMContentLoaded", showQuestion);
