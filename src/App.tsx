import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, MessageSquare, BookOpen, Trophy, Clock, User, Sliders, Moon, Sun, RefreshCw, Sparkles 
} from "lucide-react";

// Components
import SplashAndOnboarding from "./components/SplashAndOnboarding";
import AuthAndProfileSetup from "./components/AuthAndProfileSetup";
import HomeTab from "./components/HomeTab";
import MessengerTab from "./components/MessengerTab";
import MemoriesTab from "./components/MemoriesTab";
import GamesTab from "./components/GamesTab";
import TimelineTab from "./components/TimelineTab";
import ProfileTab from "./components/ProfileTab";
import AdminDashboard from "./components/AdminDashboard";
import SmartLoveAI from "./components/SmartLoveAI";

// Types
import { 
  UserProfile, ChatMessage, Memory, DiaryEntry, FutureMessage, LoveStats, TodoItem, WishlistItem, CalendarEvent, CoupleState 
} from "./types";

// Seed Data
import { 
  initialProfileA, initialProfileB, initialMessages, initialMemories, initialDiaryEntries, 
  initialFutureMessages, initialLoveStats, initialTodoList, initialWishlist, initialEvents 
} from "./data";

export default function App() {
  const [appState, setAppState] = useState<'splash' | 'onboarding' | 'auth' | 'app'>('splash');
  
  // Theme & User Switching State
  const [darkMode, setDarkMode] = useState(false);
  const [activeUser, setActiveUser] = useState<'user-a' | 'user-b'>('user-a');

  // Core Orchestration State
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfileA);
  const [partnerProfile, setPartnerProfile] = useState<UserProfile>(initialProfileB);
  
  // Custom Dynamic Profiles to track real-life individual profile creations
  const [customProfileA, setCustomProfileA] = useState<UserProfile>(initialProfileA);
  const [customProfileB, setCustomProfileB] = useState<UserProfile>(initialProfileB);
  
  const [coupleState, setCoupleState] = useState<CoupleState>({
    code: "LOVE-777",
    connected: true,
    partnerNickname: "Sophie"
  });

  const [loveStats, setLoveStats] = useState<LoveStats>(initialLoveStats);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [todoList, setTodoList] = useState<TodoItem[]>(initialTodoList);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialEvents);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>(initialDiaryEntries);
  const [futureMessages, setFutureMessages] = useState<FutureMessage[]>(initialFutureMessages);

  // Helper to dynamically rewrite occurrences of placeholder characters with real custom profiles
  const personalizeData = (uProf: UserProfile, pProf: UserProfile) => {
    const realUserAName = uProf.name || "User A";
    const realUserANick = uProf.nickname || "You";
    const realUserBName = pProf.name || "User B";
    const realUserBNick = pProf.nickname || "Partner";

    const rep = (str: string) => {
      if (!str) return str;
      return str
        .replace(/Liam Parker/gi, realUserAName)
        .replace(/Sophia Evans/gi, realUserBName)
        .replace(/Liam/gi, realUserANick)
        .replace(/Sophia/gi, realUserBNick)
        .replace(/Sophie/gi, realUserBNick)
        .replace(/Lee/gi, realUserANick);
    };

    setMessages(prev => prev.map(m => ({
      ...m,
      text: rep(m.text)
    })));

    setMemories(prev => prev.map(m => ({
      ...m,
      title: rep(m.title),
      description: rep(m.description),
      addedBy: m.addedBy === "Liam Parker" ? realUserAName : realUserBName
    })));

    setDiaryEntries(prev => prev.map(d => ({
      ...d,
      title: rep(d.title),
      content: rep(d.content),
      author: d.author === "Sophia Evans" ? realUserBName : realUserAName
    })));

    setFutureMessages(prev => prev.map(f => ({
      ...f,
      to: f.to === "Sophia Evans" ? realUserBName : realUserAName,
      from: f.from === "Liam Parker" ? realUserAName : realUserBName,
      text: rep(f.text)
    })));

    setCalendarEvents(prev => prev.map(e => ({
      ...e,
      title: rep(e.title),
      description: rep(e.description)
    })));
  };

  // Active Tab View State
  const [activeTab, setActiveTab] = useState<'home' | 'messenger' | 'memories' | 'games' | 'timeline' | 'profile' | 'admin'>('home');

  // Floating Hearts Asset List
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number; delay: number; duration: number }[]>([]);

  // Trigger dark mode styles
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Seed floating hearts once
  useEffect(() => {
    const hearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10
    }));
    setFloatingHearts(hearts);
  }, []);

  // Sync state between custom profiles when switching role
  const handleSwitchPartner = () => {
    if (activeUser === 'user-a') {
      setActiveUser('user-b');
      setUserProfile(customProfileB);
      setPartnerProfile(customProfileA);
    } else {
      setActiveUser('user-a');
      setUserProfile(customProfileA);
      setPartnerProfile(customProfileB);
    }
  };

  const handleResetApp = () => {
    setAppState('onboarding');
    setLoveStats(initialLoveStats);
    setMessages(initialMessages);
    setMemories(initialMemories);
    setTodoList(initialTodoList);
    setWishlist(initialWishlist);
    setCalendarEvents(initialEvents);
    setDiaryEntries(initialDiaryEntries);
    setFutureMessages(initialFutureMessages);
  };

  // Render correct tab panel content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <SmartLoveAI 
              partnerNickname={partnerProfile.nickname} 
              onSaveEntry={(entry) => setDiaryEntries([entry, ...diaryEntries])} 
            />
            <HomeTab 
              userProfile={userProfile}
              partnerProfile={partnerProfile}
              loveStats={loveStats}
              onUpdateStats={setLoveStats}
            />
          </div>
        );
      case 'messenger':
        return (
          <MessengerTab 
            userProfile={userProfile}
            partnerProfile={partnerProfile}
            messages={messages}
            todoList={todoList}
            wishlist={wishlist}
            calendarEvents={calendarEvents}
            onAddMessage={(msg) => setMessages([...messages, msg])}
            onUpdateMessages={setMessages}
            onUpdateTodoList={setTodoList}
            onUpdateWishlist={setWishlist}
            onUpdateCalendarEvents={setCalendarEvents}
          />
        );
      case 'memories':
        return (
          <MemoriesTab 
            userProfile={userProfile}
            partnerProfile={partnerProfile}
            memories={memories}
            onAddMemory={(mem) => setMemories([mem, ...memories])}
          />
        );
      case 'games':
        return (
          <GamesTab 
            userProfile={userProfile}
            partnerProfile={partnerProfile}
          />
        );
      case 'timeline':
        return (
          <TimelineTab 
            userProfile={userProfile}
            partnerProfile={partnerProfile}
            diaryEntries={diaryEntries}
            futureMessages={futureMessages}
            onAddDiaryEntry={(entry) => setDiaryEntries([entry, ...diaryEntries])}
            onAddFutureMessage={(msg) => setFutureMessages([msg, ...futureMessages])}
          />
        );
      case 'profile':
        return (
          <ProfileTab 
            userProfile={userProfile}
            partnerProfile={partnerProfile}
            coupleState={coupleState}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onSwitchPartner={handleSwitchPartner}
            onResetApp={handleResetApp}
          />
        );
      case 'admin':
        return <AdminDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-[#111111]' : 'bg-[#FFF6F9]'}`}>
      
      {/* VIBRANT PALETTE DECORATIVE BACKGROUND VECTOR GRAPHICS */}
      <div className="absolute inset-0 opacity-15 dark:opacity-5 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 text-[#FF4D8D]">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
        <div className="absolute bottom-20 right-20 w-48 h-48 text-[#FF8FB8]">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </div>
      </div>

      {/* 1. FLOATING HEARTS BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        {floatingHearts.map(heart => (
          <motion.div
            key={heart.id}
            className="absolute text-rose-300/30 dark:text-rose-950/20"
            style={{ left: `${heart.left}%`, bottom: '-5%' }}
            animate={{
              y: '-105vh',
              x: ['0px', '20px', '-20px', '0px'],
              rotate: [0, 20, -20, 0]
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: "linear"
            }}
          >
            <Heart className="w-5 h-5 fill-current" />
          </motion.div>
        ))}
      </div>

      {/* 2. ONBOARDING & AUTH SCREENS */}
      <AnimatePresence mode="wait">
        {appState === 'splash' && (
          <SplashAndOnboarding 
            onComplete={() => setAppState('auth')} 
          />
        )}

        {appState === 'auth' && (
          <AuthAndProfileSetup 
            onSetupComplete={(uProf, pProf, cState) => {
              setUserProfile(uProf);
              setPartnerProfile(pProf);
              setCustomProfileA(uProf);
              setCustomProfileB(pProf);
              setCoupleState(cState);
              personalizeData(uProf, pProf);
              setAppState('app');
            }}
          />
        )}

        {appState === 'app' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 w-full max-w-lg mx-auto px-4 pt-4 pb-24"
          >
            {/* Elegant App Header matching Vibrant Palette */}
            <header className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 select-none bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md p-4 rounded-3xl border border-[#FF4D8D]/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF4D8D] to-[#FF8FB8] rounded-[12px] flex items-center justify-center text-white shadow-lg shadow-[#FF4D8D]/20">
                  <Heart className="w-5 h-5 fill-current text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#FF4D8D] dark:text-rose-400 flex items-center gap-1">
                    <span>LoveLoop</span>
                  </h1>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">Secured Bubble</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap justify-center">
                <div className="flex items-center gap-3 bg-white/80 dark:bg-zinc-950/80 p-1.5 pr-3 rounded-full border border-[#FF4D8D]/20 shadow-sm">
                  <div className="flex -space-x-2">
                    <img 
                      src={userProfile.profilePic} 
                      alt={userProfile.name} 
                      className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <img 
                      src={partnerProfile.profilePic} 
                      alt={partnerProfile.name} 
                      className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-zinc-200">
                    {userProfile.nickname} & {partnerProfile.nickname}
                  </span>
                  <div className="px-2 py-0.5 bg-[#FF4D8D]/10 text-[#FF4D8D] text-[9px] rounded-full uppercase tracking-wider font-bold dark:bg-rose-950/40 dark:text-rose-300">
                    Day {loveStats.streak * 12 + 8}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 bg-white/90 dark:bg-zinc-950 rounded-xl text-gray-400 hover:text-[#FF4D8D] border border-rose-100 dark:border-zinc-800 shadow-sm transition-all cursor-pointer"
                    title="Toggle theme mode"
                  >
                    {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleSwitchPartner}
                    className="p-2 bg-white/90 dark:bg-zinc-950 rounded-xl text-gray-400 hover:text-[#FF4D8D] border border-rose-100 dark:border-zinc-800 shadow-sm transition-all cursor-pointer"
                    title="Switch user view"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            {/* Main view container */}
            <main>
              {renderTabContent()}
            </main>

            {/* Curved Bottom Navigation Bar */}
            <nav className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto bg-white/95 dark:bg-[#151515] border border-rose-100/50 dark:border-zinc-800 rounded-[24px] shadow-lg shadow-rose-100/30 dark:shadow-none p-2 flex justify-between items-center z-40 select-none">
              {[
                { id: 'home', label: 'Home', icon: <Heart className="w-5 h-5" /> },
                { id: 'messenger', label: 'Chat', icon: <MessageSquare className="w-5 h-5" /> },
                { id: 'memories', label: 'Vault', icon: <BookOpen className="w-5 h-5" /> },
                { id: 'games', label: 'Play', icon: <Trophy className="w-5 h-5" /> },
                { id: 'timeline', label: 'Surprises', icon: <Clock className="w-5 h-5" /> },
                { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
                { id: 'admin', label: 'Admin', icon: <Sliders className="w-5 h-5" /> }
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`nav_${tab.id}`}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="flex-1 py-3 flex flex-col items-center justify-center relative cursor-pointer"
                  >
                    {active && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute inset-0 bg-gradient-to-tr from-[#FF4D8D]/10 to-[#FF8FB8]/5 rounded-2xl dark:from-rose-950/20"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    
                    <span className={`relative z-10 transition-transform ${active ? 'text-[#FF4D8D] scale-110' : 'text-gray-400 hover:text-gray-600 dark:text-zinc-500'}`}>
                      {tab.icon}
                    </span>
                    
                    <span className={`relative z-10 text-[9px] font-bold mt-1 transition-colors ${active ? 'text-[#FF4D8D]' : 'text-gray-400 dark:text-zinc-500'}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>

          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
