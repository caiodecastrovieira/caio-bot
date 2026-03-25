// ── Utilitários ────────────────────────────────────────────────────────────

function createMessage(text, role) {
  const div = document.createElement("div");
  div.className = `msg ${role}`;
  div.textContent = text;
  return div;
}

function appendMessage(text, role) {
  const messages = document.getElementById("messages");
  const div = createMessage(text, role);
  messages.appendChild(div);
  scrollToBottom();
  return div;
}

function scrollToBottom() {
  const messages = document.getElementById("messages");
  // requestAnimationFrame garante que o DOM já foi atualizado antes do scroll
  requestAnimationFrame(() => {
    messages.scrollTop = messages.scrollHeight;
  });
}

function setLoading(isLoading) {
  const btn = document.getElementById("send-btn");
  const input = document.getElementById("input");
  btn.disabled = isLoading;
  input.disabled = isLoading;
}

// ── Mensagem inicial ────────────────────────────────────────────────────────
// A mensagem de boas-vindas é gerada pelo sistema i18n do index.html.
// Este arquivo não duplica essa lógica.

// ── Enviar mensagem ─────────────────────────────────────────────────────────

let isSending = false; // evita envios simultâneos

async function send() {
  if (isSending) return;

  const input = document.getElementById("input");
  const userText = input.value.trim();
  if (!userText) return;

  isSending = true;
  setLoading(true);

  // Mensagem do usuário (textContent = seguro contra XSS)
  appendMessage(userText, "user");
  input.value = "";

  // Indicador de loading
  const loading = appendMessage("C.A.I.O. está pensando...", "bot");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userText }),
    });

    loading.remove();

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const reply = data.reply?.trim();

    if (!reply) {
      throw new Error("Resposta vazia");
    }

    appendMessage(reply, "bot");

  } catch (err) {
    loading.remove();
    console.error("[C.A.I.O.]", err);
    appendMessage("Tive um erro aqui 😅 Tenta de novo?", "bot");

  } finally {
    isSending = false;
    setLoading(false);
    input.focus();
  }
}

// ── Enviar com Enter ────────────────────────────────────────────────────────
// keydown substitui o deprecado keypress

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
});
