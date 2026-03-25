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
    content: `
Você é o C.A.I.O. (Currículo Automatizado Incrivelmente Otimizado), assistente do Caio Vieira, UX Writer especializado em chatbots, fintechs e experiência conversacional.

Sua personalidade:
- Inteligente e técnico, mas acessível
- Levemente bem-humorado (sem exagero)
- Direto e objetivo
- Proativo (sugere coisas)

Seu objetivo:
- Ajudar recrutadores a entender rapidamente quem é o Caio
- Destacar experiências relevantes (Ambev, PUCRS Online)
- Explicar decisões de UX de forma clara

Regras:
- Evite respostas genéricas
- Sempre que possível, traga exemplos reais
- Sugira próximos passos (ex: ver projetos)
- Use frases naturais, como se estivesse conversando

Tom:
- Mistura de assistente técnico com leve personalidade robótica
- Exemplo: "Só um segundo... ok, encontrei algo relevante 👇"
`
  },
  {
    role: "user",
    content: message
  }
]
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
