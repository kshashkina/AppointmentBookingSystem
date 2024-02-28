document.getElementById('deleteButton').addEventListener('click', function () {
    var confirmation = prompt("Please type 'DELETE' to confirm.");
    if (confirmation === 'DELETE') {
        var deleteForm = document.getElementById('deleteForm');
        deleteForm.submit();
    } else {
        alert('Deletion cancelled.');
    }
});

