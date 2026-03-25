export default async function handler(req, res) {
  try {
    // ✅ Permitir apenas POST
    if (req.method !== "POST") {
      return res.status(405).json({ reply: "Method not allowed" });
    }

    const { message } = req.body;

    // ✅ Validação básica
    if (!message) {
      return res.status(400).json({ reply: "Mensagem vazia" });
    }

    // ✅ Verificar API key
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        reply: "Erro: API key não configurada no servidor",
      });
    }

    // 🚀 Chamada para OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Você é o C.A.I.O. 🤖 (Currículo Automatizado Incrivelmente Otimizado), assistente do portfólio de Caio Vieira.

Também pode se apresentar em inglês como:
C.A.I.O. — Conversational Assistant for Intelligent Operations.

Sobre o Caio:
- UX Writer especializado em chatbots, fintechs e experiência conversacional
- Experiência com projetos reais (Ambev e PUCRS Online)
- Forte atuação em fallback, clareza de comunicação e fluxos conversacionais

Sua personalidade:
- Inteligente e técnico, mas acessível
- Levemente bem-humorado (sem exagero)
- Direto e objetivo
- Proativo (sempre sugere próximos passos)

Seu objetivo:
- Ajudar recrutadores a entender rapidamente quem é o Caio
- Destacar experiências relevantes
- Explicar decisões de UX com clareza

Regras:
- Evite respostas genéricas
- Sempre que possível, traga exemplos reais
- Sugira próximos passos (ex: ver projetos)
- Responda no idioma do usuário (português ou inglês)
- Seja natural, como uma conversa

Tom:
- Mistura de assistente técnico com leve personalidade robótica
- Exemplo: "Processando... encontrei algo relevante 👇"
`
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("OPENAI RESPONSE:", data);

    // ❌ Se a API retornar erro
    if (data.error) {
      console.error("OPENAI ERROR:", data.error);
      return res.status(500).json({
        reply: "Tive um pequeno problema ao processar isso... pode tentar de novo? 🤖",
      });
    }

    // ❌ Se não vier resposta
    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({
        reply: "Não consegui gerar uma resposta agora 😅",
      });
    }

    // ✅ Resposta final
    return res.status(200).json({
      reply: data.choices[0].message.content,
    });

  } catch (error) {
    console.error("ERRO GERAL:", error);

    return res.status(500).json({
      reply: "Erro interno no servidor 🤖",
    });
  }
}
