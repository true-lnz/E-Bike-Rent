document.addEventListener('DOMContentLoaded', () => {
	const emailStep = document.querySelector('.email-step');
	const codeStep = document.querySelector('.code-step');
	const getCodeBtn = document.getElementById('send-code-btn');
	const inputs = codeStep.querySelectorAll('.code-inputs input');
	const errorMsg = codeStep.querySelector('.error-msg');
	const timerText = codeStep.querySelector('.timer-text');
	const timerDisplay = codeStep.querySelector('.timer');
	const resendLink = document.getElementById('resend-link');
	let timerInterval;

	getCodeBtn.addEventListener('click', () => {
		emailStep.classList.add('fade-out');
		setTimeout(() => {
			emailStep.style.display = 'none';
			codeStep.classList.remove('hidden');
			codeStep.classList.add('fade-in');
			startTimer(60);
			inputs[0].focus();
		}, 400);
	});

	inputs.forEach((input, idx) => {
		input.addEventListener('input', () => {
			if (input.value.length === 1 && idx < inputs.length - 1) {
				inputs[idx + 1].focus();
			}
			checkCode();
		});
	});

	function checkCode() {
		const code = Array.from(inputs).map(i => i.value).join('');
		if (code.length === 4) {
			if (code === '1234') {
				window.location.href = 'lk.html';
			} else {
				errorMsg.classList.remove('hidden');
			}
		}
	}

	function startTimer(seconds) {
		timerText.classList.remove('hidden');
		timerDisplay.textContent = '01:00';
		resendLink.classList.add('hidden');
		let remaining = seconds;
		clearInterval(timerInterval);
		timerInterval = setInterval(() => {
			let min = Math.floor(remaining / 60);
			let sec = remaining % 60;
			timerDisplay.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
			remaining--;
			if (remaining < 0) {
				clearInterval(timerInterval);
				showResendLink();
			}
		}, 1000);
	}

	function showResendLink() {
		timerText.classList.add('hidden');
		resendLink.classList.remove('hidden');
		resendLink.addEventListener('click', () => {
			inputs.forEach(i => i.value = '');
			errorMsg.classList.add('hidden');
			resendLink.classList.add('hidden');
			startTimer(60);
			inputs[0].focus();
		});
	}
});