import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Heart, Lock, MessageSquare, Sparkles, Trophy, Calendar, CheckCircle, ChevronRight, Settings, Smartphone } from "lucide-react";

interface SplashOnboardingProps {
  onComplete: () => void;
}

export default function SplashAndOnboarding({ onComplete }: SplashOnboardingProps) {
  const [step, setStep] = useState<'splash' | 'welcome' | 'onboarding'>('splash');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [checkingText, setCheckingText] = useState("Initializing LoveLoop Secure Vault...");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Splash Screen loading simulation with checks
  useEffect(() => {
    if (step !== 'splash') return;

    const intervals = [
      { delay: 400, text: "Verifying Session Token..." },
      { delay: 800, text: "Running Integrity Check (v1.4.2)..." },
      { delay: 1200, text: "Securing Connection Endpoints..." },
      { delay: 1600, text: "Auto-Login Successful." }
    ];

    intervals.forEach((item, index) => {
      setTimeout(() => {
        setCheckingText(item.text);
      }, item.delay);
    });

    const progressTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            setStep('welcome');
          }, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 90);

    return () => clearInterval(progressTimer);
  }, [step]);

  const onboardingSlides = [
    {
      title: "Private Couple Space",
      desc: "A sacred digital home only for the two of you. Lock out the world, invite in deep connection and intimacy.",
      icon: <Lock className="w-12 h-12 text-[#FF4D8D]" />,
      bgImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80"
    },
    {
      title: "Secure Messenger",
      desc: "Beautiful custom messaging with real-time feedback, shared notes, wishlists, and customizable floating drawing pads.",
      icon: <MessageSquare className="w-12 h-12 text-[#FF4D8D]" />,
      bgImage: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=80"
    },
    {
      title: "Memories Forever",
      desc: "A digital scrapbook designed for life. Archive travel stories, date night records, and physical or digital love letters.",
      icon: <Calendar className="w-12 h-12 text-[#FF4D8D]" />,
      bgImage: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=80"
    },
    {
      title: "Games & Challenges",
      desc: "Test your relationship compatibility, play classic mini games, and tackle daily date challenges side-by-side.",
      icon: <Trophy className="w-12 h-12 text-[#FF4D8D]" />,
      bgImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80"
    },
    {
      title: "Relationship Growth Tree",
      desc: "Nurture your daily bond. Track mood alignments, win achievements, and water your custom digital relationship tree.",
      icon: <Sparkles className="w-12 h-12 text-[#FF4D8D]" />,
      bgImage: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=80"
    }
  ];

  if (step === 'splash') {
    return (
      <div id="splash_screen" className="fixed inset-0 animated-romantic-bg flex flex-col items-center justify-center text-center p-6 z-50">
        <div className="absolute top-6 right-6 flex items-center space-x-2 text-xs font-mono text-[#FF4D8D] opacity-75 glass-panel px-3 py-1.5 rounded-full">
          <Smartphone className="w-3.5 h-3.5" />
          <span>v1.4.2 Production</span>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Elegant Logo with Heart Pulsing */}
          <div className="relative w-28 h-28 flex items-center justify-center bg-white rounded-[28px] shadow-xl shadow-rose-200/50 mb-6 dark:bg-[#1e1e1e] dark:shadow-none">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            >
              <Heart className="w-14 h-14 text-[#FF4D8D]" fill="#FF4D8D" />
            </motion.div>
            <div className="absolute -top-1 -right-1 bg-gradient-to-tr from-[#FF4D8D] to-[#FF8FB8] p-1.5 rounded-full text-white">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <h1 className="font-display text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Love<span className="text-[#FF4D8D]">Loop</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-sans tracking-wide dark:text-gray-400">
            A PRIVATE ESCAPE FOR TWO
          </p>
        </motion.div>

        {/* Loading Bar Container */}
        <div className="mt-12 w-64">
          <div className="h-1.5 w-full bg-rose-100 rounded-full overflow-hidden dark:bg-rose-950/40">
            <motion.div
              className="h-full bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8]"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="mt-3 flex justify-between text-[11px] font-mono text-gray-400 dark:text-gray-500">
            <span className="animate-pulse">{checkingText}</span>
            <span>{loadingProgress}%</span>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'welcome') {
    return (
      <div id="welcome_screen" className="fixed inset-0 animated-romantic-bg flex flex-col justify-between p-8 z-50 text-center overflow-hidden">
        {/* Top Header */}
        <div className="mt-8">
          <div className="inline-flex items-center space-x-1.5 glass-panel px-4 py-2 rounded-full text-xs font-semibold text-[#FF4D8D] shadow-sm mb-4">
            <Heart className="w-3.5 h-3.5" fill="#FF4D8D" />
            <span>EXCLUSIVELY FOR COUPLES</span>
          </div>
          <h2 className="font-serif text-5xl font-semibold tracking-tight text-gray-900 leading-tight dark:text-white">
            Every Love Story is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] italic">
              Beautiful.
            </span>
          </h2>
          <p className="mt-4 text-sm text-gray-500 max-w-sm mx-auto dark:text-gray-400">
            Welcome to your shared private digital sanctuary. Record memories, share secrets, and grow closer together day by day.
          </p>
        </div>

        {/* Floating Heart / Couple Graphic */}
        <div className="my-auto relative flex justify-center items-center">
          <div className="absolute w-72 h-72 bg-gradient-to-tr from-[#FF4D8D]/10 to-[#FF8FB8]/10 rounded-full blur-3xl" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 w-64 h-64 rounded-[40px] overflow-hidden border-4 border-white shadow-2xl shadow-rose-200 dark:border-zinc-800 dark:shadow-none"
          >
            <img
              src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&auto=format&fit=crop&q=80"
              alt="Romantic Couple"
              className="w-full h-full object-cover transform scale-105 hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          {/* Micro Animation Sparkles */}
          <Sparkles className="absolute top-1/4 left-1/4 w-6 h-6 text-[#FF8FB8] animate-bounce" />
          <Heart className="absolute bottom-1/4 right-1/4 w-8 h-8 text-[#FF4D8D] animate-ping opacity-30" />
        </div>

        {/* Footer Get Started */}
        <div className="mb-6">
          <button
            id="btn_get_started"
            onClick={() => setStep('onboarding')}
            className="w-full max-w-md mx-auto py-4 bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] text-white font-medium text-base rounded-[24px] shadow-lg shadow-rose-300/40 hover:opacity-95 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Begin Our Journey</span>
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="mt-3 text-[11px] text-gray-400 dark:text-gray-500">
            By proceeding, you unlock your end-to-end encrypted romantic bubble.
          </p>
        </div>
      </div>
    );
  }

  // Onboarding Slides
  return (
    <div id="onboarding_screen" className="fixed inset-0 animated-romantic-bg flex flex-col justify-between p-8 z-50 overflow-hidden">
      {/* Slide Navigation */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs font-mono font-bold text-[#FF4D8D] bg-rose-50 px-3 py-1.5 rounded-full dark:bg-rose-950/40">
          FEATURE {currentSlide + 1} OF {onboardingSlides.length}
        </span>
        <button
          onClick={onComplete}
          className="text-xs font-semibold text-gray-400 hover:text-[#FF4D8D] transition-colors"
        >
          Skip to Login
        </button>
      </div>

      {/* Main Slide Carousel */}
      <div className="my-auto flex flex-col items-center text-center max-w-md mx-auto">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          {/* Card Frame with Image & Icon */}
          <div className="relative w-72 h-56 rounded-[32px] overflow-hidden shadow-xl border-4 border-white mb-8 dark:border-zinc-800">
            <img
              src={onboardingSlides[currentSlide].bgImage}
              alt={onboardingSlides[currentSlide].title}
              className="w-full h-full object-cover brightness-95"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 bg-white/95 p-3 rounded-2xl shadow-md dark:bg-zinc-900/95">
              {onboardingSlides[currentSlide].icon}
            </div>
          </div>

          <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
            {onboardingSlides[currentSlide].title}
          </h3>
          <p className="mt-4 text-sm text-gray-500 max-w-xs leading-relaxed dark:text-gray-400">
            {onboardingSlides[currentSlide].desc}
          </p>
        </motion.div>
      </div>

      {/* Slide Footer */}
      <div className="mb-4 max-w-md mx-auto w-full flex flex-col items-center">
        {/* Dot Indicators */}
        <div className="flex space-x-2 mb-6">
          {onboardingSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-6 bg-[#FF4D8D]" : "w-2 bg-rose-200 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>

        {/* Bottom Button */}
        {currentSlide === onboardingSlides.length - 1 ? (
          <button
            id="btn_onboarding_finish"
            onClick={onComplete}
            className="w-full py-4 bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] text-white font-medium text-base rounded-[24px] shadow-lg shadow-rose-300/40 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <span>Enter LoveLoop Vault</span>
            <CheckCircle className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentSlide((prev) => prev + 1)}
            className="w-full py-4 bg-white text-gray-700 border border-rose-100 font-medium text-base rounded-[24px] shadow-sm hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center space-x-2 dark:bg-zinc-900 dark:text-zinc-200 dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            <span>Continue</span>
            <ChevronRight className="w-5 h-5 text-[#FF4D8D]" />
          </button>
        )}
      </div>
    </div>
  );
}
