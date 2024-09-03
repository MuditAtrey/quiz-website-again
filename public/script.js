const nameInput = document.getElementById('identification');
const startBtn = document.getElementById('start-btn');

// Enable/disable the start button based on name input
nameInput.addEventListener('input', () => {
    startBtn.disabled = !nameInput.value;
});

startBtn.addEventListener('click', () => {
    const identificationNumber = nameInput.value;
    if (!identificationNumber) {
        alert("Please enter your identification number.");
        return;
    }

    // Validate identification number (e.g., check if it's 10 digits)
    if (!/^\d{10}$/.test(identificationNumber)) {
        alert("Invalid identification number. Please enter 10 digits.");
        return;
    }

    // Send the identification number to the server
    fetch('/submit-identification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ identificationNumber: identificationNumber })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error submitting identification number');
        }
        console.log('Identification number submitted successfully:', identificationNumber);
        // Proceed with the quiz logic
    })
    .catch(error => {
        console.error('Error submitting identification number:', error);
        alert('Failed to submit identification number. Please try again later.');
    });
});
