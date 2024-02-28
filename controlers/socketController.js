const socketIo = require('socket.io');

function handleSocketConnection(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        socket.on('chat message', (data) => {
            const { name, role, msg } = data;
            const messageWithSender = { name, role, msg, isSentByMe: false };
            socket.broadcast.emit('chat message', messageWithSender);
            socket.emit('chat message', { ...messageWithSender, isSentByMe: true });
        });
    });
}

module.exports = {
    handleSocketConnection
};