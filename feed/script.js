/* ══════════════════════════════════════════
   CAMPUSLINK — FEED — SCRIPT.JS
══════════════════════════════════════════ */

/**
 * Alterna o estado de curtida de um post.
 * Adiciona/remove a classe "liked" e atualiza o contador.
 * @param {HTMLButtonElement} btn - Botão de curtida clicado
 */
function toggleLike(btn) {
  const isLiked = btn.classList.toggle('liked');
  const num = parseInt(btn.textContent.trim()) + (isLiked ? 1 : -1);
  btn.innerHTML = `<i class="fa fa-heart"></i> ${num}`;
}

/**
 * Alterna o estado de "seguir/seguindo" nas sugestões.
 * @param {HTMLButtonElement} btn - Botão de seguir clicado
 */
function toggleFollow(btn) {
  const following = btn.classList.toggle('following');
  btn.textContent = following ? 'Seguindo' : 'Seguir';
}

/**
 * Animação de entrada dos cards ao entrar na viewport.
 * Usa IntersectionObserver para performance otimizada.
 */
function initPostAnimations() {
  const cards = document.querySelectorAll('.post-card');
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    },
    { threshold: 0.1 }
  );
  cards.forEach(card => observer.observe(card));
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initPostAnimations();
});
