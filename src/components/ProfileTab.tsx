import React from "react";
import { 
  User, Settings, Palette, Eye, Shield, HelpCircle, LogOut, 
  Trash2, Download, AlertTriangle, ShieldCheck, Heart, Sparkles, Volume2, Moon, Sun
} from "lucide-react";
import { UserProfile, CoupleState } from "../types";

interface ProfileTabProps {
  userProfile: UserProfile;
  partnerProfile: UserProfile;
  coupleState: CoupleState;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSwitchPartner: () => void;
  onResetApp: () => void;
}

export default function ProfileTab({
  userProfile,
  partnerProfile,
  coupleState,
  darkMode,
  onToggleDarkMode,
  onSwitchPartner,
  onResetApp
}: ProfileTabProps) {

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      app: "LoveLoop",
      user: userProfile,
      coupleSpaceCode: coupleState.code
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `loveloop-export-${userProfile.nickname.toLowerCase()}.json`;
    a.click();
  };

  return (
    <div id="profile_tab" className="space-y-6 max-w-lg mx-auto pb-20">
      
      {/* 1. DUAL PARTNER TOGGLE CONTROLLER */}
      <div className="bg-[#FF4D8D]/10 rounded-[24px] p-5 border border-[#FF4D8D]/30 flex justify-between items-center dark:bg-rose-950/20">
        <div className="flex items-center space-x-3 text-left">
          <div className="text-2xl">💫</div>
          <div>
            <h5 className="font-bold text-xs text-gray-800 dark:text-zinc-200">Simulate Both Partners</h5>
            <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">Toggle who you are acting as to test chats, answers, and reactions instantly!</p>
          </div>
        </div>
        <button
          onClick={onSwitchPartner}
          className="px-4 py-2 bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] text-white text-xs font-bold rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          Act as {partnerProfile.nickname}
        </button>
      </div>

      {/* 2. PROFILE PICTURE CARD */}
      <div className="bg-white/95 rounded-[24px] overflow-hidden border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 relative">
        <div className="h-28 w-full bg-gray-100 dark:bg-zinc-900">
          <img src={userProfile.coverPic} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-md font-mono">
          SECURE IP TUNNEL
        </div>

        <div className="p-6 text-center -mt-10 relative">
          <img 
            src={userProfile.profilePic} 
            alt={userProfile.name} 
            className="w-20 h-20 rounded-2xl border-4 border-white object-cover mx-auto dark:border-[#181818]"
            referrerPolicy="no-referrer"
          />
          <h4 className="text-base font-bold text-gray-900 mt-2 dark:text-white">{userProfile.name}</h4>
          <p className="text-xs text-gray-400 mt-0.5">Nickname: "{userProfile.nickname}" · {userProfile.gender}</p>

          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-3 italic leading-relaxed dark:text-gray-400">
            "{userProfile.bio || 'Living our best days together.'}"
          </p>
        </div>
      </div>

      {/* 3. COUPLE DETAILS CARD */}
      <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center space-x-1.5">
          <Heart className="w-4 h-4 text-[#FF4D8D]" fill="#FF4D8D" />
          <span>Shared Couple Passport</span>
        </h4>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-rose-50/20 border border-rose-100/30 rounded-xl dark:bg-zinc-900/30">
            <span className="text-gray-400">Relationship Anniversary</span>
            <p className="font-bold text-gray-800 mt-1 dark:text-zinc-200">{userProfile.anniversary || "May 20, 2024"}</p>
          </div>
          <div className="p-3 bg-rose-50/20 border border-rose-100/30 rounded-xl dark:bg-zinc-900/30">
            <span className="text-gray-400">Primary Love Language</span>
            <p className="font-bold text-gray-800 mt-1 dark:text-zinc-200">{userProfile.loveLanguage}</p>
          </div>
          <div className="p-3 bg-rose-50/20 border border-rose-100/30 rounded-xl dark:bg-zinc-900/30">
            <span className="text-gray-400">Favorite Date Spot</span>
            <p className="font-bold text-gray-800 mt-1 dark:text-zinc-200">{userProfile.favoriteDateSpot}</p>
          </div>
          <div className="p-3 bg-rose-50/20 border border-rose-100/30 rounded-xl dark:bg-zinc-900/30">
            <span className="text-gray-400">Couple Tunnel ID</span>
            <p className="font-bold text-gray-800 mt-1 dark:text-zinc-200 font-mono text-[10px] uppercase">{coupleState.code}</p>
          </div>
        </div>
      </div>

      {/* 4. VISUAL CUSTOMIZATION MENU */}
      <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Palette className="w-4 h-4 text-[#FF4D8D]" />
          <span>Personal Customization</span>
        </h4>

        {/* Light / Dark Toggle */}
        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-zinc-300">
          <span className="font-semibold">Visual Workspace Mode</span>
          <button
            onClick={onToggleDarkMode}
            className="p-2 bg-gray-50 rounded-xl border border-gray-200 flex items-center space-x-2 cursor-pointer hover:bg-gray-100 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            {darkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-[#FF4D8D]" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Fonts mockup list */}
        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-zinc-300">
          <span className="font-semibold">Primary Typography Pairing</span>
          <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg dark:bg-zinc-900 dark:border-zinc-800">
            <option>Space Grotesk + Inter</option>
            <option>Playfair Display + Inter</option>
            <option>JetBrains Mono + Inter</option>
          </select>
        </div>

        {/* Sounds setting list */}
        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-zinc-300">
          <span className="font-semibold">Notification Ringtone</span>
          <select className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg dark:bg-zinc-900 dark:border-zinc-800">
            <option>Rose Petal Soft Chime</option>
            <option>Cosmic Glow Chime</option>
            <option>Whispering Breeze Chime</option>
          </select>
        </div>
      </div>

      {/* 5. PRIVACY & SECURITY DATA OPTIONS */}
      <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 space-y-4">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1.5">
          <Shield className="w-4 h-4 text-[#FF4D8D]" />
          <span>Security & Data Privacy</span>
        </h4>

        <div className="space-y-2">
          <button
            onClick={handleExportData}
            className="w-full py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition-all cursor-pointer flex items-center justify-center space-x-2 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"
          >
            <Download className="w-4 h-4" />
            <span>Export My Private Data Logs</span>
          </button>

          <button
            onClick={onResetApp}
            className="w-full py-3 bg-rose-50/40 border border-rose-100 rounded-xl text-xs font-semibold text-[#FF4D8D] hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center space-x-2 dark:bg-rose-950/10 dark:border-rose-950/20"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Capsule & Account Data</span>
          </button>
        </div>
      </div>

    </div>
  );
}
