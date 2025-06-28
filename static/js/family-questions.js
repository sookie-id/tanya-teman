import { STORAGE_KEYS } from "./constants.js";
import { QuestionsHandler } from "./questions-handler.js";

const questionDivElement = document.getElementById("question-box");
const TARGET_CATEGORY = "neutral";
let questions = [];
for (const [category, qs] of Object.entries(questionsData)) {
  questions.push(...qs.map((text) => ({ text, category })));
}

function setQuestionsOrder() {
  // Separate questions by category
  let toChildQuestions = questions
    .map((q, i) => ({ q, i }))
    .filter((item) => item.q.category === "to_child");
  let toParentQuestions = questions
    .map((q, i) => ({ q, i }))
    .filter((item) => item.q.category === "to_parent");
  let otherQuestions = questions
    .map((q, i) => ({ q, i }))
    .filter(
      (item) =>
        item.q.category !== "to_child" && item.q.category !== "to_parent"
    );

  // Shuffle each group
  shuffle(toChildQuestions);
  shuffle(toParentQuestions);
  shuffle(otherQuestions);

  // Alternate between to_child and to_parent
  const maxLen = Math.max(toChildQuestions.length, toParentQuestions.length);
  let alternated = [];
  for (let i = 0; i < maxLen; i++) {
    if (i < toChildQuestions.length) alternated.push(toChildQuestions[i]);
    if (i < toParentQuestions.length) alternated.push(toParentQuestions[i]);
  }

  // Add other questions at the end (shuffled)
  alternated = [...alternated, ...otherQuestions];

  const questionsOrder = alternated.map((item) => item.i);

  localStorage.setItem(
    STORAGE_KEYS.FAMILY.ORDER,
    JSON.stringify(questionsOrder)
  );

  return questionsOrder;
}

let questionsOrder = JSON.parse(
  localStorage.getItem(STORAGE_KEYS.FAMILY.ORDER) || "null"
);

const handler = new QuestionsHandler({
  questionsData,
  questionsOrder,
  questionDivElement,
  type: "FAMILY",
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
