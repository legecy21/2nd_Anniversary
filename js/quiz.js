/**
 * =========================================================================
 * INTERACTIVE QUIZ ENGINE ("Who Wants to Be a Millionaire" Elimination Logic)
 * =========================================================================
 * - Fully randomized question order on every start/refresh
 * - Fully randomized answer options order (never fixed to A or any position)
 * - Non-consecutive randomization for wrong phrases and celebration GIFs
 */

class RomanticQuiz {
  constructor() {
    this.config = window.STORY_CONFIG;
    this.currentIndex = 0;
    this.currentPendingWrongBtn = null;
    this.isAnswering = false;

    // Active session randomized questions
    this.activeQuestions = [];

    // History tracking to prevent consecutive repeats
    this.lastWrongIndex = -1;
    this.lastCorrectGifIndex = -1;

    // View Sections
    this.introSection = document.getElementById('intro-view');
    this.quizSection = document.getElementById('quiz-view');
    this.flowerSection = document.getElementById('flower-view');
    
    // Quiz Card Elements
    this.stepTag = document.getElementById('quiz-step-tag');
    this.progressBar = document.getElementById('quiz-progress-bar');
    this.questionPrompt = document.getElementById('question-prompt');
    this.questionHint = document.getElementById('question-hint');
    this.optionsContainer = document.getElementById('options-container');

    // Wrong Modal Elements
    this.wrongModal = document.getElementById('wrong-modal');
    this.wrongGif = document.getElementById('wrong-modal-gif');
    this.wrongMessage = document.getElementById('wrong-modal-message');
    this.btnTryAgain = document.getElementById('btn-try-again');

    // Correct Modal Elements
    this.correctModal = document.getElementById('correct-modal');
    this.correctGif = document.getElementById('correct-modal-gif');
    this.correctMessage = document.getElementById('correct-modal-message');
    this.btnContinue = document.getElementById('btn-continue-quiz');

    this.initHeroContent();
    this.initEvents();
  }

  // Fisher-Yates Array Shuffle
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  initHeroContent() {
    const badgeTextEl = document.getElementById('intro-badge-text');
    const introTitle = document.getElementById('intro-title');
    const introDesc = document.getElementById('intro-desc');
    const btnStartText = document.getElementById('btn-start-text');

    if (badgeTextEl && this.config.badgeText) badgeTextEl.textContent = this.config.badgeText;
    if (introTitle && this.config.siteTitle) introTitle.textContent = this.config.siteTitle;
    if (introDesc && this.config.introSubtitle) introDesc.textContent = this.config.introSubtitle;
    if (btnStartText && this.config.startButtonText) btnStartText.textContent = this.config.startButtonText;
  }

  initEvents() {
    const btnStart = document.getElementById('btn-start-quiz');
    if (btnStart) {
      btnStart.addEventListener('click', () => {
        if (window.romanticAudio) {
          window.romanticAudio.start();
          document.getElementById('audio-controller')?.classList.add('audio-playing');
        }
        this.startQuiz();
      });
    }

    if (this.btnTryAgain) {
      this.btnTryAgain.addEventListener('click', () => {
        this.closeWrongModalAndEliminate();
      });
    }

    if (this.btnContinue) {
      this.btnContinue.addEventListener('click', () => {
        this.advanceAfterCorrect();
      });
    }
  }

  startQuiz() {
    this.introSection.classList.remove('active');
    this.quizSection.classList.add('active');
    this.currentIndex = 0;

    // 1. Randomize Question Order every time
    const shuffledRawQuestions = this.shuffle(this.config.questions);

    // 2. Randomize Option Order for every question and track correct index
    this.activeQuestions = shuffledRawQuestions.map((q, idx) => {
      const shuffledOpts = this.shuffle(q.options);
      const correctIdx = shuffledOpts.indexOf(q.correctAnswer);
      return {
        id: idx + 1,
        question: q.question,
        hint: q.hint,
        options: shuffledOpts,
        correctIndex: correctIdx
      };
    });

    this.renderQuestion();
  }

  renderQuestion() {
    const q = this.activeQuestions[this.currentIndex];
    this.isAnswering = false;
    this.currentPendingWrongBtn = null;

    const total = this.activeQuestions.length;
    const currentNum = this.currentIndex + 1;
    this.stepTag.textContent = `Question ${currentNum} of ${total}`;
    this.progressBar.style.width = `${(currentNum / total) * 100}%`;

    this.questionPrompt.textContent = q.question;
    this.questionHint.textContent = q.hint || "";

    // Clear and build options
    this.optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.dataset.index = idx;

      btn.innerHTML = `
        <span class="option-badge">${letters[idx]}</span>
        <span class="option-text">${optText}</span>
      `;

      btn.addEventListener('click', () => this.handleOptionClick(btn, idx));
      this.optionsContainer.appendChild(btn);
    });
  }

  handleOptionClick(btn, index) {
    if (this.isAnswering || btn.classList.contains('eliminated')) return;

    const q = this.activeQuestions[this.currentIndex];
    const isCorrect = (index === q.correctIndex);

    if (isCorrect) {
      this.isAnswering = true;
      btn.classList.add('selected-correct');
      if (window.romanticAudio) window.romanticAudio.playCorrectSound();

      this.launchHeartConfetti();

      setTimeout(() => {
        this.showCorrectModal();
      }, 450);

    } else {
      if (window.romanticAudio) window.romanticAudio.playWrongSound();
      this.currentPendingWrongBtn = btn;
      this.showWrongModal();
    }
  }

  showWrongModal() {
    const phrases = this.config.wrongResponses || [
      "El E7tmam Me4 Bytlb 🙄",
      "Ana F7mt Kol haga 🙄",
      "Kolo Byban 🙄"
    ];

    // Non-consecutive random picker
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * phrases.length);
    } while (nextIdx === this.lastWrongIndex && phrases.length > 1);
    this.lastWrongIndex = nextIdx;

    const selectedPhrase = phrases[nextIdx];
    const wrongGif = this.config.wrongGifUrl || "https://media.giphy.com/media/ZaF4Vl1NQxwaVsStQU/giphy.gif";

    this.wrongGif.src = wrongGif;
    this.wrongMessage.textContent = selectedPhrase;
    this.wrongModal.classList.add('show');
  }

  closeWrongModalAndEliminate() {
    this.wrongModal.classList.remove('show');
    
    // Who Wants to Be a Millionaire elimination effect:
    // The incorrect option dissolves and collapses away!
    if (this.currentPendingWrongBtn) {
      const targetBtn = this.currentPendingWrongBtn;
      setTimeout(() => {
        targetBtn.classList.add('eliminated');
      }, 100);
      this.currentPendingWrongBtn = null;
    }
  }

  showCorrectModal() {
    const gifs = this.config.correctGifs;

    // Non-consecutive random picker for celebration GIFs
    let nextGifIdx;
    do {
      nextGifIdx = Math.floor(Math.random() * gifs.length);
    } while (nextGifIdx === this.lastCorrectGifIndex && gifs.length > 1);
    this.lastCorrectGifIndex = nextGifIdx;

    const selectedGif = gifs[nextGifIdx];
    this.correctGif.src = selectedGif;
    this.correctMessage.textContent = this.config.correctMessage || "Bravo 3leky Ya maramero 😘❤️";

    const isLast = (this.currentIndex === this.activeQuestions.length - 1);
    if (isLast) {
      this.btnContinue.innerHTML = `<span>See Your Bouquet</span> <span>💐</span>`;
    } else {
      this.btnContinue.innerHTML = `<span>Next Question</span> <span>→</span>`;
    }

    this.correctModal.classList.add('show');
  }

  advanceAfterCorrect() {
    this.correctModal.classList.remove('show');

    if (this.currentIndex < this.activeQuestions.length - 1) {
      this.currentIndex++;
      this.renderQuestion();
    } else {
      this.finishQuizAndShowFlowers();
    }
  }

  launchHeartConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#fb7185', '#fda4af', '#f5c26b', '#ffffff'],
        shapes: ['circle']
      });
    }
  }

  finishQuizAndShowFlowers() {
    this.quizSection.classList.remove('active');
    this.flowerSection.classList.add('active');

    // Grand Finale Confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 140,
        spread: 110,
        origin: { y: 0.5 },
        colors: ['#e11d48', '#f43f5e', '#fb7185', '#facc15', '#ffffff']
      });
    }

    if (window.romanticAudio) window.romanticAudio.playBloomSound();

    // Trigger 3D Bouquet Bloom
    if (window.flower3DEngine) {
      window.flower3DEngine.initAndBloom();
    }
  }
}

window.romanticQuiz = new RomanticQuiz();
