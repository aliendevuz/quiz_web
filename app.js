const enUrl = "https://raw.githubusercontent.com/aliendevuz/quiz_web/refs/heads/main/strings/en.json";
const uzUrl = "https://raw.githubusercontent.com/aliendevuz/quiz_web/refs/heads/main/strings/uz.json";

let enWords = [];
let uzWords = [];

let currentIndex = 0;
let correctCount = 0;

const startScreen = document.querySelector('.start');
const testScreen = document.querySelector('.test');
const resultScreen = document.querySelector('.result');

const startBtn = document.getElementById('start');
const exitBtn = document.getElementById('exit');

const questionEl = document.querySelector('.question p');
const variantsEl = document.querySelector('.variants');

startBtn.addEventListener('click', () => {
  startScreen.classList.add('gone');
  testScreen.classList.remove('gone');
  showQuestion();
});

exitBtn.addEventListener('click', () => {
  location.reload();
});

async function loadData() {
  const [enRes, uzRes] = await Promise.all([fetch(enUrl), fetch(uzUrl)]);
  let enData = await enRes.json();
  let uzData = await uzRes.json();

  const indexes = Array.from({ length: enData.length }, (_, i) => i)
    .sort(() => Math.random() - 0.5)
    .slice(0, 20);

  enWords = indexes.map(i => enData[i]);
  uzWords = indexes.map(i => uzData[i]);

  if (enWords.length > 0 && uzWords.length > 0) {
    startScreen.classList.remove('gone');
  }
}

function showQuestion() {
  if (currentIndex >= enWords.length) {
    showResult();
    return;
  }

  const enWord = enWords[currentIndex].word;
  const correctAnswer = uzWords[currentIndex].word;

  const allAnswers = new Set([correctAnswer]);
  while (allAnswers.size < 4) {
    const randomIndex = Math.floor(Math.random() * uzWords.length);
    allAnswers.add(uzWords[randomIndex].word);
  }

  const shuffledAnswers = Array.from(allAnswers).sort(() => Math.random() - 0.5);

  questionEl.textContent = `${currentIndex + 1}. ${enWord}`;
  variantsEl.innerHTML = '';

  shuffledAnswers.forEach(answer => {
    const div = document.createElement('div');
    div.className = 'variant';
    div.textContent = answer;
    div.addEventListener('click', () => handleAnswerClick(div, answer === correctAnswer));
    variantsEl.appendChild(div);
  });
}

function handleAnswerClick(element, isCorrect) {
  if (isCorrect) {
    element.classList.add('correct');
    correctCount++;
  } else {
    element.classList.add('incorrect');
  }

  const allVariants = document.querySelectorAll('.variant');
  allVariants.forEach(variant => variant.style.pointerEvents = 'none');

  setTimeout(() => {
    currentIndex++;
    showQuestion();
  }, 1000);
}

function showResult() {
  testScreen.classList.add('gone');
  resultScreen.classList.remove('gone');

  const percent = Math.round((correctCount / enWords.length) * 100);
  resultScreen.querySelector('p').textContent = `${percent}%`;
}

loadData();
