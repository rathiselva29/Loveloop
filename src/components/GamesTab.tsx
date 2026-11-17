import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Trophy, Sparkles, Flame, Play, HelpCircle, Film, Compass, 
  RefreshCw, Heart, Smile, Star, Coffee, AlertCircle, RotateCcw
} from "lucide-react";
import { UserProfile } from "../types";

interface GamesTabProps {
  userProfile: UserProfile;
  partnerProfile: UserProfile;
}

export default function GamesTab({ userProfile, partnerProfile }: GamesTabProps) {
  const [activeGame, setActiveGame] = useState<'lobby' | 'quiz' | 'tictactoe' | 'sudoku' | 'truthordare' | 'spinthebottle' | 'generator'>('lobby');

  // Tic-Tac-Toe State
  const [tttBoard, setTttBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [tttIsX, setTttIsX] = useState(true); // X is User, O is Partner
  const [tttWinner, setTttWinner] = useState<string | null>(null);

  // Love Quiz State
  const [currentQuizQ, setCurrentQuizQ] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const quizQuestions = [
    { q: "What is your partner's ultimate favorite comforting food?", options: ["Rich Chocolate Mochi", "Truffle Cream Pasta", "Hot Spicy Ramen", "Cozy Chicken Soup"], correct: 1 },
    { q: "Which movie style is our favorite for Sunday morning stay-ins?", options: ["Indie Romance", "Mind-bending SciFi", "Cozy Fantasy", "Action Comedy"], correct: 0 },
    { q: "What is their absolute primary Love Language?", options: ["Quality Time", "Words of Affirmation", "Physical Touch", "Acts of Service"], correct: 0 }
  ];

  // Sudoku Playable 4x4 State (simple 4x4 matrix)
  const initialSudoku = [
    [1, 0, 3, 0],
    [0, 0, 0, 2],
    [3, 0, 0, 0],
    [0, 1, 0, 4]
  ];
  const [sudokuBoard, setSudokuBoard] = useState<number[][]>(initialSudoku);
  const sudokuSolution = [
    [1, 2, 3, 4],
    [4, 3, 1, 2],
    [3, 4, 2, 1],
    [2, 1, 4, 3]
  ];
  const [sudokuWin, setSudokuWin] = useState(false);

  // Truth or Dare / Card State
  const [cardType, setCardType] = useState<'truth' | 'dare' | 'never'>('truth');
  const [cardPrompt, setCardPrompt] = useState("When did you first realize you were in love with me?");
  const truths = [
    "What is one silly habit of mine that you secretly find adorable?",
    "If you could relive one date night of ours, which one would it be?",
    "What is the first thing you noticed about me when we met?",
    "What is your absolute favorite physical feature of mine?"
  ];
  const dares = [
    "Give me a warm 30-second hug and whisper your favorite promise.",
    "Do a funny 10-second romantic dance right now.",
    "Sing the chorus of your favorite love song with silly voices.",
    "Draw a tiny portrait of me on a napkin in under 60 seconds."
  ];
  const nevers = [
    "Never have I ever stayed up past 3 AM talking on the phone with you.",
    "Never have I ever accidentally worn mismatched socks on a date.",
    "Never have I ever spent hours planning a surprise calendar date."
  ];

  // Spin Bottle rotation degree
  const [bottleAngle, setBottleAngle] = useState(0);
  const [bottleSpinned, setBottleSpinned] = useState(false);
  const [bottleTarget, setBottleTarget] = useState("");

  // AI Planner loading state
  const [aiLoading, setAiLoading] = useState(false);
  const [dateItinerary, setDateItinerary] = useState<any[] | null>(null);

  // --- TIC TAC TOE FUNCTIONS ---
  const handleTttClick = (idx: number) => {
    if (tttBoard[idx] || tttWinner) return;
    const newBoard = [...tttBoard];
    const currentPlayer = tttIsX ? "X" : "O";
    newBoard[idx] = currentPlayer;
    setTttBoard(newBoard);
    
    // Check winner
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    let won = false;
    for (const p of winPatterns) {
      if (newBoard[p[0]] && newBoard[p[0]] === newBoard[p[1]] && newBoard[p[0]] === newBoard[p[2]]) {
        setTttWinner(newBoard[p[0]] === "X" ? userProfile.nickname : partnerProfile.nickname);
        won = true;
        break;
      }
    }
    if (!won && !newBoard.includes(null)) {
      setTttWinner("Draw");
    }
    setTttIsX(!tttIsX);
  };

  const resetTtt = () => {
    setTttBoard(Array(9).fill(null));
    setTttWinner(null);
    setTttIsX(true);
  };

  // --- SUDOKU FUNCTIONS ---
  const handleSudokuInput = (r: number, c: number, val: number) => {
    const newBoard = sudokuBoard.map((row, ri) => 
      row.map((cell, ci) => ri === r && ci === c ? val : cell)
    );
    setSudokuBoard(newBoard);

    // Validate solution
    let isCorrect = true;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newBoard[i][j] !== sudokuSolution[i][j]) {
          isCorrect = false;
        }
      }
    }
    if (isCorrect) setSudokuWin(true);
  };

  // --- TRUTH / DARE FUNCTIONS ---
  const handleNextCard = (type: 'truth' | 'dare' | 'never') => {
    setCardType(type);
    const list = type === 'truth' ? truths : type === 'dare' ? dares : nevers;
    setCardPrompt(list[Math.floor(Math.random() * list.length)]);
  };

  // --- SPIN THE BOTTLE FUNCTIONS ---
  const handleSpinBottle = () => {
    if (bottleSpinned) return;
    setBottleSpinned(true);
    const extraAngle = Math.floor(Math.random() * 720) + 720;
    const finalAngle = bottleAngle + extraAngle;
    setBottleAngle(finalAngle);
    
    setTimeout(() => {
      setBottleSpinned(false);
      // Decide target based on angle quadrant
      const target = (finalAngle % 360) > 180 ? userProfile.nickname : partnerProfile.nickname;
      setBottleTarget(target);
    }, 2000);
  };

  // --- AI DATE GENERATOR FUNCTION ---
  const generateAIDate = async () => {
    setAiLoading(true);
    setDateItinerary(null);
    try {
      const response = await fetch("/api/gemini/date-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locationPreference: "Cozy Indoor & Candlelight",
          budgetLevel: "Moderate",
          activeOrChill: "Relaxed & Sentimental",
          partnerName: partnerProfile.nickname
        })
      });
      const data = await response.json();
      if (data.itinerary) {
        setDateItinerary(data.itinerary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div id="games_tab" className="space-y-6 max-w-lg mx-auto pb-20">
      
      {/* 1. LOBBY DASHBOARD */}
      {activeGame === 'lobby' && (
        <div className="space-y-5">
          {/* Header Banner */}
          <div className="bg-[#FF4D8D] text-white rounded-[24px] p-6 text-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
            <Trophy className="w-12 h-12 text-white mx-auto animate-bounce mb-3" />
            <h3 className="font-display font-extrabold text-xl">Love Games & Generators</h3>
            <p className="text-xs text-rose-100 mt-1 max-w-xs mx-auto">Play together, answer quizzes, and plan surprise candlelight dates in real-time!</p>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            <button 
              onClick={() => { setActiveGame('quiz'); setCurrentQuizQ(0); setQuizScore(0); }}
              className="p-5 bg-white border border-rose-100 rounded-3xl text-center space-y-3 shadow-sm hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer dark:bg-[#181818] dark:border-zinc-800"
            >
              <div className="text-3xl">🧩</div>
              <div>
                <p className="font-bold text-sm text-gray-800 dark:text-zinc-100">Compatibility Quiz</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Test how well you know each other</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveGame('tictactoe')}
              className="p-5 bg-white border border-rose-100 rounded-3xl text-center space-y-3 shadow-sm hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer dark:bg-[#181818] dark:border-zinc-800"
            >
              <div className="text-3xl">❌</div>
              <div>
                <p className="font-bold text-sm text-gray-800 dark:text-zinc-100">Play Tic-Tac-Toe</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Interactive board game</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveGame('sudoku')}
              className="p-5 bg-white border border-rose-100 rounded-3xl text-center space-y-3 shadow-sm hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer dark:bg-[#181818] dark:border-zinc-800"
            >
              <div className="text-3xl">🔢</div>
              <div>
                <p className="font-bold text-sm text-gray-800 dark:text-zinc-100">Sudoku Puzzle</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Playable 4x4 brain teaser</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveGame('truthordare')}
              className="p-5 bg-white border border-rose-100 rounded-3xl text-center space-y-3 shadow-sm hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer dark:bg-[#181818] dark:border-zinc-800"
            >
              <div className="text-3xl">💬</div>
              <div>
                <p className="font-bold text-sm text-gray-800 dark:text-zinc-100">Truth or Dare</p>
                <p className="text-[10px] text-gray-400 mt-0.5">And Never Have I Ever</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveGame('spinthebottle')}
              className="p-5 bg-white border border-rose-100 rounded-3xl text-center space-y-3 shadow-sm hover:scale-[1.02] active:scale-[0.99] transition-all cursor-pointer dark:bg-[#181818] dark:border-zinc-800 col-span-2"
            >
              <div className="text-3xl">🍾</div>
              <div>
                <p className="font-bold text-sm text-gray-800 dark:text-zinc-100">Spin the Bottle</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Decide whose turn it is for sweet dares</p>
              </div>
            </button>

            <button 
              onClick={() => { setActiveGame('generator'); setDateItinerary(null); }}
              className="p-6 bg-rose-50 border-2 border-dashed border-[#FF4D8D]/40 rounded-3xl text-center space-y-3 shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer dark:bg-rose-950/10 dark:border-rose-900/40 col-span-2"
            >
              <div className="text-3xl">🤖✨</div>
              <div>
                <p className="font-bold text-sm text-[#FF4D8D]">AI Romantic Date Planner</p>
                <p className="text-[10px] text-rose-400/80 mt-0.5">Generate custom curated itineraries using Gemini</p>
              </div>
            </button>

          </div>
        </div>
      )}

      {/* 2. COMPATIBILITY QUIZ */}
      {activeGame === 'quiz' && (
        <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 text-center">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4 dark:border-zinc-800">
            <span className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider">Love Compatibility Match</span>
            <button onClick={() => setActiveGame('lobby')} className="text-xs text-gray-400 hover:text-[#FF4D8D]">Lobby</button>
          </div>

          {currentQuizQ < quizQuestions.length ? (
            <div className="space-y-6">
              <span className="text-[10px] text-gray-400 font-bold uppercase block tracking-wider">Question {currentQuizQ + 1} of {quizQuestions.length}</span>
              <h4 className="text-base font-bold text-gray-800 dark:text-white px-4 leading-relaxed">{quizQuestions[currentQuizQ].q}</h4>
              
              <div className="space-y-2.5">
                {quizQuestions[currentQuizQ].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx === quizQuestions[currentQuizQ].correct) {
                        setQuizScore(quizScore + 1);
                      }
                      setCurrentQuizQ(currentQuizQ + 1);
                    }}
                    className="w-full py-3.5 bg-gray-50 hover:bg-rose-50/50 border border-gray-100 rounded-2xl text-xs font-semibold text-gray-700 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-200 cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5 py-6">
              <div className="text-4xl animate-bounce">💖🏆</div>
              <h4 className="font-display text-xl font-black text-gray-800 dark:text-white">Compatibility Score</h4>
              <p className="text-xs text-gray-400">Based on your choices, you have a perfect alignment score of:</p>
              
              <div className="text-4xl font-black font-mono text-[#FF4D8D]">
                {Math.round((quizScore / quizQuestions.length) * 100)}% Match
              </div>

              <p className="text-xs text-gray-500 italic max-w-xs mx-auto leading-relaxed dark:text-gray-400">
                "{quizScore === quizQuestions.length ? "You two are absolutely soulbound. An incredible level of natural connection." : "An amazing couple score! Spend some cozier quality time tonight."}"
              </p>

              <button
                onClick={() => { setCurrentQuizQ(0); setQuizScore(0); }}
                className="w-full max-w-xs mx-auto py-3.5 bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] text-white font-medium text-xs rounded-xl shadow-md cursor-pointer"
              >
                Retry Compatibility Quiz
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. TIC TAC TOE GAME */}
      {activeGame === 'tictactoe' && (
        <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 text-center">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-5 dark:border-zinc-800">
            <span className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider">Tic-Tac-Toe Arena</span>
            <button onClick={() => setActiveGame('lobby')} className="text-xs text-gray-400 hover:text-[#FF4D8D]">Lobby</button>
          </div>

          <div className="flex justify-center space-x-6 mb-4 text-xs font-bold text-gray-500">
            <span className={tttIsX ? 'text-[#FF4D8D]' : ''}>{userProfile.nickname} (X)</span>
            <span className={!tttIsX ? 'text-[#FF8FB8]' : ''}>{partnerProfile.nickname} (O)</span>
          </div>

          {/* Board Grid */}
          <div className="grid grid-cols-3 gap-2 w-52 h-52 mx-auto bg-rose-50/50 p-2.5 rounded-2xl dark:bg-zinc-900/50">
            {tttBoard.map((val, idx) => (
              <button
                key={idx}
                onClick={() => handleTttClick(idx)}
                className="w-full h-full bg-white rounded-xl shadow-sm flex items-center justify-center text-xl font-black font-mono text-gray-800 dark:bg-[#121212] dark:text-white cursor-pointer hover:bg-rose-50/20"
              >
                <span className={val === 'X' ? 'text-[#FF4D8D]' : val === 'O' ? 'text-[#FF8FB8]' : ''}>
                  {val}
                </span>
              </button>
            ))}
          </div>

          {tttWinner && (
            <div className="mt-5 space-y-3">
              <p className="text-sm font-extrabold text-[#FF4D8D]">
                {tttWinner === "Draw" ? "It's a cozy Draw! 🤝" : `${tttWinner} Wins! 🎉`}
              </p>
              <button
                onClick={resetTtt}
                className="px-5 py-2.5 border border-rose-100 text-xs font-semibold text-[#FF4D8D] rounded-full hover:bg-rose-50 transition-all cursor-pointer flex items-center justify-center space-x-1.5 mx-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. PLAYABLE SUDOKU 4x4 */}
      {activeGame === 'sudoku' && (
        <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 text-center">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-5 dark:border-zinc-800">
            <span className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider">Mini 4x4 Sudoku Together</span>
            <button onClick={() => setActiveGame('lobby')} className="text-xs text-gray-400 hover:text-[#FF4D8D]">Lobby</button>
          </div>

          <p className="text-[10px] text-gray-400 mb-4">Complete the grids with numbers 1 to 4. No duplicate values per row, col, or block!</p>

          <div className="grid grid-cols-4 gap-1.5 w-48 h-48 mx-auto bg-rose-50/40 p-2.5 rounded-2xl border border-rose-100/50 dark:bg-zinc-900/50">
            {sudokuBoard.map((row, rIdx) => 
              row.map((cell, cIdx) => {
                const isPreset = initialSudoku[rIdx][cIdx] !== 0;
                return (
                  <input
                    key={`${rIdx}-${cIdx}`}
                    type="number"
                    min={1}
                    max={4}
                    disabled={isPreset}
                    value={cell === 0 ? "" : cell}
                    onChange={(e) => handleSudokuInput(rIdx, cIdx, Number(e.target.value))}
                    className={`w-full h-full text-center text-sm font-bold rounded-lg border-0 focus:ring-1 focus:ring-[#FF4D8D]/40 ${
                      isPreset 
                        ? "bg-gray-100 text-gray-500 dark:bg-zinc-800" 
                        : "bg-white text-[#FF4D8D] font-black dark:bg-[#121212]"
                    }`}
                  />
                );
              })
            )}
          </div>

          {sudokuWin ? (
            <div className="mt-5 text-sm font-extrabold text-emerald-500 animate-pulse">
              Sudoku Solved Perfectly! ✨ +100 Couple Bond XP
            </div>
          ) : (
            <button 
              onClick={() => setSudokuBoard(initialSudoku)}
              className="mt-4 text-[10px] text-gray-400 font-semibold hover:text-[#FF4D8D]"
            >
              Reset Sudoku Board
            </button>
          )}
        </div>
      )}

      {/* 5. TRUTH OR DARE & NEVER HAVE I EVER */}
      {activeGame === 'truthordare' && (
        <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 text-center">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-5 dark:border-zinc-800">
            <span className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider">Party Card Games</span>
            <button onClick={() => setActiveGame('lobby')} className="text-xs text-gray-400 hover:text-[#FF4D8D]">Lobby</button>
          </div>

          {/* Quick tab filters inside */}
          <div className="flex justify-center space-x-2 mb-6">
            <button onClick={() => handleNextCard('truth')} className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${cardType==='truth'?'bg-rose-100 text-[#FF4D8D] border-[#FF4D8D]':'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'}`}>Truth</button>
            <button onClick={() => handleNextCard('dare')} className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${cardType==='dare'?'bg-rose-100 text-[#FF4D8D] border-[#FF4D8D]':'bg-gray-50 border-gray-200 text-gray-400'}`}>Dare</button>
            <button onClick={() => handleNextCard('never')} className={`px-4 py-2 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${cardType==='never'?'bg-rose-100 text-[#FF4D8D] border-[#FF4D8D]':'bg-gray-50 border-gray-200 text-gray-400'}`}>Never Have I</button>
          </div>

          <div className="relative py-10 px-6 bg-rose-50/30 rounded-3xl border border-rose-100/50 dark:bg-zinc-900/30 dark:border-zinc-800/80 mb-6">
            <div className="absolute top-2 left-2 text-2xl opacity-20">❝</div>
            <p className="text-sm font-semibold text-gray-800 dark:text-zinc-200 px-4 leading-relaxed italic">
              "{cardPrompt}"
            </p>
            <div className="absolute bottom-2 right-2 text-2xl opacity-20">❞</div>
          </div>

          <button
            onClick={() => handleNextCard(cardType)}
            className="w-full max-w-xs py-3 bg-[#FF4D8D] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
          >
            Generate Another Card
          </button>
        </div>
      )}

      {/* 6. SPIN THE BOTTLE */}
      {activeGame === 'spinthebottle' && (
        <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 text-center relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-5 dark:border-zinc-800">
            <span className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider">Spin the Bottle</span>
            <button onClick={() => setActiveGame('lobby')} className="text-xs text-gray-400 hover:text-[#FF4D8D]">Lobby</button>
          </div>

          <p className="text-[10px] text-gray-400 mb-6">Spin the vintage champagne bottle. Whomever the neck points to must answer a truth or complete a dare!</p>

          <div className="flex justify-between items-center max-w-xs mx-auto mb-8 font-bold text-xs text-gray-500">
            <span>{userProfile.nickname}</span>
            <span>{partnerProfile.nickname}</span>
          </div>

          {/* Bottle rotate stage */}
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-dashed border-rose-100 rounded-full animate-spin opacity-40 [animation-duration:15s]" />
            <motion.div
              animate={{ rotate: bottleAngle }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative w-12 h-32 cursor-pointer"
              onClick={handleSpinBottle}
            >
              {/* Custom SVG Bottle */}
              <svg viewBox="0 0 100 300" className="w-full h-full drop-shadow-md">
                <path d="M35,260 C35,280 65,280 65,260 L65,100 C65,70 55,60 55,40 L55,10 L45,10 L45,40 C45,60 35,70 35,100 Z" fill="#2E5A36" />
                <rect x="42" y="10" width="16" height="6" fill="#F0C243" rx="1" />
                {/* label */}
                <rect x="38" y="120" width="24" height="40" fill="#FFF4D0" rx="2" />
                <path d="M44,140 Q50,135 56,140" stroke="#FF4D8D" strokeWidth="2" fill="none" />
              </svg>
            </motion.div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSpinBottle}
              disabled={bottleSpinned}
              className="px-6 py-3 bg-[#FF4D8D] hover:opacity-95 text-white font-bold text-xs rounded-full shadow-md cursor-pointer transition-all disabled:opacity-50"
            >
              {bottleSpinned ? "Spinning..." : "SPIN THE BOTTLE"}
            </button>
          </div>

          {bottleTarget && !bottleSpinned && (
            <p className="text-xs text-[#FF4D8D] font-bold mt-4 animate-bounce">
              🎯 Bottle points to {bottleTarget}!
            </p>
          )}
        </div>
      )}

      {/* 7. AI PLANNER */}
      {activeGame === 'generator' && (
        <div className="bg-white/95 rounded-[24px] p-6 border border-rose-100/50 shadow-sm dark:bg-[#181818] dark:border-zinc-800 text-center">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-5 dark:border-zinc-800">
            <span className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Candlelight Date Planner</span>
            </span>
            <button onClick={() => setActiveGame('lobby')} className="text-xs text-gray-400 hover:text-[#FF4D8D]">Lobby</button>
          </div>

          <p className="text-[10px] text-gray-400 mb-5">Click to harness our server-side Gemini 3.5 Flash model and generate a surprise cohesive 3-step date night itinerary.</p>

          <button
            onClick={generateAIDate}
            disabled={aiLoading}
            className="w-full py-3.5 bg-[#FF4D8D] text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            {aiLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Cozy Itinerary via Gemini...</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4" />
                <span>Generate Candlelight Surprises</span>
              </>
            )}
          </button>

          {/* Result list */}
          {dateItinerary && (
            <div className="mt-6 space-y-4 text-left border-t border-rose-100/40 pt-4">
              <span className="text-[9px] bg-rose-50 text-[#FF4D8D] px-2 py-0.5 rounded-md font-bold block w-max uppercase dark:bg-rose-950/20">Cohesive Itinerary</span>
              
              <div className="space-y-4">
                {dateItinerary.map((step, idx) => (
                  <div key={idx} className="relative pl-6 border-l border-rose-200/50 dark:border-zinc-800">
                    <span className="absolute -left-1.5 top-0.5 w-3 h-3 bg-[#FF4D8D] rounded-full" />
                    <span className="text-[10px] font-mono text-gray-400 block">{step.time}</span>
                    <p className="text-xs font-bold text-gray-800 mt-0.5 dark:text-zinc-100">{step.activity}</p>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{step.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
