import React, { useState } from "react";
import { motion } from "motion/react";
import { Heart, ShieldCheck, Flame, Award, Droplets, Smile, HelpCircle, Star, Sparkles, TrendingUp } from "lucide-react";
import { UserProfile, LoveStats } from "../types";

interface HomeTabProps {
  userProfile: UserProfile;
  partnerProfile: UserProfile;
  loveStats: LoveStats;
  onUpdateStats: (newStats: LoveStats) => void;
}

export default function HomeTab({ userProfile, partnerProfile, loveStats, onUpdateStats }: HomeTabProps) {
  const [hasWateredToday, setHasWateredToday] = useState(false);
  const [dailyCheckInDone, setDailyCheckInDone] = useState(false);

  const handleWaterTree = () => {
    if (hasWateredToday) return;
    setHasWateredToday(true);
    
    const newXp = loveStats.xp + 50;
    const currentLevel = loveStats.level;
    const nextLevelThreshold = currentLevel * 150;
    const leveledUp = newXp >= nextLevelThreshold;

    onUpdateStats({
      ...loveStats,
      xp: leveledUp ? newXp - nextLevelThreshold : newXp,
      level: leveledUp ? currentLevel + 1 : currentLevel,
      loveMeter: Math.min(100, loveStats.loveMeter + 1)
    });
  };

  const handleMoodSelect = (mood: string, isUserA: boolean) => {
    if (isUserA) {
      onUpdateStats({ ...loveStats, moodA: mood });
    } else {
      onUpdateStats({ ...loveStats, moodB: mood });
    }
    setDailyCheckInDone(true);
  };

  const moods = ["😊 Happy", "🥰 Loved", "😴 Tired", "🥺 Needy", "🤪 Silly", "💖 Excited", "☕ Cozy"];

  // Helper to determine relationship growth tree image or visual state
  const getTreeStage = (level: number) => {
    if (level <= 2) return { name: "Rose Sprout", desc: "A tiny green shoot watered by sweet words.", emoji: "🌱" };
    if (level <= 5) return { name: "Blooming Vine", desc: "Climbing higher, leaves unfolding with trust.", emoji: "🌿" };
    if (level <= 8) return { name: "Sacred Rose Bud", desc: "A fragrant pink blossom getting ready to burst.", emoji: "🌸" };
    return { name: "Celestial Rose Bush", desc: "Full, radiant, and shining with unconditional love.", emoji: "🌹" };
  };

  const treeStage = getTreeStage(loveStats.level);
  const nextLevelThreshold = loveStats.level * 150;
  const xpPercentage = (loveStats.xp / nextLevelThreshold) * 100;

  const badges = [
    { id: "b1", title: "First Spark", desc: "Completed onboarding together", earned: true, icon: "✨" },
    { id: "b2", title: "Streak Master", desc: "Reached 30-day chat streak", earned: true, icon: "🔥" },
    { id: "b3", title: "Soulmates", desc: "Attained love Level 8", earned: loveStats.level >= 8, icon: "👑" },
    { id: "b4", title: "Memory Keepers", desc: "Added 10 memories together", earned: false, icon: "📸" }
  ];

  return (
    <div id="home_tab" className="space-y-6 max-w-lg mx-auto pb-20">
      
      {/* Top Couple Header */}
      <div className="flex justify-between items-center bg-white/95 rounded-[24px] p-5 border border-[#FF4D8D]/10 shadow-sm dark:bg-[#181818] dark:border-zinc-800">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={userProfile.profilePic} 
              alt={userProfile.name} 
              className="w-12 h-12 rounded-2xl border-2 border-[#FF4D8D] object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 text-xs">{moods.find(m => m.includes(loveStats.moodA?.split(" ")[1]))?.split(" ")[0] || "😊"}</span>
          </div>
          
          <div className="flex items-center space-x-1.5 text-[#FF4D8D]">
            <Heart className="w-5 h-5 animate-pulse animate-duration-[2000ms]" fill="#FF4D8D" />
          </div>

          <div className="relative">
            <img 
              src={partnerProfile.profilePic} 
              alt={partnerProfile.name} 
              className="w-12 h-12 rounded-2xl border-2 border-[#FF8FB8] object-cover"
              referrerPolicy="no-referrer"
            />
            <span className="absolute -bottom-1 -right-1 text-xs">{moods.find(m => m.includes(loveStats.moodB?.split(" ")[1]))?.split(" ")[0] || "🥰"}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center justify-end space-x-1 text-[#FF4D8D]">
            <Flame className="w-4.5 h-4.5 text-[#FF4D8D]" fill="currentColor" />
            <span className="text-sm font-bold font-mono">{loveStats.streak} Day Streak</span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase">Connected securely</p>
        </div>
      </div>

      {/* Love Level & XP Progression */}
      <div className="bg-white/95 rounded-[24px] p-6 border border-[#FF4D8D]/10 shadow-sm space-y-4 dark:bg-[#181818] dark:border-zinc-800">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Bond Level</span>
            <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">Level {loveStats.level} Couple</h3>
          </div>
          <div className="bg-[#FF4D8D]/10 text-[#FF4D8D] px-3 py-1.5 rounded-xl font-mono text-xs font-black dark:bg-rose-950/20">
            {loveStats.xp} / {nextLevelThreshold} XP
          </div>
        </div>

        <div className="h-2.5 w-full bg-[#FF4D8D]/10 rounded-full overflow-hidden dark:bg-zinc-800">
          <motion.div 
            className="h-full bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8]"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Triple Meters */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="bg-[#FFF6F9] border border-[#FF4D8D]/10 p-3 rounded-2xl text-center dark:bg-zinc-900/40 dark:border-zinc-800">
            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Love Meter</span>
            <span className="text-lg font-black text-[#FF4D8D] font-mono">{loveStats.loveMeter}%</span>
          </div>
          <div className="bg-[#FFF6F9] border border-[#FF4D8D]/10 p-3 rounded-2xl text-center dark:bg-zinc-900/40 dark:border-zinc-800">
            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Trust Meter</span>
            <span className="text-lg font-black text-rose-400 font-mono">{loveStats.trustScore}%</span>
          </div>
          <div className="bg-[#FFF6F9] border border-[#FF4D8D]/10 p-3 rounded-2xl text-center dark:bg-zinc-900/40 dark:border-zinc-800">
            <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Comm Score</span>
            <span className="text-lg font-black text-pink-400 font-mono">{loveStats.commScore}%</span>
          </div>
        </div>
      </div>

      {/* Relationship Growth Tree */}
      <div className="bg-white/95 rounded-[24px] p-6 border border-[#FF4D8D]/10 shadow-sm dark:bg-[#181818] dark:border-zinc-800 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-rose-200">
          <Droplets className="w-24 h-24 stroke-1 opacity-10 animate-bounce" />
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-50 to-emerald-100/80 rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 dark:border-emerald-900/30">
            {treeStage.emoji}
          </div>
          <div>
            <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider block">Nurture Growth</span>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">{treeStage.name}</h4>
          </div>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed dark:text-gray-400">
          {treeStage.desc} Water your relationship tree daily by checking in on each other and sending sweet hearts.
        </p>

        <div className="mt-5 flex space-x-3">
          <button
            onClick={handleWaterTree}
            disabled={hasWateredToday}
            className={`flex-1 py-3.5 rounded-[20px] text-sm font-semibold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
              hasWateredToday
                ? "bg-gray-100 text-gray-400 border border-gray-200 dark:bg-zinc-800 dark:text-zinc-500 dark:border-zinc-700"
                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-200 dark:shadow-none hover:opacity-95 active:scale-98"
            }`}
          >
            <Droplets className="w-4 h-4 fill-white" />
            <span>{hasWateredToday ? "Tree Watered Today" : "Water Love Tree (+50 XP)"}</span>
          </button>
        </div>
      </div>

      {/* Mood Check-In Board */}
      <div className="bg-white/95 rounded-[24px] p-6 border border-[#FF4D8D]/10 shadow-sm dark:bg-[#181818] dark:border-zinc-800">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Today's Mood Match</h4>
        
        {/* Mood align stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-gray-50 rounded-xl dark:bg-zinc-900/50">
            <span className="text-[10px] text-gray-400 font-bold block mb-1">Your Mood ({userProfile.nickname})</span>
            <p className="font-bold text-gray-800 dark:text-white">{loveStats.moodA}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl dark:bg-zinc-900/50">
            <span className="text-[10px] text-gray-400 font-bold block mb-1">Partner's Mood ({partnerProfile.nickname})</span>
            <p className="font-bold text-gray-800 dark:text-white">{loveStats.moodB}</p>
          </div>
        </div>

        {/* Set Your Mood Selector */}
        <div className="border-t border-gray-50 pt-4 dark:border-zinc-800/50">
          <span className="text-[11px] text-gray-400 font-bold block mb-2.5">Set Your Mood Today:</span>
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => handleMoodSelect(m, true)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                  loveStats.moodA === m
                    ? "bg-[#FFF6F9] text-[#FF4D8D] border-[#FF4D8D]"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Achievements / Badges Grid */}
      <div className="bg-white/95 rounded-[24px] p-6 border border-[#FF4D8D]/10 shadow-sm dark:bg-[#181818] dark:border-zinc-800">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Bond Achievements</span>
          <Award className="w-4.5 h-4.5 text-[#FF4D8D]" />
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`p-3.5 rounded-2xl border flex items-start space-x-3 transition-all ${
                badge.earned 
                  ? "bg-[#FFF6F9] border-[#FF4D8D]/10 dark:bg-rose-950/10 dark:border-rose-950/40" 
                  : "bg-gray-50/50 border-gray-100 opacity-60 dark:bg-zinc-900/40 dark:border-zinc-900"
              }`}
            >
              <div className="text-2xl mt-0.5">{badge.icon}</div>
              <div>
                <p className="font-bold text-xs text-gray-800 dark:text-white">{badge.title}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-snug">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
