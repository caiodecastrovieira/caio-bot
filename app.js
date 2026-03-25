window.onload = function () {
  const loading = document.createElement("div");
loading.className = "msg bot";
loading.innerText = "CAIO está pensando...";
messages.appendChild(loading);

  messages.innerHTML += `
    <div class="msg">
      Olá, humano 👋<br><br>
      Eu sou o C.A.I.O. (Currículo Automatizado Incrivelmente Otimizado), assistente do Caio Vieira!<br><br>
      Posso te ajudar a entender a experiência dele, projetos e decisões de UX — de forma rápida e direta.<br><br>
      Você pode falar comigo em português ou inglês, como preferir 🙂<br><br>
      ---<br><br>
      Hi there 👋<br><br>
      I'm C.A.I.O. (Clever Automated Intelligent Operator), Caio Vieira's assistant!<br><br>
      I can help you quickly understand his experience, projects, and UX decisions.<br><br>
      Feel free to talk to me in Portuguese or English — whatever you prefer 🙂
    </div>
  `;
  loading.remove();
};async function send() {
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  const userText = input.value;

  messages.innerHTML += `<div class="msg bot">${data.reply}</div>`;

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
