// 👋 Mensagem inicial automática
window.onload = function () {
  const messages = document.getElementById("messages");

  messages.innerHTML += `
    <div class="msg bot">
Olá, humano 👋

Eu sou o C.A.I.O. (Currículo Automatizado Incrivelmente Otimizado), assistente do Caio Vieira.

Posso te ajudar a entender a experiência dele, projetos e decisões de UX — de forma rápida e direta.

Você pode falar comigo em português ou inglês, como preferir 🙂

---

Hi there 👋

I'm C.A.I.O. (Conversational Assistant for Intelligent Operations), Caio Vieira's assistant.

I can help you quickly understand his experience, projects, and UX decisions.

Feel free to talk to me in Portuguese or English — whatever you prefer 🙂
    </div>
  `;
};

// 💬 Enviar mensagem
async function send() {
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  const userText = input.value;

  if (!userText) return;

  // 👤 Mensagem do usuário
  messages.innerHTML += `<div class="msg user">${userText}</div>`;

  input.value = "";

  // 🤖 Loading
  const loading = document.createElement("div");
  loading.className = "msg bot";
  loading.innerText = "CAIO está pensando...";
  messages.appendChild(loading);

  // 🔽 Scroll automático
  messages.scrollTop = messages.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userText }),
    });

    const data = await res.json();

    // remove loading
    loading.remove();

    // 🤖 resposta
    messages.innerHTML += `<div class="msg bot">${data.reply}</div>`;

  } catch (error) {
    loading.remove();

    messages.innerHTML += `
      <div class="msg bot">
        Tive um erro aqui 😅 tenta de novo?
      </div>
    `;
  }

  // 🔽 Scroll automático
  messages.scrollTop = messages.scrollHeight;
}

// ⌨️ Enviar com Enter
document.getElementById("input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    send();
  }
});
