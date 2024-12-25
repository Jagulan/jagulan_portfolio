const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const scatteredAlphabetContainer = document.getElementById('scattered-alphabet');

// Toggle between Sign In and Sign Up forms
registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// Highlight letters based on email input
function highlightEmail(inputElement) {
    const scatteredLetters = document.querySelectorAll('.scattered-letter');

    inputElement.addEventListener('input', function () {
        const inputValue = this.value.split('@')[0].toUpperCase(); // Extract text before "@"

        // Reset all highlights
        scatteredLetters.forEach(letter => letter.classList.remove('highlight'));

        // Highlight letters sequentially based on input
        inputValue.split('').forEach(char => {
            for (let i = 0; i < scatteredLetters.length; i++) {
                const letter = scatteredLetters[i];
                if (letter.textContent === char && !letter.classList.contains('highlight')) {
                    letter.classList.add('highlight');
                    break; // Exit the loop after highlighting one matching letter
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const containerRect = container.getBoundingClientRect();
    const margin = 50;
    const letterSize = 60;

    const letters = [];

    alphabet.split('').forEach(letter => {
        const span = document.createElement('span');
        span.textContent = letter;
        span.classList.add('scattered-letter');

        let randomTop, randomLeft;

        do {
            randomTop = Math.random() * (window.innerHeight - letterSize);
            randomLeft = Math.random() * (window.innerWidth - letterSize);
        } while (
            randomTop + letterSize > containerRect.top - margin &&
            randomTop < containerRect.bottom + margin &&
            randomLeft + letterSize > containerRect.left - margin &&
            randomLeft < containerRect.right + margin
        );

        span.style.position = 'absolute';
        span.style.top = `${randomTop}px`;
        span.style.left = `${randomLeft}px`;

        const velocity = {
            x: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1),
            y: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1),
        };

        letters.push({ element: span, x: randomLeft, y: randomTop, velocity });
        scatteredAlphabetContainer.appendChild(span);
    });

    function animate() {
        letters.forEach(letter => {
            let { element, x, y, velocity } = letter;

            let newX = x + velocity.x;
            let newY = y + velocity.y;

            if (newX <= 0 || newX + letterSize >= window.innerWidth) {
                velocity.x *= -1;
            }
            if (newY <= 0 || newY + letterSize >= window.innerHeight) {
                velocity.y *= -1;
            }

            if (
                newX + letterSize > containerRect.left &&
                newX < containerRect.right &&
                newY + letterSize > containerRect.top &&
                newY < containerRect.bottom
            ) {
                velocity.x *= -1;
                velocity.y *= -1;
            }

            letter.x = newX;
            letter.y = newY;

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Attach email input highlighting
    const signInEmail = document.querySelector('.sign-in input[type="email"]');
    const signUpEmail = document.querySelector('.sign-up input[type="email"]');

    if (signInEmail) highlightEmail(signInEmail);
    if (signUpEmail) highlightEmail(signUpEmail);
});
