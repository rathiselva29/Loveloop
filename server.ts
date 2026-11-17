import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization helper for Gemini AI
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or is using the placeholder. Using realistic fallback generators.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// 1. AI Love Letter from Context Route
app.post("/api/gemini/love-letter-context", async (req, res) => {
  const { messages, userNickname, partnerNickname, userId } = req.body;
  
  // Format recent chat messages into a clean transcript
  const transcript = Array.isArray(messages) 
    ? messages.slice(-10).map((m: any) => `${m.senderId === userId ? userNickname : partnerNickname}: ${m.text}`).join("\n")
    : "No recent conversation history.";

  const client = getGeminiClient();
  if (!client) {
    // Generate an intelligent context-aware mock love letter
    await new Promise(r => setTimeout(r, 1000)); // realistic thinking delay
    
    let dynamicSnippet = "our shared moments";
    if (Array.isArray(messages) && messages.length > 0) {
      const texts = messages.filter((m: any) => m.text && m.text.length > 5 && !m.text.includes("🎨") && !m.text.includes("❤️")).map((m: any) => m.text);
      if (texts.length > 0) {
        const lastText = texts[texts.length - 1];
        dynamicSnippet = `us talking about "${lastText.substring(0, 40)}${lastText.length > 40 ? '...' : ''}"`;
      }
    }

    const fallbackLetters = [
      `Hey ${partnerNickname}, thinking about ${dynamicSnippet} just made me want to say: you make every ordinary moment feel extraordinary. I'm so lucky to have you by my side. ❤️`,
      `Dearest ${partnerNickname}, our chat about ${dynamicSnippet} makes me smile so much. You're my favorite person in the entire world, and I cherish every conversation we share. ✨`,
      `To my favorite ${partnerNickname}, ${dynamicSnippet} reminded me of how much warmth and joy you bring into my life. Thank you for being my constant happy place. 🥰`
    ];
    const letter = fallbackLetters[Math.floor(Math.random() * fallbackLetters.length)];
    return res.json({ text: letter, fallbackUsed: true });
  }

  try {
    const prompt = `Write a very short, cute, and romantic message (1 to 3 sentences maximum) from ${userNickname} to ${partnerNickname}.
    
    Base the message directly on their recent chat conversation history here:
    """
    ${transcript}
    """
    
    The message should feel like a natural, sweet follow-up or reply inspired by what they were just talking about. Do not be overly dramatic; keep it authentic, intimate, and warm. Do NOT use quotation marks or markdown around the response. Just return the raw message.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an affectionate, genuine partner writing a quick, sweet romantic message to your partner based on your recent chat topics.",
        temperature: 0.85,
      }
    });

    res.json({ text: response.text?.trim() });
  } catch (error: any) {
    console.error("Gemini context love letter generation failed:", error);
    res.status(500).json({ error: "Failed to generate AI message based on context." });
  }
});

// 1. AI Love Letter Generator Route
app.post("/api/gemini/love-letter", async (req, res) => {
  const { writerName, partnerName, relationshipLength, tone, favoriteMemories } = req.body;
  
  const client = getGeminiClient();
  if (!client) {
    // Elegant fallback response
    const fallbackLetters: Record<string, string> = {
      romantic: `My Dearest ${partnerName},\n\nEvery single day spent with you feels like a beautiful dream I never want to wake up from. Looking back on our ${relationshipLength || 'time together'}, and thinking about how we shared "${favoriteMemories || 'so many sweet smiles'}", my heart overflows with gratitude. You are my home, my anchor, and my favorite adventure. Thank you for loving me exactly as I am.\n\nWith all my love forever,\n${writerName}`,
      playful: `Hey ${partnerName}! 💕\n\nJust a quick love letter to remind you that you're stuck with me! Over our ${relationshipLength || 'amazing journey'}, we've accumulated so many silly and perfect moments, like "${favoriteMemories || 'our favorite late night talks'}". You are the cheese to my macaroni, the bounce in my step, and the absolute highlight of my day. Love you to the moon and back!\n\nYours,\n${writerName}`,
      poetic: `To my beloved ${partnerName},\n\nLike wind through the autumn trees, your love swept into my life and changed the landscape of my soul. Our ${relationshipLength || 'sacred years together'} are a tapestry of light, woven with memories of "${favoriteMemories || 'quiet, stolen glances'}". You are the poetry I never knew how to write, the song my heart hums in the quiet hours of night.\n\nEternally yours,\n${writerName}`
    };
    const selectedTone = (tone || 'romantic').toLowerCase();
    const fallback = fallbackLetters[selectedTone] || fallbackLetters.romantic;
    
    // Add a small delay to simulate network latency
    await new Promise(r => setTimeout(r, 800));
    return res.json({ text: fallback, fallbackUsed: true });
  }

  try {
    const prompt = `Write a beautiful, highly personalized love letter from ${writerName} to their partner ${partnerName}.
    Relationship length: ${relationshipLength || "some wonderful time"}.
    Style/Tone: ${tone || "deeply romantic"}.
    Include these memories or themes: "${favoriteMemories || "our shared smiles, quiet late-night talks, and growing closer every day"}".
    Make it feel emotionally intimate, premium, sincere, and free of generic clichés. Keep it formatted with paragraph breaks and sign off elegantly from ${writerName}.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class romantic writer, skilled at crafting deeply moving, personalized love letters. Capture authentic human warmth and intimacy.",
        temperature: 0.8,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Love Letter generation failed:", error);
    res.status(500).json({ error: "Failed to generate love letter. Please try again." });
  }
});

// 2. AI Gift Suggestions Route
app.post("/api/gemini/gift-suggestions", async (req, res) => {
  const { partnerLikes, occasion, budget, loveLanguage } = req.body;

  const client = getGeminiClient();
  if (!client) {
    // Elegant fallback response
    await new Promise(r => setTimeout(r, 800));
    return res.json({
      fallbackUsed: true,
      suggestions: [
        {
          title: "Customized Star Map of Your First Date",
          description: "A beautifully framed printed map of the constellations exactly as they appeared on the night you first met or your anniversary.",
          type: "Sentimental",
          budgetMatch: "Under $50"
        },
        {
          title: "DIY 'Open When' Letters & Memory Jar",
          description: "Handwritten letters for specific emotional moments (e.g., 'Open when you miss me'), paired with a jar of folded sticky notes of your favorite times.",
          type: "Experiences / Words",
          budgetMatch: "Under $20"
        },
        {
          title: "Couples Cooking & Painting Masterclass",
          description: "An interactive online experience where you cook a premium dinner and paint canvas side-by-side with cozy candlelight.",
          type: "Experiential",
          budgetMatch: "Custom"
        }
      ]
    });
  }

  try {
    const prompt = `Generate 3-4 creative and premium romantic gift suggestions for my partner.
    Partner's interests/likes: ${partnerLikes || "music, cozy dates, books, photography"}.
    Occasion: ${occasion || "Anniversary"}.
    Budget level: ${budget || "moderate"}.
    Their primary love language: ${loveLanguage || "Quality Time"}.
    
    Return the response strictly as a JSON array of objects with 'title', 'description', 'type' (e.g. Sentimental, Experience, Physical), and 'budgetMatch'. Do not write markdown markers or triple backticks. Just return valid raw JSON array.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an expert personalized gift planner who recommends romantic, high-thoughtfulness ideas.",
      }
    });

    const cleanText = response.text || "[]";
    res.json({ suggestions: JSON.parse(cleanText) });
  } catch (error) {
    console.error("Gemini Gift Suggestions failed:", error);
    res.status(500).json({ error: "Failed to generate suggestions." });
  }
});

// 3. AI Date Planner Route
app.post("/api/gemini/date-planner", async (req, res) => {
  const { locationPreference, budgetLevel, activeOrChill, partnerName } = req.body;

  const client = getGeminiClient();
  if (!client) {
    await new Promise(r => setTimeout(r, 800));
    return res.json({
      fallbackUsed: true,
      itinerary: [
        {
          time: "4:00 PM",
          activity: "Stargazing Picnic at a Local Scenic Viewpoint",
          detail: `Set up a thick, plush blanket with fairy lights. Bring a thermos of hot cocoa or custom mocktails and their favorite snacks.`
        },
        {
          time: "6:30 PM",
          activity: "Interactive Fondue Dinner",
          detail: "Either visit a cozy local bistro or prepare a double-boiler fondue setup at home with gourmet chocolates, strawberries, and soft music."
        },
        {
          time: "9:00 PM",
          activity: "Wishes & Sparklers Session",
          detail: "Write down three goals or dreams for the coming year, place them in a glass bottle to bury or keep, then light sparklers to celebrate."
        }
      ]
    });
  }

  try {
    const prompt = `Create a surprise 3-step romantic date itinerary.
    Preference: ${locationPreference || "Cozy indoor or beautiful nature outdoor"}.
    Budget: ${budgetLevel || "low to moderate"}.
    Style: ${activeOrChill || "relaxed, romantic and intimate"}.
    
    Return the response strictly as a JSON array of objects with fields: 'time', 'activity', and 'detail'. Do not write markdown. Just return raw JSON array.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a master romantic date curator who plans memorable, cohesive, high-emotion experiences for couples.",
      }
    });

    const cleanText = response.text || "[]";
    res.json({ itinerary: JSON.parse(cleanText) });
  } catch (error) {
    console.error("Gemini Date Planner failed:", error);
    res.status(500).json({ error: "Failed to generate date planner." });
  }
});

// 4. Smart Love AI Question Generator Route
app.get("/api/gemini/smart-question", async (req, res) => {
  const client = getGeminiClient();
  if (!client) {
    const fallbackQuestions = [
      "What made you smile the most about your partner today?",
      "If you could teleport to any place in the world together right now, where would it be?",
      "What is a small, quiet moment with your partner that you secretly cherish?",
      "Which song immediately reminds you of the day you first realized you were falling in love?",
      "What food should you try cooking together for your next cozy movie night?"
    ];
    const randomQuestion = fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)];
    return res.json({ question: randomQuestion, fallbackUsed: true });
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Generate a single, deeply thoughtful, emotionally warm connection question for a couple to ask each other to build intimacy. It should be cute, open-ended, and prompt a beautiful memory.",
      config: {
        systemInstruction: "You are a relationship therapist and intimacy expert. Generate single-sentence prompts that help couples connect deeply.",
        temperature: 0.9,
      }
    });

    res.json({ question: response.text?.trim() });
  } catch (error) {
    console.error("Gemini question generator failed:", error);
    res.status(500).json({ error: "Failed to generate question" });
  }
});

// Serve static assets in production, otherwise Vite will handle it in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve SPA router index.html for any request
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LoveLoop custom full-stack server running on port ${PORT}`);
  });
}

startServer();
