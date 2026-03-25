export default async function handler(req, res) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ reply: "API key não encontrada" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Mensagem vazia" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é um assistente que representa Caio Vieira, UX Writer."
          },
          {
            role: "user",
            content: message
          }
        ],
      }),
    });

    const data = await response.json();

    console.log("OPENAI RESPONSE:", data);

    if (!data.choices) {
      return res.status(500).json({
        reply: "Erro na resposta da OpenAI",
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content,
    });

  } catch (error) {
    console.error("ERRO:", error);

    return res.status(500).json({
      reply: "Erro interno no servidor",
    });
  }
}
