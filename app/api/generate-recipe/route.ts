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

Ingredients available (use these as the base):
${ingredients.join(", ")}

You MAY also use these pantry staples and flavourings to make the recipes genuinely tasty:
- Oils & fats: olive oil, coconut oil, butter
- Liquids: water, stock (low-salt), coconut milk, whole milk
- Herbs (fresh or dried): basil, oregano, thyme, rosemary, parsley, coriander, mint, dill, chives
- Mild spices: cinnamon, cumin, turmeric, coriander, ginger (ground), mild paprika, mild curry powder, garlic powder, onion powder, mixed spice, vanilla extract
- Acids: lemon juice, lime juice
- Sweeteners (12m+): a small amount of honey or maple syrup
- Salt: tiny pinch only for 12m–3yrs; none for under 12 months
Do NOT use: chilli, hot spices, black pepper (except a tiny pinch for 3yrs+), or large amounts of salt.
IMPORTANT: Always use at least 2–3 of these flavourings in each recipe to ensure the food is genuinely tasty and not bland.

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
      "textureNote": "string (1 sentence describing the texture)"
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
      "textureNote": "string"
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
      "textureNote": "string"
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
