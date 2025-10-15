import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`GPT Server running on port ${PORT}`));
