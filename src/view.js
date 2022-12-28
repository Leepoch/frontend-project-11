export default (state, t) => {
  const p = document.querySelector('.feedback');
  const input = document.querySelector('#url-input');
  if (state.inputState === 'correct') {
    input.classList.remove('is-invalid');
    p.classList.remove('text-danger');
    p.classList.add('text-success');
    p.textContent = t('validUrl');
  };
  if (state.inputState === 'uncorrect') {
    input.classList.add('is-invalid');
    p.classList.remove('text-success');
    p.classList.add('text-danger');
    p.textContent = t('invalidUrl');
  };
  if (state.inputState === 'exists') {
    input.classList.add('is-invalid');
    p.classList.remove('text-success');
    p.classList.add('text-danger');
    p.textContent = t('repeatUrl');
  }
}