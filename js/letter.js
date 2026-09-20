/**
 * =========================================================================
 * WAX-SEALED LOVE LETTER LOGIC (With Direct Close 'X' & Return Controls)
 * =========================================================================
 */

class RomanticLetterManager {
  constructor() {
    this.config = window.STORY_CONFIG.letter;
    this.modal = document.getElementById('letter-modal');
    this.envelope = document.getElementById('wax-envelope');
    this.letterSheet = document.getElementById('letter-sheet');
    this.letterTitle = document.getElementById('letter-title');
    this.letterBody = document.getElementById('letter-body');
    this.letterSignoff = document.getElementById('letter-signature');

    this.btnOpenModal = document.getElementById('btn-open-letter-modal');
    this.btnCloseModal = document.getElementById('btn-close-letter');
    this.btnReturnToBouquet = document.getElementById('btn-return-to-bouquet');

    this.isUnsealed = false;
    this.initEvents();
  }

  initEvents() {
    // Open Letter Modal from 3D Bouquet dock
    if (this.btnOpenModal) {
      this.btnOpenModal.addEventListener('click', () => {
        this.openModal();
      });
    }

    // Click Wax Seal to Unseal
    if (this.envelope) {
      this.envelope.addEventListener('click', () => {
        this.unsealEnvelope();
      });
    }

    // Close Letter via 'X' Button
    if (this.btnCloseModal) {
      this.btnCloseModal.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeModal();
      });
    }

    // Close Letter via secondary bottom return button
    if (this.btnReturnToBouquet) {
      this.btnReturnToBouquet.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeModal();
      });
    }

    // Close Letter when clicking dark backdrop outside letter sheet
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.closeModal();
        }
      });
    }

    // Close on Escape Key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('show')) {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.modal.classList.add('show');
    if (!this.isUnsealed) {
      this.envelope.style.display = 'block';
      this.letterSheet.style.display = 'none';
    } else {
      this.envelope.style.display = 'none';
      this.letterSheet.style.display = 'block';
    }
  }

  closeModal() {
    this.modal.classList.remove('show');
  }

  unsealEnvelope() {
    if (this.isUnsealed) return;
    this.isUnsealed = true;

    if (window.romanticAudio) {
      window.romanticAudio.playSealSound();
    }

    // Wax seal crack animation
    this.envelope.style.transform = 'scale(0.95)';
    this.envelope.style.opacity = '0.4';

    setTimeout(() => {
      this.envelope.style.display = 'none';
      this.renderLetterContent();
      this.letterSheet.style.display = 'block';

      // Celebratory Confetti shower for the letter
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 55,
          spread: 85,
          origin: { y: 0.5 },
          colors: ['#fda4af', '#f43f5e', '#be123c', '#f5c26b']
        });
      }
    }, 400);
  }

  renderLetterContent() {
    this.letterTitle.textContent = this.config.title;
    this.letterBody.innerHTML = '';

    this.config.paragraphs.forEach(pText => {
      const p = document.createElement('p');
      p.textContent = pText;
      this.letterBody.appendChild(p);
    });

    this.letterSignoff.textContent = this.config.signatureName || this.config.signature;
  }
}

window.letterManager = new RomanticLetterManager();
