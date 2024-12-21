document.addEventListener('DOMContentLoaded', () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const scatteredAlphabetContainer = document.getElementById('scattered-alphabet');
    const container = document.querySelector('.container');

    // Get container dimensions for collision detection
    const containerRect = container.getBoundingClientRect();
    const margin = 50; // Safe margin to prevent overlap
    const letterSize = 60; // Approximate size of each letter (adjust based on styling)

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

        // Assign random velocities
        const velocity = {
            x: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1), // Random speed between -3 and 3
            y: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? -1 : 1),
        };

        letters.push({ element: span, x: randomLeft, y: randomTop, velocity });
        scatteredAlphabetContainer.appendChild(span);
    });

    // Animation loop
    function animate() {
        letters.forEach(letter => {
            let { element, x, y, velocity } = letter;

            let newX = x + velocity.x;
            let newY = y + velocity.y;

            // Detect collision with viewport edges
            if (newX <= 0 || newX + letterSize >= window.innerWidth) {
                velocity.x *= -1; // Reverse direction
            }
            if (newY <= 0 || newY + letterSize >= window.innerHeight) {
                velocity.y *= -1; // Reverse direction
            }

            // Detect collision with container
            if (
                newX + letterSize > containerRect.left &&
                newX < containerRect.right &&
                newY + letterSize > containerRect.top &&
                newY < containerRect.bottom
            ) {
                velocity.x *= -1; // Reverse direction
                velocity.y *= -1;
            }

            // Update position
            letter.x = newX;
            letter.y = newY;

            element.style.left = `${newX}px`;
            element.style.top = `${newY}px`;
        });

        // Schedule next frame
        requestAnimationFrame(animate);
    }

    animate(); // Start animation
});

// Highlight letters based on input
document.getElementById('name').addEventListener('input', function () {
    const scatteredLetters = document.querySelectorAll('.scattered-letter');
    const inputValue = this.value.toUpperCase(); // Get the input value in uppercase
    console.log("Input value:", inputValue);

    // Reset all highlights
    scatteredLetters.forEach(letter => letter.classList.remove('highlight'));

    // Highlight letters sequentially based on input
    inputValue.split('').forEach(char => {
        for (let i = 0; i < scatteredLetters.length; i++) {
            const letter = scatteredLetters[i];
            if (letter.textContent === char && !letter.classList.contains('highlight')) {
                letter.classList.add('highlight');
                console.log(`Highlighted: ${letter.textContent}`);
                break; // Exit the loop after highlighting one matching letter
            }
        }
    });
});
