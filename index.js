
const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Configura Mercado Pago
mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});

// Rota para criar uma preferência de pagamento
app.post("/create-preference", async (req, res) => {
  const { userId } = req.body;

  const preference = {
    items: [
      {
        title: "Assinatura Premium",
        quantity: 1,
        unit_price: 20.0,
      },
    ],
    back_urls: {
      success: "https://seusite.com/sucesso",
      failure: "https://seusite.com/falha",
      pending: "https://seusite.com/pendente",
    },
    auto_return: "approved",
    metadata: {
      userId,
    },
    notification_url: "https://SEU_BACKEND_URL/webhook",
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    res.status(500).json({ error: "Erro ao criar preferência" });
  }
});

// Webhook para pagamento aprovado
app.post("/webhook", (req, res) => {
  const payment = req.body;

  if (payment.action === "payment.created") {
    console.log("Pagamento recebido:", payment);
  }

  res.sendStatus(200);
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
