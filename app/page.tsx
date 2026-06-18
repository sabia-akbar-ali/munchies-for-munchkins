"use client";

import { useState } from "react";

const AGE_OPTIONS = [
  "6 months", "9 months", "12 months", "18 months",
  "2 years", "3 years", "4 years", "5 years"
];

const TEXTURE_OPTIONS = [
  { value: "Purée", emoji: "🥣", desc: "Completely smooth" },
  { value: "Mashed", emoji: "🍌", desc: "Soft & lumpier" },
  { value: "Soft & Chunky", emoji: "🥦", desc: "Tender pieces" },
  { value: "Finger Food", emoji: "🖐️", desc: "Self-feeding" },
];

const ALLERGEN_OPTIONS = ["Nut-free", "Dairy-free", "Egg-free", "Gluten-free"];

const EXPERIENCE_OPTIONS = [
  { value: "just starting", label: "Just Starting", emoji: "🌱", desc: "Simple, mild flavours" },
  { value: "getting adventurous", label: "Getting There", emoji: "⭐", desc: "Some variety & spice" },
  { value: "experienced eater", label: "Experienced", emoji: "🏆", desc: "Bold, complex dishes" },
];

const COMMON_INGREDIENTS = [
  "apple", "avocado", "banana", "beef", "beetroot", "black beans", "bread",
  "broccoli", "butter", "butternut squash", "carrot", "cauliflower",
  "cheddar cheese", "chicken", "chickpeas", "cinnamon", "coconut oil",
  "cod", "corn", "courgette", "couscous", "cream cheese", "cucumber",
  "egg", "full-fat yogurt", "garlic", "green beans", "kiwi", "lamb",
  "leek", "lentils", "mango", "melon", "mild cheese", "mushroom", "oats",
  "olive oil", "onion", "parsnip", "pasta", "pea", "peach", "pear",
  "pepper", "plain flour", "plum", "potato", "pumpkin", "quinoa",
  "raspberry", "red pepper", "rice", "salmon", "spinach", "strawberry",
  "sweet potato", "tofu", "tomato", "turkey", "vanilla extract",
  "watermelon", "whole milk",
].sort();

const RECIPE_TABS = [
  { label: "🌱 Simple", key: 0 },
  { label: "⭐ Next Level", key: 1 },
  { label: "👨‍🍳 Chef's Pick", key: 2 },
];

interface Ingredient {
  quantity: string;
  item: string;
}

interface Recipe {
  complexity: string;
  recipeName: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  nutritionalNote: string;
  ageSuitabilityNote: string;
  textureNote: string;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [age, setAge] = useState("12 months");
  const [texture, setTexture] = useState("Mashed");
  const [allergens, setAllergens] = useState<string[]>([]);
  const [halal, setHalal] = useState(false);
  const [experienceLevel, setExperienceLevel] = useState("getting adventurous");
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState(0);
  const [previousRecipeNames, setPreviousRecipeNames] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);

  const filteredSuggestions =
    inputValue.trim().length > 0
      ? COMMON_INGREDIENTS.filter(
          (ing) =>
            ing.includes(inputValue.toLowerCase().trim()) &&
            !ingredients.includes(ing)
        ).slice(0, 6)
      : [];

  const addIngredient = (val?: string) => {
    const toAdd = (val ?? inputValue).trim().toLowerCase();
    if (toAdd && !ingredients.includes(toAdd)) {
      setIngredients((prev) => [...prev, toAdd]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeIngredient = (item: string) => {
    setIngredients(ingredients.filter((i) => i !== item));
  };

  const PUREE_ONLY_AGES = ["6 months"];
  const NO_FINGER_FOOD_AGES = ["6 months", "9 months"];

  const handleAgeChange = (selectedAge: string) => {
    setAge(selectedAge);
    if (PUREE_ONLY_AGES.includes(selectedAge)) {
      setTexture("Purée");
    } else if (NO_FINGER_FOOD_AGES.includes(selectedAge) && texture === "Finger Food") {
      setTexture("Mashed");
    }
  };

  const toggleAllergen = (a: string) => {
    setAllergens(
      allergens.includes(a) ? allergens.filter((x) => x !== a) : [...allergens, a]
    );
  };

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient.");
      return;
    }
    setError("");
    setLoading(true);
    setRecipes(null);
    try {
      const res = await fetch("/api/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          age,
          texture,
          allergens,
          halal,
          experienceLevel,
          previousRecipeNames,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRecipes(data.recipes);
      setSelectedRecipe(0);
      setPreviousRecipeNames((prev) => [
        ...prev,
        ...data.recipes.map((r: Recipe) => r.recipeName),
      ]);
    } catch {
      setError("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setRecipes(null);
    setIngredients([]);
    setInputValue("");
    setAge("12 months");
    setTexture("Mashed");
    setAllergens([]);
    setHalal(false);
    setExperienceLevel("getting adventurous");
    setError("");
    setPreviousRecipeNames([]);
  };

  if (!showGenerator) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #fff8ee 0%, #ffeedd 100%)" }}>
        <header className="text-center pt-12 pb-6 px-6">
          <div className="text-6xl mb-3">🍽️👶</div>
          <h1 className="text-4xl font-black text-orange-500 tracking-tight">Munchies for Munchkins</h1>
          <p className="text-lg text-amber-700 font-semibold mt-2">AI recipes from ingredients you already have</p>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="text-5xl mb-4">✨</div>
            <h2 className="text-2xl font-black text-gray-800 mb-3">What&apos;s in your kitchen?</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tell us what ingredients you have at home and we&apos;ll create safe, nutritious, and tasty recipes perfectly suited to your little one&apos;s age and needs.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              {[
                { emoji: "👶", text: "Age-appropriate recipes" },
                { emoji: "🌿", text: "Allergen filters" },
                { emoji: "✅", text: "Halal option" },
                { emoji: "⚡", text: "3 options at once" },
              ].map((f) => (
                <div key={f.text} className="bg-orange-50 rounded-xl p-3 flex items-center gap-2 text-left">
                  <span className="text-xl">{f.emoji}</span>
                  <span className="font-semibold text-orange-800">{f.text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowGenerator(true)}
              className="w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg transition-transform hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #f97316, #fb923c)" }}
            >
              Get Recipes 🍳
            </button>
            <p className="text-xs text-gray-400 mt-4">For babies and toddlers aged 6 months to 5 years</p>
          </div>
        </main>

        <footer className="text-center pb-6 text-xs text-gray-400 px-6">
          Every child develops differently. Age guidance is a general suggestion only. Always consult your health visitor or GP before introducing new foods. This app does not provide medical advice.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: "linear-gradient(135deg, #fff8ee 0%, #ffeedd 100%)" }}>
      <header className="sticky top-0 z-10 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <button onClick={() => { setShowGenerator(false); setRecipes(null); }} className="text-orange-400 font-bold text-sm">← Back</button>
        <span className="font-black text-orange-500 text-lg">🍽️ Munchies for Munchkins</span>
        <div className="w-12" />
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {!recipes ? (
          <>
            {/* Age */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wide">👶 Child&apos;s Age</h3>
              <div className="flex flex-wrap gap-2">
                {AGE_OPTIONS.map((a) => (
                  <button
                    key={a}
                    onClick={() => handleAgeChange(a)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                      age === a
                        ? "border-orange-400 bg-orange-400 text-white"
                        : "border-orange-200 text-orange-600 hover:border-orange-400"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience level */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wide">🍴 Eating Experience</h3>
              <div className="grid grid-cols-3 gap-2">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setExperienceLevel(opt.value)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      experienceLevel === opt.value
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-100 hover:border-orange-200"
                    }`}
                  >
                    <div className="text-2xl">{opt.emoji}</div>
                    <div className="font-bold text-xs text-gray-700 mt-1">{opt.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Texture */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wide">🥄 Texture</h3>
              <div className="grid grid-cols-2 gap-2">
                {TEXTURE_OPTIONS.map((t) => {
                  const isDisabled =
                    (PUREE_ONLY_AGES.includes(age) && t.value !== "Purée") ||
                    (NO_FINGER_FOOD_AGES.includes(age) && t.value === "Finger Food");
                  return (
                    <button
                      key={t.value}
                      onClick={() => !isDisabled && setTexture(t.value)}
                      disabled={isDisabled}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        isDisabled
                          ? "border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed"
                          : texture === t.value
                          ? "border-orange-400 bg-orange-50"
                          : "border-gray-100 hover:border-orange-200"
                      }`}
                    >
                      <div className="text-2xl">{t.emoji}</div>
                      <div className="font-bold text-sm text-gray-700">{t.value}</div>
                      <div className="text-xs text-gray-400">{isDisabled ? "Not suitable for this age" : t.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wide">🛒 Your Ingredients</h3>
              <div className="relative">
                <div className="flex gap-2 mb-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addIngredient();
                    }}
                    placeholder="e.g. sweet potato, chicken..."
                    className="flex-1 border-2 border-orange-200 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:border-orange-400"
                  />
                  <button
                    onClick={() => addIngredient()}
                    className="px-4 py-2 rounded-xl text-white font-black text-sm"
                    style={{ background: "#f97316" }}
                  >
                    Add
                  </button>
                </div>

                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-20 bg-white border-2 border-orange-200 rounded-xl shadow-lg overflow-hidden">
                    {filteredSuggestions.map((s) => (
                      <button
                        key={s}
                        onMouseDown={() => addIngredient(s)}
                        onTouchStart={() => addIngredient(s)}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-orange-50 border-b border-gray-50 last:border-0 capitalize"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400 mb-3">Start typing to see suggestions, or type any ingredient and tap Add</p>

              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ing) => (
                    <span key={ing} className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold capitalize">
                      {ing}
                      <button onClick={() => removeIngredient(ing)} className="ml-1 text-orange-400 hover:text-orange-700">×</button>
                    </span>
                  ))}
                </div>
              )}
              {error && <p className="text-red-400 text-sm font-semibold mt-2">{error}</p>}
            </div>

            {/* Allergens & Halal */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-black text-gray-700 mb-3 text-sm uppercase tracking-wide">⚠️ Dietary Needs</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {ALLERGEN_OPTIONS.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAllergen(a)}
                    className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
                      allergens.includes(a)
                        ? "border-green-400 bg-green-100 text-green-700"
                        : "border-gray-200 text-gray-500 hover:border-green-300"
                    }`}
                  >
                    {allergens.includes(a) ? "✓ " : ""}{a}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setHalal(!halal)}
                className={`flex items-center gap-3 w-full p-3 rounded-xl border-2 transition-all ${
                  halal ? "border-green-400 bg-green-50" : "border-gray-100 hover:border-green-200"
                }`}
              >
                <span className="text-xl">🌙</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-sm text-gray-700">Halal</div>
                  <div className="text-xs text-gray-400">Halal ingredients only</div>
                </div>
                <div className={`w-10 h-6 rounded-full transition-colors relative ${halal ? "bg-green-400" : "bg-gray-200"}`}>
                  <div
                    className="w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-all"
                    style={{ left: halal ? "18px" : "2px" }}
                  />
                </div>
              </button>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateRecipe}
              disabled={loading || ingredients.length === 0}
              className="w-full py-5 rounded-2xl text-white font-black text-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{
                background:
                  loading || ingredients.length === 0
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #f97316, #fb923c)",
              }}
            >
              {loading ? "🍳 Cooking up 3 recipes..." : "✨ Generate My Recipes"}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            {/* Recipe tabs */}
            <div className="bg-white rounded-2xl p-2 shadow-sm flex gap-1">
              {RECIPE_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedRecipe(tab.key)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all ${
                    selectedRecipe === tab.key
                      ? "text-white shadow-sm"
                      : "text-gray-400 hover:text-orange-500"
                  }`}
                  style={
                    selectedRecipe === tab.key
                      ? { background: "linear-gradient(135deg, #f97316, #fb923c)" }
                      : {}
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {recipes[selectedRecipe] && (
              <>
                <div className="bg-white rounded-3xl p-6 shadow-sm">
                  <div className="text-4xl text-center mb-3">🍽️</div>
                  <h2 className="text-2xl font-black text-gray-800 text-center mb-2">{recipes[selectedRecipe].recipeName}</h2>
                  <p className="text-gray-600 text-center mb-4">{recipes[selectedRecipe].description}</p>
                  <div className="flex justify-center gap-4 text-sm text-gray-500 font-semibold mb-4">
                    <span>⏱ Prep: {recipes[selectedRecipe].prepTime}</span>
                    <span>🔥 Cook: {recipes[selectedRecipe].cookTime}</span>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-3 text-sm text-orange-700 font-semibold text-center">
                    {recipes[selectedRecipe].textureNote}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-gray-700 mb-3">🛒 Ingredients</h3>
                  <ul className="space-y-2">
                    {recipes[selectedRecipe].ingredients.map((ing, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="text-orange-400 font-black">•</span>
                        <span className="font-semibold text-gray-600">{ing.quantity}</span>
                        <span className="text-gray-700">{ing.item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-gray-700 mb-3">👩‍🍳 Instructions</h3>
                  <ol className="space-y-3">
                    {recipes[selectedRecipe].instructions.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span
                          className="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: "#f97316" }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-gray-700 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-green-50 rounded-2xl p-4 text-sm text-green-700 font-semibold">
                    🥦 <strong>Nutrition:</strong> {recipes[selectedRecipe].nutritionalNote}
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700 font-semibold">
                    👶 <strong>Age note:</strong> {recipes[selectedRecipe].ageSuitabilityNote}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 text-xs text-amber-700 border border-amber-200">
                  ⚠️ <strong>Important Disclaimer:</strong> Every child develops at a different pace. The age guidance in this app is a general suggestion only — it does not account for your individual child&apos;s development, readiness, or medical needs. Always follow your child&apos;s lead and consult your health visitor, GP, or paediatric dietitian before introducing new foods, especially if your child has allergies, intolerances, or any health conditions. Introduce new foods one at a time and watch for any reactions. This app does not provide medical or nutritional advice.
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={generateRecipe}
                disabled={loading}
                className="py-4 rounded-2xl text-white font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #f97316, #fb923c)" }}
              >
                {loading ? "🍳 Cooking..." : "🔄 Try Different"}
              </button>
              <button
                onClick={reset}
                className="py-4 rounded-2xl font-black text-sm border-2 border-orange-300 text-orange-500 hover:bg-orange-50 transition-colors"
              >
                🛒 New Ingredients
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
