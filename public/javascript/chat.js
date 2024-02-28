var socket = io();
document.addEventListener('DOMContentLoaded', (event) => {


    var form = document.getElementById('form');
    var input = document.getElementById('input');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', { name: userName, role:userRole, msg: input.value });
            input.value = '';
        }
    });
    socket.on('chat message', function(data) {
        const { name, role, msg, isSentByMe } = data;

        let item = document.createElement('li');
        let senderRole = document.createElement('div')
        let senderName = document.createElement('div');
        let messageText = document.createElement('div');

        let roleUppercase = role.charAt(0).toUpperCase() + role.slice(1)
        senderName.textContent = name;
        senderRole.textContent = roleUppercase;
        messageText.textContent = msg;

        senderName.className = 'message-sender';
        senderRole.className = 'message-sender'
        messageText.className = 'message-text';

        if (isSentByMe) {
            item.classList.add('sent-message');
        } else {
            item.classList.add('received-message');
        }

        item.appendChild(senderRole)
        item.appendChild(senderName);
        item.appendChild(messageText);
        document.getElementById('messages').appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
});