import OpenAI from "openai";



// 📦 ייבוא ספריות
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fetch from "node-fetch";
import XLSX from "xlsx";
import fs from "fs";
// 🧩 טעינת משתני סביבה

dotenv.config();
const PORT = process.env.PORT || 5001;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const app = express();
app.use(express.json());
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateBotReply(userMessage) {
  const systemPrompt = `
  אתה עוזר וירטואלי ידידותי של חברת "A.B Deliveries".
  תפקידך:
  - לענות בעברית בצורה מנומסת וחיובית.
  - אם השאלה קשורה למעקב אחרי חבילה — תשאל את המשתמש מה מספר החבילה ותענה בהתאם.
  - אם מדובר בשירות לקוחות — תהיה אדיב ותשאל איך אפשר לעזור.
  - אם מדובר בהזמנה חדשה — תעודד את הלקוח להזמין עוד משלוחים.
  חשוב: אל תשתמש במונחים טכניים, דבר בגובה העיניים.
  `;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ Error generating bot reply:", error);
    return "מצטער, יש כרגע עומס במערכת. נסה שוב בעוד רגע 🙂";
  }
}



async function sendMessage(to, text) {
  try {
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        text: { body: text },
      }),
    });

    const data = await response.json();
    console.log("📤 Message sent:", data);
  } catch (error) {
    console.error("❌ Error sending message:", error);
  }
}

app.use(bodyParser.json());

app.get("/webhook", (req, res) => {
	  console.log("📥 Webhook verification request received:", req.query);
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "AB_DELIVERIES_TOKEN";
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log(" WEBHOOK VERIFIED SUCCESSFULLY!");
    res.status(200).send(challenge);
  } else {
    console.error(" WEBHOOK VERIFICATION FAILED");
    res.sendStatus(403);
  }
});

// 💬 טיפול בהודעות נכנסות
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const text = message.text?.body || "";
      console.log(`📩 New message from ${from}: ${text}`);
  logToExcel("לקוח", from, text);

      const botReply = await generateBotReply(text);

      await sendMessage(from, botReply);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    res.sendStatus(500);
  }
});

app.get("/", (req, res) => {
res.send("🚚 A.B Deliveries WhatsApp Bot is Running!  v2");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post("/generate-text", async (req, res) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a friendly assistant" },
        {
          role: "user",
          content:
            "Send me a random text . no intoduction. pure random text like DFSKJ044TT4JFSKX"
        }
      ],
      max_tokens: 10
    });

    const message = response.choices[0].message.content.trim();
    res.json({ message });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

function logToExcel(name, phone, message) {
  const filePath = "./conversations.xlsx";

  let workbook;
  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
  } else {
    workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([["Name", "Phone", "Message", "Timestamp"]]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Conversations");
    XLSX.writeFile(workbook, filePath);
  }

  const worksheet = workbook.Sheets["Conversations"];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const newRow = [name || "Unknown", phone, message, new Date().toLocaleString()];
  data.push(newRow);

  const newSheet = XLSX.utils.aoa_to_sheet(data);
  workbook.Sheets["Conversations"] = newSheet;
  XLSX.writeFile(workbook, filePath);

  console.log(" Conversation saved to Excel!");
}