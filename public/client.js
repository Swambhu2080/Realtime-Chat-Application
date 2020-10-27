const socket = io()
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')

//takes enter before inserting into the Chat room
do {
    name = prompt('Please enter your name: ')
    socket.emit('new-user-joined',name);
} while(!name)


//to display who joined
socket.on('user-joined',name =>{
    append(`${name}   joined the chat`, 'incoming')
})

// to send message when enter is pressed
textarea.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
        sendMessage(e.target.value)
    }
})

// to send message
function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}


//to show the messages in the main chat box
function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}


// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})


//to display who left
socket.on('left',name =>{
    append(`${name} left the chat`, 'outgoing')
})

// to scroll to the last text 
function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}

// to append user messages(joined/left)
const append = (message, type)=>{
    const mainDiv = document.createElement('div');
    mainDiv.innerText = message;
    mainDiv.classList.add('message');
    mainDiv.classList.add(type);
    messageArea.append(mainDiv);
}