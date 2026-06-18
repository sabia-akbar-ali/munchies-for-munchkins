import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { ingredients, age, texture, allergens, halal, experienceLevel, previousRecipeNames } = await req.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
    }

    const allergenList = allergens.length > 0 ? allergens.join(", ") : "none";
    const halalNote = halal ? "All recipes must use only halal ingredients (no pork, no alcohol, halal meat only)." : "";
    const avoidNote =
      previousRecipeNames && previousRecipeNames.length > 0
        ? `Do NOT repeat or closely resemble these previously suggested recipes: ${previousRecipeNames.slice(-12).join(", ")}.`
        : "";

    const prompt = `You are a specialist in baby and toddler nutrition. Generate THREE different recipes for a child aged ${age}.

STRICT RULE — Ingredients: You may ONLY use the ingredients the user has listed below. Do not add any extra ingredients to the recipe itself, even common ones like vanilla extract, lemon juice, herbs, or spices, unless the user has listed them.

The ONLY exceptions (always assumed to be in any kitchen):
- A tiny pinch of salt (omit entirely for under 12 months)
- A tiny pinch of black pepper (only for 2 years+)
- Water (for boiling/steaming only)

Ingredients the user has:
${ingredients.join(", ")}

For each recipe, you MUST also provide an "optionalSeasonings" list — 2 to 4 suggestions of herbs, spices, or flavourings the parent could add IF they have them at home. These are NOT part of the recipe — they are optional enhancements listed separately. Focus on what would genuinely improve the dish (e.g. "a pinch of cinnamon", "a few drops of vanilla extract", "a squeeze of lemon juice", "a pinch of cumin").

Requirements for ALL recipes:
- Texture: ${texture}
- Eating experience level: ${experienceLevel}
- Allergen-free from: ${allergenList}
${halalNote}
- Must be completely safe for a ${age} old child
- No salt for under 12 months
- No honey for under 12 months
- No whole nuts for under 5 years
${avoidNote}

Generate exactly 3 DISTINCTLY DIFFERENT dishes in increasing complexity:

Recipe 1 - SIMPLE: Quick and easy. Basic cooking method, familiar mild flavours, minimal steps. Uses the fewest ingredients.

Recipe 2 - NEXT LEVEL: More interesting. Creative flavour combination, more complete meal structure, or a slightly more complex preparation method.

Recipe 3 - CHEF'S PICK: Most ambitious. Restaurant-inspired, creative flavour pairing, more cooking steps. Still completely safe for the age but impressive and satisfying.

If experience level is "experienced eater" and the child is 18 months or older, all three recipes should be proper plated meals (not just simple finger foods) with bold but age-appropriate flavours and seasoning.

All 3 must be distinctly different dishes — not variations of the same base recipe.

Respond with ONLY a valid JSON object, no markdown, no extra text:
{
  "recipes": [
    {
      "complexity": "simple",
      "recipeName": "string",
      "description": "string (1-2 sentences)",
      "ingredients": [{"quantity": "string", "item": "string"}],
      "instructions": ["step 1", "step 2", "step 3"],
      "prepTime": "string (e.g. 5 mins)",
      "cookTime": "string (e.g. 15 mins)",
      "nutritionalNote": "string (1 sentence about key nutrients)",
      "ageSuitabilityNote": "string (1 sentence about why suitable for this age)",
      "textureNote": "string (1 sentence describing the texture)",
      "optionalSeasonings": ["e.g. a pinch of cinnamon", "a squeeze of lemon juice"]
    },
    {
      "complexity": "next level",
      "recipeName": "string",
      "description": "string",
      "ingredients": [{"quantity": "string", "item": "string"}],
      "instructions": ["step 1", "step 2", "step 3"],
      "prepTime": "string",
      "cookTime": "string",
      "nutritionalNote": "string",
      "ageSuitabilityNote": "string",
      "textureNote": "string",
      "optionalSeasonings": ["string"]
    },
    {
      "complexity": "chef's pick",
      "recipeName": "string",
      "description": "string",
      "ingredients": [{"quantity": "string", "item": "string"}],
      "instructions": ["step 1", "step 2", "step 3"],
      "prepTime": "string",
      "cookTime": "string",
      "nutritionalNote": "string",
      "ageSuitabilityNote": "string",
      "textureNote": "string",
      "optionalSeasonings": ["string"]
    }
  ]
}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const raw = content.text.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/i, "").trim();
    const parsed = JSON.parse(raw);

    if (!parsed.recipes || !Array.isArray(parsed.recipes) || parsed.recipes.length < 1) {
      throw new Error("Invalid recipe response");
    }

    return NextResponse.json({ recipes: parsed.recipes });
  } catch (error) {
    console.error("Recipe generation error:", error);
    return NextResponse.json({ error: "Failed to generate recipe. Please try again." }, { status: 500 });
  }
}
