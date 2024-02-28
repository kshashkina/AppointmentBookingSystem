document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('registrationForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Registration successful') {
                    window.location.href = '/auth/login';
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error sending request:', error);
                alert('Registration failed');
            });
    });
});
