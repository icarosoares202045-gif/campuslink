
let currentStep = 1;
const TOTAL_STEPS = 3;

const STEP_TITLES = ['Crie sua conta', 'Defina sua senha', 'Quase lá!'];
const STEP_DESCS  = ['Dados pessoais', 'Senha & Campus', 'Confirmação'];
const BTN_LABELS  = [
  'Continuar <i class="fa fa-arrow-right"></i>',
  'Continuar <i class="fa fa-arrow-right"></i>',
  '<i class="fa fa-check"></i> Criar minha conta',
];

/* ═══════════ ABRIR E FECHAR ═══════════ */

/**
 * Abrir e focar no modal.
 */
function openModal() {
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('nome').focus(), 320);
}

/**
 * Fecha o modal e parar animação.
 */
function closeModal() {
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(resetModal, 400);
}

/**
 * Fecha com esc ou clicando fora do modal.
 * @param {MouseEvent} e
 */
function handleOverlayClick(e) {
  if (e.target === document.getElementById('overlay')) closeModal();
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});



/**
 * Volta o modal ao estado inicial (passo 1, campos limpos).
 */
function resetModal() {
  currentStep = 1;

  // Esconde tela de sucesso e mostra footer
  document.getElementById('success-view').classList.remove('active');
  document.getElementById('modal-footer').style.display = '';

  // Reseta steps
  document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
  document.getElementById('step-1').classList.add('active');

  // Limpa inputs
  document.querySelectorAll('.form-input, .form-select').forEach(el => {
    el.value = '';
    el.classList.remove('valid', 'invalid');
  });

  // Limpa ícones de status e erros
  document.querySelectorAll('.status-icon').forEach(s => {
    s.className = 'status-icon';
    s.innerHTML = '';
  });
  document.querySelectorAll('.err-msg').forEach(e => e.classList.remove('show'));

  // Reseta barra de força
  document.getElementById('forca-fill').style.width = '0%';
  document.getElementById('forca-label').textContent = '';

  // Reseta checkbox
  const check = document.getElementById('check-termos');
  check.classList.remove('checked');
  check.innerHTML = '';

  // Reseta avatar
  document.getElementById('avatar-img').style.display = 'none';
  document.getElementById('avatar-emoji').style.display = '';

  updateStepUI();
}

/* ═══════════ NAVEGAÇÃO DE PASSOS ═══════════ */

/**
 * Atualiza títulos, barra de progresso e botões conforme o passo atual.
 */
function updateStepUI() {
  const i = currentStep - 1;

  document.getElementById('modal-title').textContent = STEP_TITLES[i] || '';
  document.getElementById('step-num').textContent    = currentStep;
  document.getElementById('step-desc').textContent   = STEP_DESCS[i] || '';
  document.getElementById('btn-label').innerHTML     = BTN_LABELS[i] || '';

  // Botão Voltar
  document.getElementById('btn-back').style.display = currentStep > 1 ? 'flex' : 'none';

  // Barra de segmentos
  for (let s = 0; s < TOTAL_STEPS; s++) {
    const seg = document.getElementById(`seg-${s}`);
    seg.className = 'step-seg';
    if (s < i)  seg.classList.add('done');
    if (s === i) seg.classList.add('active');
  }
}

/**
 * Avança para o próximo passo após validar o atual.
 * No último passo, chama submitForm().
 */
function nextStep() {
  if (!validateStep()) return;

  if (currentStep === TOTAL_STEPS) {
    submitForm();
    return;
  }

  document.getElementById(`step-${currentStep}`).classList.remove('active');
  currentStep++;
  document.getElementById(`step-${currentStep}`).classList.add('active');

  if (currentStep === TOTAL_STEPS) buildResumo();

  updateStepUI();
  document.getElementById('modal').scrollTop = 0;
}

/**
 * Volta ao passo anterior.
 */
function prevStep() {
  document.getElementById(`step-${currentStep}`).classList.remove('active');
  currentStep--;
  document.getElementById(`step-${currentStep}`).classList.add('active');
  updateStepUI();
  document.getElementById('modal').scrollTop = 0;
}

/* ═══════════ VALIDAÇÃO POR PASSO ═══════════ */

/**
 * Valida todos os campos do passo atual.
 * @returns {boolean} true se todos os campos estão válidos.
 */
function validateStep() {
  switch (currentStep) {
    case 1: return validateNome(true) & validateEmail(true);
    case 2: return validateSenha(true) & validateConfirma(true) & validateCampus(true);
    case 3: return validateTermos();
    default: return true;
  }
}

/* ═══════════ VALIDADORES INDIVIDUAIS ═══════════ */

/**
 * Define visualmente o estado válido/inválido de um campo.
 * @param {string}  id   - ID do input
 * @param {boolean} ok   - Se o campo é válido
 * @param {string}  msg  - Mensagem de erro
 * @returns {boolean}
 */
function setField(id, ok, msg) {
  const input  = document.getElementById(id);
  const status = document.getElementById(id + '-status');
  const err    = document.getElementById(id + '-err');

  input.classList.toggle('valid',   ok);
  input.classList.toggle('invalid', !ok);

  if (status) {
    status.className = 'status-icon show ' + (ok ? 'ok' : 'err');
    status.innerHTML = ok
      ? '<i class="fa fa-check-circle"></i>'
      : '<i class="fa fa-times-circle"></i>';
  }
  if (err) {
    err.textContent = ok ? '' : msg;
    err.classList.toggle('show', !ok);
  }
  return ok;
}

/**
 * Valida o campo Nome Completo.
 * @param {boolean} force - Se true, valida mesmo vazio (ao tentar avançar).
 */
function validateNome(force = false) {
  const v = document.getElementById('nome').value.trim();
  if (!v && !force) return true;
  if (!v)                                   return setField('nome', false, 'Informe seu nome completo.');
  if (v.split(' ').filter(Boolean).length < 2) return setField('nome', false, 'Informe nome e sobrenome.');
  if (v.length < 5)                         return setField('nome', false, 'Nome muito curto.');
  return setField('nome', true, '');
}

/**
 * Valida o campo Email Institucional.
 * @param {boolean} force
 */
function validateEmail(force = false) {
  const v = document.getElementById('email').value.trim();
  if (!v && !force) return true;
  if (!v) return setField('email', false, 'Informe seu e-mail institucional.');

  const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!reEmail.test(v)) return setField('email', false, 'E-mail inválido.');
  if (!v.includes('@aluno.') && !v.includes('@ifce.'))
    return setField('email', false, 'Use seu e-mail institucional (@aluno.ifce.edu.br).');

  return setField('email', true, '');
}

/**
 * Valida o campo Senha e atualiza a barra de força.
 * @param {boolean} force
 */
function validateSenha(force = false) {
  const v = document.getElementById('senha').value;
  updateForcaSenha(v);
  if (!v && !force) return true;
  if (!v)           return setField('senha', false, 'Crie uma senha.');
  if (v.length < 8) return setField('senha', false, 'A senha deve ter pelo menos 8 caracteres.');
  if (!/[A-Z]/.test(v)) return setField('senha', false, 'Inclua pelo menos uma letra maiúscula.');
  if (!/[0-9]/.test(v)) return setField('senha', false, 'Inclua pelo menos um número.');
  return setField('senha', true, '');
}

/**
 * Valida a confirmação de senha.
 * @param {boolean} force
 */
function validateConfirma(force = false) {
  const senha   = document.getElementById('senha').value;
  const confirma = document.getElementById('confirma').value;
  if (!confirma && !force) return true;
  if (!confirma) return setField('confirma', false, 'Confirme sua senha.');
  if (senha !== confirma)  return setField('confirma', false, 'As senhas não coincidem.');
  return setField('confirma', true, '');
}

/**
 * Valida o select de Campus.
 * @param {boolean} force
 */
function validateCampus(force = false) {
  const v   = document.getElementById('campus').value;
  const el  = document.getElementById('campus');
  const err = document.getElementById('campus-err');

  if (!v && !force) return true;
  if (!v) {
    el.classList.add('invalid');
    err.textContent = 'Selecione seu campus.';
    err.classList.add('show');
    return false;
  }
  el.classList.remove('invalid');
  el.classList.add('valid');
  err.classList.remove('show');
  return true;
}

/**
 * Valida se os termos foram aceitos.
 */
function validateTermos() {
  const ok  = document.getElementById('check-termos').classList.contains('checked');
  const err = document.getElementById('termos-err');
  err.textContent = ok ? '' : 'Você deve aceitar os termos para continuar.';
  err.classList.toggle('show', !ok);
  return ok;
}

/* ═══════════ FORÇA DA SENHA ═══════════ */

/**
 * Atualiza visualmente a barra de força da senha.
 * @param {string} v - Valor atual da senha
 */
function updateForcaSenha(v) {
  let pts = 0;
  if (v.length >= 8)           pts++;
  if (v.length >= 12)          pts++;
  if (/[A-Z]/.test(v))         pts++;
  if (/[0-9]/.test(v))         pts++;
  if (/[^A-Za-z0-9]/.test(v)) pts++;

  const levels = [
    { label: '',            pct: 0,   color: '#e2ebe5' },
    { label: 'Muito fraca', pct: 20,  color: '#C62828' },
    { label: 'Fraca',       pct: 40,  color: '#f4511e' },
    { label: 'Razoável',    pct: 60,  color: '#f9a825' },
    { label: 'Forte',       pct: 80,  color: '#43a047' },
    { label: 'Muito forte', pct: 100, color: '#0F9D58' },
  ];
  const lv = v.length === 0 ? levels[0] : levels[Math.max(1, pts)];

  document.getElementById('forca-fill').style.width      = lv.pct + '%';
  document.getElementById('forca-fill').style.background = lv.color;
  document.getElementById('forca-label').textContent     = lv.label;
  document.getElementById('forca-label').style.color     = lv.color;
}

/* ═══════════ TOGGLE SENHA VISÍVEL ═══════════ */

/**
 * Alterna entre mostrar e ocultar o texto da senha.
 * @param {string}          id  - ID do input
 * @param {HTMLButtonElement} btn - Botão que foi clicado
 */
function togglePass(id, btn) {
  const input  = document.getElementById(id);
  const isPass = input.type === 'password';
  input.type   = isPass ? 'text' : 'password';
  btn.innerHTML = `<i class="fa fa-eye${isPass ? '-slash' : ''}"></i>`;
}

/* ═══════════ CHECKBOX PERSONALIZADO ═══════════ */

/**
 * Alterna o estado do checkbox de aceite dos termos.
 * @param {HTMLElement} el
 */
function toggleCheck(el) {
  el.classList.toggle('checked');
  el.innerHTML = el.classList.contains('checked')
    ? '<i class="fa fa-check"></i>'
    : '';
  if (el.classList.contains('checked')) {
    document.getElementById('termos-err').classList.remove('show');
  }
}

/* ═══════════ PRÉVIA DO AVATAR ═══════════ */

/**
 * Exibe a imagem selecionada como prévia do avatar.
 * @param {HTMLInputElement} input
 */
function previewAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = document.getElementById('avatar-img');
  img.src   = url;
  img.style.display = 'block';
  document.getElementById('avatar-emoji').style.display = 'none';
  document.getElementById('success-avatar').src = url;
}

/* ═══════════ RESUMO (PASSO 3) ═══════════ */

/**
 * Preenche o card de resumo com os dados informados.
 */
function buildResumo() {
  const nome   = document.getElementById('nome').value.trim();
  const email  = document.getElementById('email').value.trim();
  const campus = document.getElementById('campus').value || '—';

  document.getElementById('resumo-nome').innerHTML =
    `<i class="fa fa-user"></i> <span class="resumo-val">${nome}</span>`;
  document.getElementById('resumo-email').innerHTML =
    `<i class="fa fa-envelope"></i> <span class="resumo-val">${email}</span>`;
  document.getElementById('resumo-campus').innerHTML =
    `<i class="fa fa-map-marker-alt"></i> <span class="resumo-val">${campus}</span>`;
}

/* ═══════════ SUBMIT ═══════════ */

/**
 * Simula o envio do formulário com estado de loading,
 * e exibe a tela de sucesso ao concluir.
 */
function submitForm() {
  const btn = document.getElementById('btn-next');
  btn.classList.add('loading');
  btn.disabled = true;

  // Simulação de requisição (1.4s)
  setTimeout(() => {
    btn.classList.remove('loading');
    btn.disabled = false;

    // Esconde steps e mostra sucesso
    document.querySelectorAll('.step-content').forEach(s => s.classList.remove('active'));
    document.getElementById('success-view').classList.add('active');
    document.getElementById('modal-footer').style.display = 'none';

    // Preenche nome na tela de sucesso
    document.getElementById('success-name').textContent =
      document.getElementById('nome').value.trim();

    // Marca todos os segmentos como concluídos
    for (let i = 0; i < TOTAL_STEPS; i++) {
      const seg = document.getElementById(`seg-${i}`);
      seg.classList.remove('active');
      seg.classList.add('done');
    }
  }, 1400);
}

/* ═══════════ INIT ═══════════ */
updateStepUI();
