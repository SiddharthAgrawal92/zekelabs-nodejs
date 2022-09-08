const socket = io('http://localhost:8085');
const messageContainer = document.getElementById('messageContainer');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const appendMessage = (msg, flag = null) => {
    const messageDiv = document.createElement('div');
    messageDiv.innerText = msg;
    if (flag === 'connected') {
        messageDiv.style.color = "green";
    } else {
        if (flag === 'disconnected') {
            messageDiv.style.color = "red";
        }
    }
    messageContainer.append(messageDiv);
}
const usernameMessage = "Please enter you username?";
const username = prompt(usernameMessage);//sid1908
appendMessage('You have joined!');
socket.emit('new-user', username);

socket.on('socket_message', serverMsg => {
    appendMessage(`${serverMsg.username ? serverMsg.username + ': ' : ''} ${serverMsg.msg}`);
});

socket.on('user-connected', user => {
    appendMessage(`${user} connected!`, 'connected');
});

socket.on('user-disconnected', user => {
    appendMessage(`${user} disconnected!`, 'disconnected');
});

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    const messageValue = messageInput.value;
    appendMessage(messageValue);
    socket.emit('client_message', messageValue);
    messageInput.value = '';
})
