const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages")

// Get username and room id from url
const {username,room}= Qs.parse(location.search,{
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

socket.emit('joinRoom',{username,room})

//message from server
socket.on("message", (message) => {
    console.log(message);
    outputMessage(message)

    // Scroll automatically to latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;

});

chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // Get message text
    const msg = event.target.elements.msg.value;

    //Emit message to server
    socket.emit("chatMessage", msg);

    // clear input and focus text field
    event.target.elements.msg.value='';
    event.target.elements.msg.focus();
});  

// output message to Do,
function outputMessage(message) {
  const newDiv = document.createElement("div");
  newDiv.classList.add("message");
  newDiv.innerHTML = ` <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
       ${message.text}
    </p> `;
    

    // add message to DOM
    document.querySelector('.chat-messages').appendChild(newDiv)
}