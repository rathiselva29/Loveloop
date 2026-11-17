import React, { useState } from "react";
import { Sparkles, MessageSquare, RefreshCw, Bookmark, Check } from "lucide-react";
import { DiaryEntry } from "../types";

interface SmartLoveAIProps {
  onSaveEntry: (entry: DiaryEntry) => void;
  partnerNickname: string;
}

export default function SmartLoveAI({ onSaveEntry, partnerNickname }: SmartLoveAIProps) {
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("What is one specific moment this past week when you felt incredibly close to me?");
  const [userAnswer, setUserAnswer] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const fetchAIQuestion = async () => {
    setLoading(true);
    setIsSaved(false);
    setUserAnswer("");
    try {
      const response = await fetch("/api/gemini/question-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await response.json();
      if (data.question) {
        setCurrentQuestion(data.question);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDiary = () => {
    if (!userAnswer.trim()) return;

    const entry: DiaryEntry = {
      id: `diary-ai-${Date.now()}`,
      title: "AI Sparkle Question Answer",
      content: `Question: "${currentQuestion}"\nAnswer: "${userAnswer}"`,
      date: new Date().toISOString().split('T')[0],
      author: "AI Smart Prompter",
      isLocked: false
    };

    onSaveEntry(entry);
    setIsSaved(true);
    setUserAnswer("");
  };

  return (
    <div className="bg-gradient-to-tr from-rose-50 to-pink-50/50 border border-rose-100 rounded-3xl p-5 shadow-sm dark:from-zinc-900/60 dark:to-zinc-950/40 dark:border-zinc-800 relative overflow-hidden max-w-lg mx-auto">
      
      {/* Decorative vector background dots */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FF4D8D_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 space-y-3.5">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-gradient-to-tr from-[#FF4D8D] to-[#FF8FB8] rounded-xl text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">AI Relationship Assistant</span>
              <h5 className="font-display font-bold text-xs text-gray-800 dark:text-zinc-200">Daily Bonding Question</h5>
            </div>
          </div>
          
          <button
            onClick={fetchAIQuestion}
            disabled={loading}
            className="p-1.5 text-gray-400 hover:text-[#FF4D8D] transition-colors cursor-pointer"
            title="Get new question"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* The Question Prompt */}
        <div className="bg-white/80 p-4 rounded-2xl border border-rose-50/50 dark:bg-zinc-900/40">
          <p className="text-xs font-semibold text-gray-700 leading-relaxed dark:text-zinc-200">
            "{currentQuestion}"
          </p>
        </div>

        {/* Input area */}
        <div className="space-y-2">
          <textarea
            rows={2}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={`Type your loving answer here for ${partnerNickname} to see...`}
            className="w-full px-3 py-2 text-xs bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#FF4D8D]/40 dark:bg-zinc-950 dark:border-zinc-900 dark:text-white"
          />

          <div className="flex justify-end space-x-2">
            {isSaved ? (
              <span className="text-[10px] text-emerald-500 font-bold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved to locked diary!</span>
              </span>
            ) : (
              <button
                onClick={handleSaveToDiary}
                disabled={!userAnswer.trim()}
                className="px-4 py-2 bg-[#FF4D8D] hover:opacity-95 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all disabled:opacity-50"
              >
                Save inside Vault
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
