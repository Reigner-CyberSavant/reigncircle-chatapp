
//connect main.js to the websocket server (server.js)
const socket = io();

//Display updated active users by extracting element by id
const activeUsers = document.getElementById('active-users');

const messageContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');



//add event listener to listen for submit event on messageform
messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
});

function sendMessage() {
    //Prevent sending empty message field
    if(messageInput.value === '') return;

    //console.log(messageInput.value)
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date()
    }

    socket.emit('message', data);

    //call message controller function
    addMessageToUI(true, data);
    messageInput.value = ''; //empties message field after sending message
};

socket.on('chat-message', (data) => {
    //console.log(data)

    //call message controller function when receiving a message
    addMessageToUI(false, data);
});


//Update and display active users
socket.on('active-users', (data) => {
    console.log(data)
    activeUsers.innerText = `🟢Active User(s): ${data}`; 

});


// own message controller – append message to the UI
function addMessageToUI(isOwnMessage, data) {
    clearFeedback()

  // build a list item string
  const element = `
    <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
      <p class="message">
        ${data.message}
        <span>${data.name} 🔵 ${moment(data.dateTime).fromNow()}</span>
      </p>
    </li>`;

  // actually add the string to the container
  messageContainer.innerHTML += element;

  //scroll to bottom automatically
  messageContainer.scrollTop = messageContainer.scrollHeight;
}


messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `...${nameInput.value} is typing a message...`
    })
});

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `...${nameInput.value} is typing a message...`
    })
});

messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: ''
    })
});

socket.on ('feedback', (data) => {
    clearFeedback()

    const element = `
            <li class="message-feedback">
                <p class="message-feedback" id="message-feedback">
                    ${data.feedback}
                </p>
            </li>`

   messageContainer.innerHTML += element         
})


//clear feedback function
function clearFeedback() {
  document.querySelectorAll('li.message-feedback').forEach(el => el.remove());
}
