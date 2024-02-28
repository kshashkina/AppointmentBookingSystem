document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Login successful') {
                    window.location.href = '/'; // Redirect to dashboard upon successful login
                }
                else if (data.message === 'Login successful/Doctor'){
                    window.location.href = '/doctor/dashboard';
                }
                else if (data.message === 'Login successful/Admin'){
                    window.location.href = '/admin/dashboard';}
                else {
                    alert(data.message); // Show error message
                }
            })
            .catch(error => {
                console.error('Error sending request:', error);
                alert('Login failed');
            });
    });
});
