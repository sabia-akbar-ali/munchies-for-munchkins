"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
  { value: "just starting", label: "Just Starting", emoji: "🌱", desc: "Simple, mild flavours", color: "#16A34A", bg: "#DCFCE7", border: "#86EFAC" },
  { value: "getting adventurous", label: "Getting There", emoji: "⭐", desc: "Some variety & spice", color: "#D97706", bg: "#FEF3C7", border: "#FCD34D" },
  { value: "experienced eater", label: "Experienced", emoji: "🏆", desc: "Bold, complex dishes", color: "#7C3AED", bg: "#F5F3FF", border: "#C4B5FD" },
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

const INGREDIENT_CATEGORIES = [
  { name: "🍎 Fruit", items: ["apple", "avocado", "banana", "kiwi", "mango", "melon", "peach", "pear", "plum", "raspberry", "strawberry", "watermelon"] },
  { name: "🥦 Vegetables", items: ["beetroot", "broccoli", "butternut squash", "carrot", "cauliflower", "corn", "courgette", "cucumber", "green beans", "leek", "mushroom", "onion", "parsnip", "pea", "pepper", "potato", "pumpkin", "red pepper", "spinach", "sweet potato", "tomato"] },
  { name: "🍗 Protein", items: ["beef", "black beans", "chicken", "chickpeas", "cod", "egg", "lamb", "lentils", "salmon", "tofu", "turkey"] },
  { name: "🧀 Dairy", items: ["butter", "cheddar cheese", "cream cheese", "full-fat yogurt", "mild cheese", "whole milk"] },
  { name: "🌾 Grains", items: ["bread", "couscous", "oats", "pasta", "plain flour", "quinoa", "rice"] },
  { name: "🫙 Pantry", items: ["cinnamon", "coconut oil", "garlic", "olive oil", "vanilla extract"] },
];

const RECIPE_TABS = [
  { label: "Simple", emoji: "🌱", key: 0, color: "#16A34A", gradient: "linear-gradient(135deg, #22C55E, #4ADE80)", tagline: "Quick & easy" },
  { label: "Next Level", emoji: "⭐", key: 1, color: "#EA7316", gradient: "linear-gradient(135deg, #F97316, #FB923C)", tagline: "More creative" },
  { label: "Chef's Pick", emoji: "👨‍🍳", key: 2, color: "#7C3AED", gradient: "linear-gradient(135deg, #7C3AED, #A78BFA)", tagline: "Most impressive" },
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
  optionalSeasonings?: string[];
}

function SafetyModal({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-8 overflow-y-auto" style={{ maxHeight: "90vh" }}>
        <div className="text-center mb-5">
          <span className="text-4xl">👩‍🍳</span>
          <h2 className="font-black text-gray-800 text-xl mt-2 leading-tight">A few things before you get cooking</h2>
          <p className="text-sm text-gray-500 mt-1">You know your child best — we&apos;re just here to help with ideas</p>
        </div>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="rounded-2xl p-4" style={{ background: "#F0FDF4", border: "1.5px solid #BBF7D0" }}>
            <p className="font-black text-green-700 mb-1">🤖 Recipes are AI-powered starting points</p>
            <p>Our recipes are created by AI, which means they&apos;re inspiration to build from — not a strict rulebook. You&apos;re the expert on your kitchen and your little one, so always trust your instincts.</p>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "#FFF7ED", border: "1.5px solid #FED7AA" }}>
            <p className="font-black text-orange-700 mb-1">👨‍👩‍👧 You&apos;re in charge</p>
            <p>This app is designed for parents and carers. You know your child&apos;s readiness, abilities, and preferences better than any app — we&apos;re here to spark ideas, not replace your judgement.</p>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A" }}>
            <p className="font-black text-amber-700 mb-1">🥜 Always check for your child&apos;s needs</p>
            <p>Our AI doesn&apos;t know your child personally. Before cooking, always check ingredients against any allergies, intolerances, or dietary needs your little one has.</p>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "#F5F0FF", border: "1.5px solid #DDD6FE" }}>
            <p className="font-black text-purple-700 mb-1">🍓 Adapt textures to suit your little one</p>
            <p>Every child develops at their own pace. We&apos;ll suggest textures based on age, but always adjust portion sizes, cutting styles, and consistency to match where your child is right now.</p>
          </div>

          <div className="rounded-2xl p-4" style={{ background: "#F0F9FF", border: "1.5px solid #BAE6FD" }}>
            <p className="font-black text-blue-700 mb-1">💙 When in doubt, ask a professional</p>
            <p>These recipes are ideas to inspire you, not professional nutritional advice. Your health visitor, GP, or paediatric dietitian are always the best people to turn to for personalised guidance.</p>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="w-full mt-6 py-4 rounded-2xl text-white font-black text-base shadow-lg"
          style={{ background: "linear-gradient(135deg, #F97316, #EC4899)" }}
        >
          Got it — let&apos;s get cooking! 🍳
        </button>
      </div>
    </div>
  );
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
  const [showBrowse, setShowBrowse] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("mfm_safety_seen");
    if (!seen) setShowSafetyModal(true);
  }, []);

  const dismissSafetyModal = () => {
    localStorage.setItem("mfm_safety_seen", "1");
    setShowSafetyModal(false);
  };

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

  const toggleBrowseIngredient = (item: string) => {
    setIngredients((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
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

  const activeTab = RECIPE_TABS[selectedRecipe];

  if (!showGenerator) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg, #FFD6D0 0%, #C5EDE8 100%)" }}>
        {showSafetyModal && <SafetyModal onDismiss={dismissSafetyModal} />}
        <header className="text-center pt-12 pb-6 px-6">
          <div className="flex justify-center mb-4">
            <Image src="/icon-512.png" alt="Munchies for Munchkins" width={96} height={96} className="rounded-3xl shadow-lg" />
          </div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: "#E8601A" }}>Munchies for Munchkins</h1>
          <p className="text-lg font-semibold mt-2" style={{ color: "#0F766E" }}>AI recipes from ingredients you already have</p>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-black text-gray-800 mb-3">What&apos;s in your kitchen?</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Tell us what ingredients you have at home and we&apos;ll create safe, nutritious, and tasty recipes perfectly suited to your little one&apos;s age and needs.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              {[
                { emoji: "👶", text: "Age-appropriate recipes", bg: "#F5F0FF", color: "#6B21A8" },
                { emoji: "🌿", text: "Allergen filters", bg: "#DCFCE7", color: "#15803D" },
                { emoji: "✅", text: "Halal option", bg: "#E0F7F4", color: "#0F766E" },
                { emoji: "⚡", text: "3 options at once", bg: "#FEF3C7", color: "#92400E" },
              ].map((f) => (
                <div key={f.text} className="rounded-xl p-3 flex items-center gap-2 text-left" style={{ background: f.bg }}>
                  <span className="text-xl">{f.emoji}</span>
                  <span className="font-semibold text-sm" style={{ color: f.color }}>{f.text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowGenerator(true)}
              className="w-full py-4 rounded-2xl text-white font-black text-lg shadow-lg transition-transform hover:scale-105 active:scale-95"
              style={{ background: "linear-gradient(135deg, #F97316, #EC4899)" }}
            >
              Get Recipes 🍳
            </button>
            <p className="text-xs text-gray-400 mt-4">For babies and toddlers aged 6 months to 5 years</p>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "#F0F9FF", color: "#0369A1" }}>🤖 AI-generated recipes</span>
              <span className="text-gray-300">·</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "#F0F9FF", color: "#0369A1" }}>Always check with your GP</span>
            </div>
          </div>
        </main>

        <footer className="text-center pb-6 text-xs text-gray-500 px-6 space-y-2">
          <p>Every child develops differently. Always consult your health visitor or GP before introducing new foods.</p>
          <button onClick={() => setShowSafetyModal(true)} className="underline font-semibold text-gray-400">ⓘ How this app works & important info</button>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16" style={{ background: "linear-gradient(135deg, #FFD6D0 0%, #C5EDE8 100%)" }}>
      {showSafetyModal && <SafetyModal onDismiss={dismissSafetyModal} />}
      <header className="sticky top-0 z-10 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
        <button onClick={() => { setShowGenerator(false); setRecipes(null); }} className="font-bold text-sm" style={{ color: "#F97316" }}>← Back</button>
        <div className="flex items-center gap-2">
          <Image src="/icon-512.png" alt="" width={28} height={28} className="rounded-lg" />
          <span className="font-black text-lg" style={{ color: "#E8601A" }}>Munchies for Munchkins</span>
        </div>
        <button onClick={() => setShowSafetyModal(true)} className="text-gray-400 text-xl font-black w-10 text-right" title="Safety notice">ⓘ</button>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {!recipes ? (
          <>
            {/* Age */}
            <div className="rounded-2xl p-5 shadow-sm" style={{ background: "#F5F0FF" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0" style={{ background: "#7C3AED" }}>1</div>
                <h3 className="font-black text-base uppercase tracking-wide" style={{ color: "#6B21A8" }}>👶 Child&apos;s Age</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {AGE_OPTIONS.map((a) => (
                  <button
                    key={a}
                    onClick={() => handleAgeChange(a)}
                    className="px-4 py-2 rounded-full text-sm font-bold border-2 transition-all"
                    style={
                      age === a
                        ? { borderColor: "#7C3AED", background: "#7C3AED", color: "white" }
                        : { borderColor: "#C4B5FD", color: "#6B21A8" }
                    }
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience level */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0" style={{ background: "#0F766E" }}>2</div>
                <h3 className="font-black text-base uppercase tracking-wide" style={{ color: "#0F766E" }}>🍴 Eating Experience</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setExperienceLevel(opt.value)}
                    className="p-3 rounded-xl border-2 text-center transition-all"
                    style={
                      experienceLevel === opt.value
                        ? { borderColor: opt.color, background: opt.bg }
                        : { borderColor: "#E5E7EB" }
                    }
                  >
                    <div className="text-2xl">{opt.emoji}</div>
                    <div className="font-bold text-xs mt-1" style={{ color: experienceLevel === opt.value ? opt.color : "#374151" }}>{opt.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Texture */}
            <div className="rounded-2xl p-5 shadow-sm" style={{ background: "#FFFBEB" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0" style={{ background: "#D97706" }}>3</div>
                <h3 className="font-black text-base uppercase tracking-wide" style={{ color: "#92400E" }}>🥄 Texture</h3>
              </div>
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
                      className="p-3 rounded-xl border-2 text-left transition-all"
                      style={
                        isDisabled
                          ? { borderColor: "#F3F4F6", background: "#F9FAFB", opacity: 0.4, cursor: "not-allowed" }
                          : texture === t.value
                          ? { borderColor: "#F59E0B", background: "#FEF3C7" }
                          : { borderColor: "#FDE68A" }
                      }
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
            <div className="rounded-2xl p-5 shadow-sm" style={{ background: "#FFF1EE" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0" style={{ background: "#F97316" }}>4</div>
                <h3 className="font-black text-base uppercase tracking-wide" style={{ color: "#C2410C" }}>🛒 Your Ingredients</h3>
              </div>

              {/* Type to search */}
              <div className="relative mb-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => { setInputValue(e.target.value); setShowSuggestions(true); }}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                    onKeyDown={(e) => { if (e.key === "Enter") addIngredient(); }}
                    placeholder="Type an ingredient..."
                    className="flex-1 border-2 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none bg-white"
                    style={{ borderColor: "#FCA99A" }}
                  />
                  <button
                    onClick={() => addIngredient()}
                    className="px-4 py-2 rounded-xl text-white font-black text-sm"
                    style={{ background: "#F97316" }}
                  >
                    Add
                  </button>
                </div>
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 z-20 bg-white border-2 rounded-xl shadow-lg overflow-hidden" style={{ borderColor: "#FCA99A" }}>
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

              {/* Browse toggle */}
              <button
                onClick={() => setShowBrowse(!showBrowse)}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 text-sm font-bold mt-3 transition-all bg-white"
                style={{ borderColor: showBrowse ? "#F97316" : "#FCA99A", color: "#C2410C" }}
              >
                <span>🗂️ Browse ingredients by category</span>
                <span className="text-lg">{showBrowse ? "▲" : "▼"}</span>
              </button>

              {/* Browse panel */}
              {showBrowse && (
                <div className="mt-3 space-y-4 bg-white rounded-xl p-4 border-2" style={{ borderColor: "#FCA99A" }}>
                  {INGREDIENT_CATEGORIES.map((cat) => (
                    <div key={cat.name}>
                      <p className="text-xs font-black uppercase tracking-wide mb-2" style={{ color: "#C2410C" }}>{cat.name}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.items.map((item) => {
                          const selected = ingredients.includes(item);
                          return (
                            <button
                              key={item}
                              onClick={() => toggleBrowseIngredient(item)}
                              className="px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all capitalize"
                              style={
                                selected
                                  ? { background: "#F97316", borderColor: "#F97316", color: "white" }
                                  : { background: "#FFF1EE", borderColor: "#FCA99A", color: "#C2410C" }
                              }
                            >
                              {selected ? "✓ " : ""}{item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Selected chips */}
              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {ingredients.map((ing) => (
                    <span key={ing} className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold capitalize" style={{ background: "#FECDD3", color: "#BE123C" }}>
                      {ing}
                      <button onClick={() => removeIngredient(ing)} className="ml-1" style={{ color: "#FB7185" }}>×</button>
                    </span>
                  ))}
                </div>
              )}
              {error && <p className="text-red-400 text-sm font-semibold mt-2">{error}</p>}
            </div>

            {/* Allergens & Halal */}
            <div className="rounded-2xl p-5 shadow-sm" style={{ background: "#F0FDF4" }}>
              <h3 className="font-black mb-3 text-sm uppercase tracking-wide" style={{ color: "#15803D" }}>⚠️ Dietary Needs</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {ALLERGEN_OPTIONS.map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAllergen(a)}
                    className="px-4 py-2 rounded-full text-sm font-bold border-2 transition-all"
                    style={
                      allergens.includes(a)
                        ? { borderColor: "#16A34A", background: "#DCFCE7", color: "#15803D" }
                        : { borderColor: "#BBF7D0", color: "#6B7280" }
                    }
                  >
                    {allergens.includes(a) ? "✓ " : ""}{a}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setHalal(!halal)}
                className="flex items-center gap-3 w-full p-3 rounded-xl border-2 transition-all bg-white"
                style={{ borderColor: halal ? "#16A34A" : "#E5E7EB" }}
              >
                <span className="text-xl">🌙</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-sm text-gray-700">Halal</div>
                  <div className="text-xs text-gray-400">Halal ingredients only</div>
                </div>
                <div className="w-10 h-6 rounded-full transition-colors relative" style={{ background: halal ? "#16A34A" : "#D1D5DB" }}>
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
                    ? "#D1D5DB"
                    : "linear-gradient(135deg, #F97316 0%, #EC4899 100%)",
              }}
            >
              {loading ? "🍳 Cooking up 3 recipes..." : "✨ Generate My Recipes"}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            {/* Recipe selector */}
            <div className="rounded-3xl p-4 shadow-sm" style={{ background: "linear-gradient(135deg, #FFF7ED, #F0FDF4)" }}>
              <p className="text-center font-black text-gray-700 text-base mb-1">🎉 Your 3 recipes are ready!</p>
              <p className="text-center text-sm text-gray-500 mb-3">Tap a recipe below to view it</p>
              <div className="flex flex-col gap-3">
                {RECIPE_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSelectedRecipe(tab.key)}
                    className="w-full rounded-2xl transition-all flex items-center gap-4 px-4 py-4 text-left"
                    style={
                      selectedRecipe === tab.key
                        ? { background: tab.gradient, color: "white", boxShadow: "0 6px 18px rgba(0,0,0,0.18)" }
                        : { background: "white", border: `2.5px solid ${tab.color}` }
                    }
                  >
                    <span className="text-3xl flex-shrink-0">{tab.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base" style={selectedRecipe === tab.key ? { color: "white" } : { color: tab.color }}>{tab.label}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={selectedRecipe === tab.key ? { background: "rgba(255,255,255,0.25)", color: "white" } : { background: `${tab.color}18`, color: tab.color }}>{tab.tagline}</span>
                      </div>
                      {recipes && recipes[tab.key] && (
                        <p className="text-sm font-semibold mt-0.5 truncate" style={selectedRecipe === tab.key ? { color: "rgba(255,255,255,0.9)" } : { color: "#6B7280" }}>
                          {recipes[tab.key].recipeName}
                        </p>
                      )}
                    </div>
                    <span className="text-xl flex-shrink-0" style={selectedRecipe === tab.key ? { color: "white" } : { color: tab.color }}>
                      {selectedRecipe === tab.key ? "✓" : "›"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {recipes[selectedRecipe] && (
              <>
                <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ borderTop: `4px solid ${activeTab.color}` }}>
                  <div className="text-4xl text-center mb-3">🍽️</div>
                  <h2 className="text-2xl font-black text-gray-800 text-center mb-2">{recipes[selectedRecipe].recipeName}</h2>
                  <p className="text-gray-500 text-center mb-4">{recipes[selectedRecipe].description}</p>
                  <div className="flex justify-center gap-4 text-sm text-gray-500 font-semibold mb-4">
                    <span>⏱ Prep: {recipes[selectedRecipe].prepTime}</span>
                    <span>🔥 Cook: {recipes[selectedRecipe].cookTime}</span>
                  </div>
                  <div className="rounded-xl p-3 text-sm font-semibold text-center" style={{ background: `${activeTab.color}18`, color: activeTab.color }}>
                    {recipes[selectedRecipe].textureNote}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-gray-700 mb-3">🛒 Ingredients</h3>
                  <ul className="space-y-2">
                    {recipes[selectedRecipe].ingredients.map((ing, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className="font-black" style={{ color: activeTab.color }}>•</span>
                        <span className="font-semibold text-gray-600">{ing.quantity}</span>
                        <span className="text-gray-700">{ing.item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {recipes[selectedRecipe].optionalSeasonings && recipes[selectedRecipe].optionalSeasonings!.length > 0 && (
                  <div className="rounded-2xl p-4 shadow-sm" style={{ background: "#FFFBEB", border: "2px dashed #FCD34D" }}>
                    <h3 className="font-black text-sm mb-2" style={{ color: "#92400E" }}>✨ Optional extras — if you have them</h3>
                    <p className="text-xs text-amber-600 mb-2">The recipe above works perfectly without these. But if you have any, they&apos;ll add extra flavour:</p>
                    <div className="flex flex-wrap gap-2">
                      {recipes[selectedRecipe].optionalSeasonings!.map((s, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "#FEF3C7", color: "#92400E" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="font-black text-gray-700 mb-3">👩‍🍳 Instructions</h3>
                  <ol className="space-y-3">
                    {recipes[selectedRecipe].instructions.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span
                          className="w-6 h-6 rounded-full text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: activeTab.color }}
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
                  <div className="rounded-2xl p-4 text-sm font-semibold" style={{ background: "#F5F0FF", color: "#6B21A8" }}>
                    👶 <strong>Age note:</strong> {recipes[selectedRecipe].ageSuitabilityNote}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-4 text-xs text-amber-700 border border-amber-200">
                  ⚠️ <strong>Important Disclaimer:</strong> These recipes are generated by artificial intelligence and have not been reviewed by a nutritionist or medical professional. Every child develops at a different pace. The age guidance in this app is a general suggestion only — it does not account for your individual child&apos;s development, readiness, or medical needs. Always follow your child&apos;s lead and consult your health visitor, GP, or paediatric dietitian before introducing new foods, especially if your child has allergies, intolerances, or any health conditions. Introduce new foods one at a time and watch for any reactions. This app does not provide medical or nutritional advice.
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={generateRecipe}
                disabled={loading}
                className="py-4 rounded-2xl text-white font-black text-sm shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #F97316 0%, #EC4899 100%)" }}
              >
                {loading ? "🍳 Cooking..." : "🔄 Try Different"}
              </button>
              <button
                onClick={reset}
                className="py-4 rounded-2xl font-black text-sm border-2 transition-colors"
                style={{ borderColor: "#FCA99A", color: "#F97316" }}
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
