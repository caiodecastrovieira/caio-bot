async function send() {
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  const userText = input.value;

  messages.innerHTML += `<div class="msg user">${userText}</div>`;

  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userText }),
  });

  const data = await res.json();

  messages.innerHTML += `<div class="msg">${data.reply}</div>`;
}
