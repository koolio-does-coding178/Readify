
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

// Define API routes BEFORE static file serving
app.post("/simplify", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  console.log("Request received for text:", text.substring(0, 20) + "...");

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `ONLY USE EASY WORDS AND Rewrite the text so it becomes dyslexia friendly while keeping the meaning while simplifying do not omit any information, use concise language, and simple words, so it is friendly for a persion with comprehension difficulties to understand. \n\n${text}`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    // FIX 4: Check for API errors
    if (!response.ok) {
      console.error("Gemini API Error:", JSON.stringify(data, null, 2));
      return res.status(response.status).json({ 
        error: "Gemini API Error", 
        details: data
              });
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      console.log("Unexpected structure:", JSON.stringify(data, null, 2));
      return res.status(500).json({ error: "No text returned from Gemini" });
    }

    res.json({ response: reply });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
