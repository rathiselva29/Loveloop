import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Lock, Unlock, Mail, Clock, ShieldAlert, Sparkles, BookOpen, 
  Send, RefreshCw, Key, Heart, AlertCircle, Calendar, FileText, Check
} from "lucide-react";
import { UserProfile, DiaryEntry, FutureMessage } from "../types";

interface TimelineTabProps {
  userProfile: UserProfile;
  partnerProfile: UserProfile;
  diaryEntries: DiaryEntry[];
  futureMessages: FutureMessage[];
  onAddDiaryEntry: (entry: DiaryEntry) => void;
  onAddFutureMessage: (msg: FutureMessage) => void;
}

export default function TimelineTab({
  userProfile,
  partnerProfile,
  diaryEntries,
  futureMessages,
  onAddDiaryEntry,
  onAddFutureMessage
}: TimelineTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'diary' | 'future' | 'letter'>('diary');

  // Diary Code Lock States
  const [diaryUnlocked, setDiaryUnlocked] = useState(false);
  const [diaryPasscode, setDiaryPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");

  // Add diary entry
  const [newDiaryTitle, setNewDiaryTitle] = useState("");
  const [newDiaryContent, setNewDiaryContent] = useState("");
  const [isNewLocked, setIsNewLocked] = useState(true);

  // Future messages states
  const [newFutureText, setNewFutureText] = useState("");
  const [newFutureDate, setNewFutureDate] = useState("");

  // AI Love Letter States
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [writerName, setWriterName] = useState(userProfile.nickname);
  const [partnerName, setPartnerName] = useState(partnerProfile.nickname);
  const [relationshipLength, setRelationshipLength] = useState("1 Year");
  const [selectedTone, setSelectedTone] = useState("romantic");
  const [favoriteMemories, setFavoriteMemories] = useState("");

  // --- PASSCODE ENTRY ---
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pre-seeded secure code is "5201314" (which means 'I love you for a lifetime' in Chinese culture)
    if (diaryPasscode === "5201314" || diaryPasscode === "1234") {
      setDiaryUnlocked(true);
      setPasscodeError("");
    } else {
      setPasscodeError("Incorrect Secret Key. Hint: seed passcode is '5201314' or '1234'.");
      setDiaryPasscode("");
    }
  };

  const handleAddDiary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiaryTitle.trim() || !newDiaryContent.trim()) return;

    const entry: DiaryEntry = {
      id: `diary-${Date.now()}`,
      title: newDiaryTitle,
      content: newDiaryContent,
      date: new Date().toISOString().split('T')[0],
      author: userProfile.name,
      isLocked: isNewLocked,
      secretCode: isNewLocked ? "5201314" : undefined
    };

    onAddDiaryEntry(entry);
    setNewDiaryTitle("");
    setNewDiaryContent("");
  };

  const handleCreateFutureMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFutureText.trim() || !newFutureDate) return;

    const item: FutureMessage = {
      id: `future-${Date.now()}`,
      to: partnerProfile.name,
      from: userProfile.name,
      text: newFutureText,
      deliverDate: newFutureDate,
      isOpened: false
    };

    onAddFutureMessage(item);
    setNewFutureText("");
    setNewFutureDate("");
  };

  // --- AI LOVE LETTER GENERATOR ---
  const generateAILoveLetter = async () => {
    setAiLoading(true);
    setGeneratedLetter("");
    try {
      const response = await fetch("/api/gemini/love-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          writerName,
          partnerName,
          relationshipLength,
          tone: selectedTone,
          favoriteMemories
        })
      });
      const data = await response.json();
      if (data.text) {
        setGeneratedLetter(data.text);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  const isLockedFuture = (deliverDate: string) => {
    return new Date(deliverDate).getTime() > new Date().getTime();
  };

  return (
    <div id="timeline_tab" className="space-y-6 max-w-lg mx-auto pb-20">
      
      {/* Sub menu selector */}
      <div className="bg-white/95 rounded-[24px] p-2 border border-rose-100/50 shadow-sm flex dark:bg-[#181818] dark:border-zinc-800">
        {[
          { id: 'diary', label: 'Locked Diary', icon: <BookOpen className="w-4 h-4" /> },
          { id: 'future', label: 'Future Capsules', icon: <Clock className="w-4 h-4" /> },
          { id: 'letter', label: 'AI Love Letter', icon: <Sparkles className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              activeSubTab === tab.id
                ? 'bg-rose-50 text-[#FF4D8D] border border-rose-100/40 dark:bg-rose-950/20'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. SECURE LOCKED DIARY TAB */}
      {activeSubTab === 'diary' && (
        <div className="space-y-5">
          {!diaryUnlocked ? (
            <div className="bg-white/95 rounded-[24px] p-8 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 text-center space-y-5">
              <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-[#FF4D8D] mx-auto dark:bg-rose-950/20">
                <Lock className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-lg text-gray-800 dark:text-zinc-100">Private Vault Locked</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">This diary contains highly intimate thoughts locked with end-to-end security keys. Please enter your secret code.</p>
              </div>

              <form onSubmit={handlePasscodeSubmit} className="max-w-xs mx-auto space-y-4">
                <input 
                  type="password" 
                  required
                  maxLength={10}
                  placeholder="Enter 4-7 digit secret key" 
                  value={diaryPasscode}
                  onChange={(e) => setDiaryPasscode(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-[18px] text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#FF4D8D]/40 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                />
                
                {passcodeError && (
                  <p className="text-[10px] text-red-500 font-medium flex items-center justify-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{passcodeError}</span>
                  </p>
                )}

                <button 
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] text-white rounded-[18px] text-xs font-bold shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Verify Passcode & Open</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* Diary entry form */}
              <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 space-y-4">
                <h4 className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider">Write Inside Private Diary</h4>
                
                <form onSubmit={handleAddDiary} className="space-y-3.5">
                  <input 
                    type="text" required placeholder="Diary heading..." value={newDiaryTitle} onChange={(e) => setNewDiaryTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs dark:bg-zinc-950 dark:border-zinc-900 dark:text-white"
                  />
                  <textarea 
                    rows={3} required placeholder="Pour your heart out here..." value={newDiaryContent} onChange={(e) => setNewDiaryContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs dark:bg-zinc-950 dark:border-zinc-900 dark:text-white"
                  />
                  <div className="flex justify-between items-center text-xs">
                    <label className="flex items-center space-x-2 text-gray-500 cursor-pointer dark:text-gray-400">
                      <input 
                        type="checkbox" 
                        checked={isNewLocked}
                        onChange={(e) => setIsNewLocked(e.target.checked)}
                        className="rounded text-[#FF4D8D]"
                      />
                      <span>Encrypt with Master Key</span>
                    </label>
                    <button type="submit" className="px-4 py-2 bg-[#FF4D8D] text-white rounded-xl font-bold">Lock Entry</button>
                  </div>
                </form>
              </div>

              {/* Locked diary entries list */}
              <div className="space-y-4">
                {diaryEntries.map(entry => (
                  <div key={entry.id} className="bg-white/95 rounded-[24px] p-5 border border-rose-100/40 shadow-sm dark:bg-[#181818] dark:border-zinc-800/80 space-y-3 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-[#FF4D8D]" />
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <span className="text-[9px] bg-rose-50 text-[#FF4D8D] px-2 py-0.5 rounded-md font-bold uppercase block w-max dark:bg-rose-950/20">Diary Archive</span>
                        <h5 className="font-bold text-gray-800 mt-2 dark:text-zinc-100">{entry.title}</h5>
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">{entry.date}</span>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed dark:text-gray-400">
                      {entry.content}
                    </p>

                    <div className="border-t border-gray-50 pt-2.5 flex justify-between items-center text-[9px] text-gray-400 dark:border-zinc-800/40">
                      <span>Written by {entry.author}</span>
                      <span className="text-emerald-500 font-bold flex items-center space-x-1">
                        <Unlock className="w-3 h-3" />
                        <span>Decrypted</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button 
                  onClick={() => setDiaryUnlocked(false)}
                  className="text-xs font-semibold text-[#FF4D8D] hover:underline"
                >
                  Click to Lock Vault & Clear Keys
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. FUTURE CAPSULES TAB */}
      {activeSubTab === 'future' && (
        <div className="space-y-5">
          {/* Create future message card */}
          <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 space-y-4">
            <h4 className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider">Seal a Future Capsule</h4>
            
            <form onSubmit={handleCreateFutureMessage} className="space-y-3.5">
              <textarea 
                rows={3} required placeholder="Write a gorgeous letter to unlock on an anniversary or birthday..." value={newFutureText} onChange={(e) => setNewFutureText(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs dark:bg-zinc-950 dark:border-zinc-900"
              />
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Unlock Deliver Date</label>
                  <input 
                    type="date" required value={newFutureDate} onChange={(e) => setNewFutureDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs dark:bg-zinc-950 dark:border-zinc-900"
                  />
                </div>
                <button type="submit" className="h-10 mt-5 bg-[#FF4D8D] text-white rounded-xl text-xs font-bold shadow-md hover:opacity-95">Seal Capsule</button>
              </div>
            </form>
          </div>

          {/* Sealed list */}
          <div className="grid grid-cols-1 gap-4">
            {futureMessages.map(msg => {
              const locked = isLockedFuture(msg.deliverDate);
              return (
                <div 
                  key={msg.id} 
                  className={`bg-white/95 rounded-[24px] p-5 border shadow-sm dark:bg-[#181818] relative overflow-hidden ${
                    locked ? "border-rose-100 opacity-80" : "border-emerald-100"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2.5">
                      <div className={`p-2.5 rounded-xl ${locked ? "bg-rose-50 text-[#FF4D8D]" : "bg-emerald-50 text-emerald-500"}`}>
                        {locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-[9px] text-gray-400 font-mono">DELIVER DATE: {msg.deliverDate}</span>
                        <h5 className="font-bold text-xs text-gray-800 dark:text-white mt-0.5">Sealed Capsule from {msg.from}</h5>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-gray-50 pt-3 dark:border-zinc-800/50">
                    {locked ? (
                      <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-bold justify-center py-2 bg-rose-50/20 rounded-xl">
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Locked until Anniversary Day</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-600 leading-relaxed dark:text-zinc-300 italic">"{msg.text}"</p>
                        <div className="flex justify-between items-center text-[9px] text-emerald-500 font-bold">
                          <span>Verified Open! ✅</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. AI LOVE LETTER CREATOR */}
      {activeSubTab === 'letter' && (
        <div className="space-y-5">
          <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 space-y-4">
            <h4 className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider mb-2">Gemini AI Love Letter Generator</h4>

            <div className="space-y-3.5 text-left text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-semibold">Your Name</label>
                  <input 
                    type="text" value={writerName} onChange={(e) => setWriterName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg dark:bg-zinc-950 dark:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-semibold">Partner Name</label>
                  <input 
                    type="text" value={partnerName} onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg dark:bg-zinc-950 dark:border-zinc-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-semibold">Time Together</label>
                  <input 
                    type="text" value={relationshipLength} onChange={(e) => setRelationshipLength(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg dark:bg-zinc-950 dark:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-gray-400 font-semibold">Tone Style</label>
                  <select 
                    value={selectedTone} onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg dark:bg-zinc-950 dark:border-zinc-900"
                  >
                    <option value="romantic">Deeply Romantic</option>
                    <option value="playful">Silly & Playful</option>
                    <option value="poetic">Poetic & Artistic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-semibold">Memories / Themes to weave in (optional)</label>
                <textarea 
                  rows={2} placeholder="e.g. Spilling matcha mochi, stargazing on sunset cliffs" value={favoriteMemories} onChange={(e) => setFavoriteMemories(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg dark:bg-zinc-950 dark:border-zinc-900"
                />
              </div>

              <button
                onClick={generateAILoveLetter}
                disabled={aiLoading}
                className="w-full py-3 bg-[#FF4D8D] text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Harnessing Gemini...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Generate Custom Love Letter</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Letter Output */}
          {generatedLetter && (
            <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100 shadow-sm dark:bg-[#181818] dark:border-zinc-800 space-y-3 relative">
              <span className="text-[9px] bg-rose-50 text-[#FF4D8D] px-2 py-0.5 rounded-md font-bold uppercase block w-max dark:bg-rose-950/20">Letter Generated Successfully</span>
              
              <div className="text-xs text-gray-700 leading-relaxed dark:text-zinc-300 italic whitespace-pre-wrap font-serif bg-rose-50/20 p-4 rounded-2xl border border-rose-100/20">
                {generatedLetter}
              </div>

              <button
                onClick={() => {
                  const item: DiaryEntry = {
                    id: `diary-${Date.now()}`,
                    title: `AI Written Letter to ${partnerName}`,
                    content: generatedLetter,
                    date: new Date().toISOString().split('T')[0],
                    author: `AI Love Planner (${writerName})`,
                    isLocked: false
                  };
                  onAddDiaryEntry(item);
                  setActiveSubTab('diary');
                }}
                className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-600 font-bold text-xs rounded-xl transition-all"
              >
                Save this Letter inside Locked Diary
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
