document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.code-inputs input');

  inputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const value = e.target.value;
      if (value.length > 0) {
        inputs[index].value = value[0]; // На случай если пользователь вставляет больше 1 символа
        if (index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        if (input.value === '' && index > 0) {
          inputs[index - 1].focus();
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputs[index - 1].focus();
      } else if (e.key === 'ArrowRight' && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const paste = e.clipboardData.getData('text').replace(/\D/g, '');
      paste.split('').forEach((char, i) => {
        if (inputs[i]) {
          inputs[i].value = char;
        }
      });
      const next = paste.length < inputs.length ? paste.length : inputs.length - 1;
      inputs[next].focus();
    });
  });

  inputs[0].focus();
});
