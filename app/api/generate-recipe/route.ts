import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { ingredients, age, texture, allergens, halal } = await req.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
    }

    const allergenList = allergens.length > 0 ? allergens.join(", ") : "none";
    const halalNote = halal ? "The recipe must use only halal ingredients (no pork, no alcohol, halal meat only)." : "";

    const prompt = `You are a specialist in baby and toddler nutrition. Generate a safe, nutritious, and delicious recipe for a child aged ${age}.

Ingredients available (use ONLY these plus basic pantry staples like olive oil, water, salt in tiny amounts if age-appropriate):
${ingredients.join(", ")}

Requirements:
- Texture: ${texture}
- Allergen-free from: ${allergenList}
${halalNote}
- Must be completely safe and appropriate for a ${age} old child
- Keep salt to an absolute minimum (none for under 12 months)
- No honey for under 12 months
- No whole nuts for under 5 years

Respond with ONLY a valid JSON object in exactly this format, no markdown, no extra text:
{
  "recipeName": "string",
  "description": "string (1-2 sentences)",
  "ingredients": [{"quantity": "string", "item": "string"}],
  "instructions": ["step 1", "step 2", "step 3"],
  "prepTime": "string (e.g. 5 mins)",
  "cookTime": "string (e.g. 15 mins)",
  "nutritionalNote": "string (1 sentence about key nutrients)",
  "ageSuitabilityNote": "string (1 sentence about why this is suitable for this age)",
  "textureNote": "string (1 sentence describing the texture)"
}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Strip markdown code blocks if Claude wraps the JSON
    const raw = content.text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    const recipe = JSON.parse(raw);
    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Recipe generation error:", error);
    return NextResponse.json({ error: "Failed to generate recipe. Please try again." }, { status: 500 });
  }
}
