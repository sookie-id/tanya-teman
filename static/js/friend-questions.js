import { STORAGE_KEYS } from "./constants.js";
import { QuestionsHandler } from "./questions-handler.js";

const questionDivElement = document.getElementById("question-box");
const TARGET_CATEGORY = "neutral";
let questions = [];
for (const [category, qs] of Object.entries(questionsData)) {
  questions.push(...qs.map((text) => ({ text, category })));
}

function setQuestionsOrder() {
  let firstCategoryQuestions = questions
    .map((q, i) => ({ q, i }))
    .filter((item) => item.q.category === TARGET_CATEGORY);
  let otherQuestions = questions
    .map((q, i) => ({ q, i }))
    .filter((item) => item.q.category !== TARGET_CATEGORY);

  shuffle(firstCategoryQuestions);
  const extraFirstCategoryQuestions = firstCategoryQuestions.slice(5);
  firstCategoryQuestions = firstCategoryQuestions.slice(0, 5);

  otherQuestions = [...otherQuestions, ...extraFirstCategoryQuestions];

  shuffle(otherQuestions);

  const questionsOrder = [
    ...firstCategoryQuestions.slice(0, 5),
    ...otherQuestions,
  ].map((item) => item.i);

  localStorage.setItem(
    STORAGE_KEYS.FRIEND.ORDER,
    JSON.stringify(questionsOrder)
  );

  return questionsOrder;
}

let questionsOrder = JSON.parse(
  localStorage.getItem(STORAGE_KEYS.FRIEND.ORDER) || "null"
);

const handler = new QuestionsHandler({
  questionsData,
  questionsOrder,
  questionDivElement,
  type: "FRIEND",
})
window.handler = handler;

if (!questionsOrder || questionsOrder.length !== questions.length) {
  handler.questionsOrder = setQuestionsOrder();
  handler.questionCurrentIndex = 0;
}


function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.addEventListener("DOMContentLoaded", handler.showQuestion);
