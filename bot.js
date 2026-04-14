function sendMessage() {
  const input = document.getElementById("userInput");
  const text = input.value.trim();

  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  showTyping();

  setTimeout(() => {
    removeTyping();
    botReply(text);
  }, 1000);
}

function addMessage(text, sender) {
  const chatBox = document.getElementById("chatBox");

  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const chatBox = document.getElementById("chatBox");

  const typing = document.createElement("div");
  typing.className = "typing";
  typing.id = "typing";
  typing.innerText = "Bot is typing...";

  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

function botReply(userText) {
  let reply = "I didn't understand that.";

  if (userText.toLowerCase().includes("hello")) {
    reply = "Hi there! 😊";
  } else if (userText.toLowerCase().includes("how are you")) {
    reply = "I'm just code, but I'm doing great!";
  } else if (userText.toLowerCase().includes("bye")) {
    reply = "Goodbye! 👋";
  }

  addMessage(reply, "bot");
}

function handleKey(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}
