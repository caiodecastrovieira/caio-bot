// ── Histórico de conversa ───────────────────────────────────────────────────
// Mantém o contexto entre mensagens para respostas mais coerentes

const conversationHistory = [];

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
  requestAnimationFrame(() => {
    const messages = document.getElementById("messages");
    messages.scrollTop = messages.scrollHeight;
  });
}

function setLoading(isLoading) {
  document.getElementById("send-btn").disabled = isLoading;
  document.getElementById("input").disabled = isLoading;
}

// ── Mensagem inicial ────────────────────────────────────────────────────────
// A mensagem de boas-vindas é gerada pelo sistema i18n do index.html.
// Este arquivo não duplica essa lógica.

// ── Enviar mensagem ─────────────────────────────────────────────────────────

let isSending = false;

async function send() {
  if (isSending) return;

  const input = document.getElementById("input");
  const userText = input.value.trim();
  if (!userText) return;

  isSending = true;
  setLoading(true);

  // Exibe e registra mensagem do usuário
  appendMessage(userText, "user");
  conversationHistory.push({ role: "user", content: userText });
  input.value = "";

  // Indicador de loading
  const loading = appendMessage("C.A.I.O. está pensando...", "bot");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Envia o histórico completo para o servidor manter contexto
      body: JSON.stringify({ history: conversationHistory }),
    });

    loading.remove();

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const reply = data.reply?.trim();

    if (!reply) throw new Error("Resposta vazia");

    // Registra resposta no histórico e exibe
    conversationHistory.push({ role: "assistant", content: reply });
    appendMessage(reply, "bot");

  } catch (err) {
    loading.remove();
    console.error("[C.A.I.O.]", err);
    // Remove a última mensagem do histórico se houve erro
    conversationHistory.pop();
    appendMessage("Tive um erro aqui 😅 Tenta de novo?", "bot");

  } finally {
    isSending = false;
    setLoading(false);
    input.focus();
  }
}

// ── Enviar com Enter ────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("input").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
});
