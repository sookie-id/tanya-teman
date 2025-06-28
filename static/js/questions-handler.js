import { STORAGE_KEYS } from "./constants.js";


export class QuestionsHandler {
  constructor({questionsData, questionsOrder, questionDivElement, type}) {
    this.questions = [];
    for (const [category, qs] of Object.entries(questionsData)) {
      this.questions.push(...qs.map((text) => ({ text, category })));
    }

    // If questionOrder is not defined, set it to [0, 1, 2, ..., this.questions.length - 1]
    this.questionsOrder = questionsOrder || Array.from({ length: this.questions.length }, (_, i) => i);

    this.questionDivElement = questionDivElement;
    this.type = type;

    this.questionCurrentIndex = parseInt(
      localStorage.getItem(STORAGE_KEYS[this.type].CURRENT) || "0"
    );

    this.showQuestion = this.showQuestion.bind(this);
    this.next = this.next.bind(this);
    this.restart = this.restart.bind(this);
  }

  showQuestion() {
    if (this.questionCurrentIndex >= this.questions.length) {
      this.questionDivElement.innerHTML = `
        <p>🎉 Semua pertanyaan telah dijawab!</p>
        <button onclick="handler.restart()">Start Over</button>
      `;
      return;
    }
    const question = this.questions[this.questionsOrder[this.questionCurrentIndex]];
    this.questionDivElement.innerHTML = `
      ${question.category === 'to_child' ? '<p class="bold">Ditanyakan oleh orang tua ke anak:</p>' : ''}
      ${question.category === 'to_parent' ? '<p class="bold">Ditanyakan oleh anak ke orang tua:</p>' : ''}
      <p>${question.text}</p>
      <button onclick="handler.next()">Lanjut</button>
      <button onclick="handler.restart()">Ulangi</button>
    `;
  }

  next() {
    this.questionCurrentIndex++;
    localStorage.setItem(STORAGE_KEYS[this.type].CURRENT, this.questionCurrentIndex);
    this.showQuestion();
  }

  restart() {
    this.questionCurrentIndex = 0;
    localStorage.removeItem(STORAGE_KEYS[this.type].CURRENT);
    this.showQuestion();
  }
}

