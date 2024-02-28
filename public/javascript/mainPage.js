document.querySelector('#specializationFilter').addEventListener('change', function (e) {
    window.location.href = '/?specialization=' + encodeURIComponent(e.target.value);
});

document.querySelector('#resetFilter').addEventListener('click', function () {
    window.location.href = '/';
});

