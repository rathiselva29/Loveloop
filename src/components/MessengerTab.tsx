import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Send, Image as ImageIcon, Smile, Mic, Video, Trash2, Edit2, Pin, Search,
  Phone, Video as VideoCall, ClipboardList, CheckSquare, Calendar as CalendarIcon, 
  ShoppingBag, Compass, HelpCircle, Palette, RefreshCw, Star, MapPin, Sparkles, Clock, Undo, Check, Eye
} from "lucide-react";
import { ChatMessage, UserProfile, TodoItem, WishlistItem, CalendarEvent, DrawStroke } from "../types";

interface MessengerTabProps {
  userProfile: UserProfile;
  partnerProfile: UserProfile;
  messages: ChatMessage[];
  todoList: TodoItem[];
  wishlist: WishlistItem[];
  calendarEvents: CalendarEvent[];
  onAddMessage: (msg: ChatMessage) => void;
  onUpdateMessages: (msgs: ChatMessage[]) => void;
  onUpdateTodoList: (todos: TodoItem[]) => void;
  onUpdateWishlist: (wishes: WishlistItem[]) => void;
  onUpdateCalendarEvents: (events: CalendarEvent[]) => void;
}

export default function MessengerTab({
  userProfile,
  partnerProfile,
  messages,
  todoList,
  wishlist,
  calendarEvents,
  onAddMessage,
  onUpdateMessages,
  onUpdateTodoList,
  onUpdateWishlist,
  onUpdateCalendarEvents
}: MessengerTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'todo' | 'wishlist' | 'drawing' | 'polls' | 'countdown'>('chat');
  
  // Chat inputs
  const [inputText, setInputText] = useState("");
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  const handleGenerateContextLetter = async () => {
    if (isGeneratingLetter) return;
    setIsGeneratingLetter(true);
    try {
      const response = await fetch("/api/gemini/love-letter-context", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: messages,
          userNickname: userProfile.nickname,
          partnerNickname: partnerProfile.nickname,
          userId: userProfile.id
        })
      });
      if (!response.ok) throw new Error("Failed to generate love letter context");
      const data = await response.json();
      if (data.text) {
        setInputText(data.text);
      }
    } catch (err) {
      console.error("AI Love Letter generation failed", err);
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [disappearingActive, setDisappearingActive] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [replyingMessageId, setReplyingMessageId] = useState<string | null>(null);

  // Call mockups
  const [activeCall, setActiveCall] = useState<'voice' | 'video' | null>(null);
  const [callTimer, setCallTimer] = useState(0);

  // Shared Tool lists inputs
  const [newTodo, setNewTodo] = useState("");
  const [newWish, setNewWish] = useState("");
  const [newWishPrice, setNewWishPrice] = useState("");
  const [todoAssignee, setTodoAssignee] = useState<'none' | 'user-a' | 'user-b'>('none');

  // Drawing Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#FF4D8D');
  const [drawWidth, setDrawWidth] = useState(5);

  // Poll state
  const [polls, setPolls] = useState([
    { id: "poll-1", question: "Where should we go for our next date night?", options: ["Sartori's Garden", "Sunset Beach Picnic", "Waterfront Rooftop Bar"], votes: [1, 3, 2] }
  ]);
  const [newPollQ, setNewPollQ] = useState("");
  const [newPollOptions, setNewPollOptions] = useState(["", ""]);

  // Countdown target state
  const [countdowns, setCountdowns] = useState([
    { id: "cd-1", title: "Anniversary Celebration 🥂", date: "2026-05-20" },
    { id: "cd-2", title: "Couples Pottery Class 🏺", date: "2026-07-15" }
  ]);
  const [newCdTitle, setNewCdTitle] = useState("");
  const [newCdDate, setNewCdDate] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeSubTab]);

  // Handle Call Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall) {
      interval = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (editingMessageId) {
      // Handle Edit
      const updated = messages.map(msg => 
        msg.id === editingMessageId ? { ...msg, text: inputText } : msg
      );
      onUpdateMessages(updated);
      setEditingMessageId(null);
    } else {
      // Handle New Message
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: userProfile.id,
        text: inputText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        reactions: [],
        isRead: false,
        replyToId: replyingMessageId || undefined
      };
      
      onAddMessage(newMsg);
      setReplyingMessageId(null);

      // Disappearing message auto delete after 8s
      if (disappearingActive) {
        setTimeout(() => {
          onUpdateMessages(messages.filter(m => m.id !== newMsg.id));
        }, 8000);
      }
    }
    setInputText("");
  };

  const handleSimulateReceive = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const randomTexts = [
        "Love that idea! You always know how to make me smile. 😊💖",
        "Just thinking about you right now... cannot wait for tonight!",
        "Matcha sounds absolutely perfect right now! Let's get some.",
        "Look what I painted today! Let's add it to our memories soon.",
        "I watered our Love Tree! Look how much it grew 🌿"
      ];
      const randomText = randomTexts[Math.floor(Math.random() * randomTexts.length)];
      
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: partnerProfile.id,
        text: randomText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        reactions: [],
        isRead: true
      };
      onAddMessage(newMsg);
    }, 1800);
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    const updated = messages.map(msg => {
      if (msg.id === messageId) {
        const existing = msg.reactions.find(r => r.user === userProfile.id);
        if (existing) {
          if (existing.emoji === emoji) {
            return { ...msg, reactions: msg.reactions.filter(r => r.user !== userProfile.id) };
          } else {
            return { ...msg, reactions: msg.reactions.map(r => r.user === userProfile.id ? { ...r, emoji } : r) };
          }
        } else {
          return { ...msg, reactions: [...msg.reactions, { user: userProfile.id, emoji }] };
        }
      }
      return msg;
    });
    onUpdateMessages(updated);
  };

  const handleDeleteMessage = (id: string) => {
    onUpdateMessages(messages.filter(msg => msg.id !== id));
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const item: TodoItem = {
      id: `todo-${Date.now()}`,
      text: newTodo,
      completed: false,
      assignedTo: todoAssignee === 'none' ? undefined : todoAssignee
    };
    onUpdateTodoList([...todoList, item]);
    setNewTodo("");
    setTodoAssignee('none');
  };

  const toggleTodo = (id: string) => {
    const updated = todoList.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    onUpdateTodoList(updated);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWish.trim()) return;
    const item: WishlistItem = {
      id: `wish-${Date.now()}`,
      title: newWish,
      price: newWishPrice || undefined
    };
    onUpdateWishlist([...wishlist, item]);
    setNewWish("");
    setNewWishPrice("");
  };

  // Drawing Canvas Functionality
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = drawWidth;
    ctx.lineCap = 'round';
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const sendDrawingAsMessage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL();
    
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: userProfile.id,
      text: "🎨 Draw Sparkle Note",
      mediaUrl: dataUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'drawing',
      reactions: [],
      isRead: false
    };
    onAddMessage(newMsg);
    setActiveSubTab('chat');
  };

  const createPoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPollQ.trim()) return;
    const poll = {
      id: `poll-${Date.now()}`,
      question: newPollQ,
      options: newPollOptions.filter(o => o.trim() !== ""),
      votes: newPollOptions.map(() => 0)
    };
    setPolls([...polls, poll]);
    setNewPollQ("");
    setNewPollOptions(["", ""]);
  };

  const votePoll = (pollId: string, optionIdx: number) => {
    setPolls(polls.map(p => {
      if (p.id === pollId) {
        const newVotes = [...p.votes];
        newVotes[optionIdx] += 1;
        return { ...p, votes: newVotes };
      }
      return p;
    }));
  };

  const createCountdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCdTitle.trim() || !newCdDate) return;
    const cd = {
      id: `cd-${Date.now()}`,
      title: newCdTitle,
      date: newCdDate
    };
    setCountdowns([...countdowns, cd]);
    setNewCdTitle("");
    setNewCdDate("");
  };

  // Helper to calculate days remaining
  const getDaysRemaining = (targetDate: string) => {
    const diff = new Date(targetDate).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days remaining` : "Today is the day! 🎉";
  };

  // Filter messages by search query
  const filteredMessages = messages.filter(m => 
    m.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[600px] max-w-lg mx-auto bg-white/95 rounded-[24px] overflow-hidden border border-rose-100/50 shadow-md dark:bg-[#121212] dark:border-zinc-800">
      
      {/* Top Header Panel */}
      <div className="bg-rose-50/50 p-4 border-b border-rose-100 flex justify-between items-center dark:bg-zinc-900/40 dark:border-zinc-800/80">
        <div className="flex items-center space-x-2.5">
          <img 
            src={partnerProfile.profilePic} 
            alt={partnerProfile.name} 
            className="w-10 h-10 rounded-xl object-cover border-2 border-[#FF8FB8]"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="font-display font-bold text-sm text-gray-800 dark:text-zinc-100">{partnerProfile.nickname}</h3>
            <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block mr-1.5 animate-pulse"></span>
              Active Inside Tunnel
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveCall('voice')}
            className="p-2 hover:bg-rose-100 text-[#FF4D8D] rounded-lg transition-colors cursor-pointer"
          >
            <Phone className="w-4.5 h-4.5" />
          </button>
          <button 
            onClick={() => setActiveCall('video')}
            className="p-2 hover:bg-rose-100 text-[#FF4D8D] rounded-lg transition-colors cursor-pointer"
          >
            <VideoCall className="w-4.5 h-4.5" />
          </button>
          <button 
            onClick={() => setDisappearingActive(!disappearingActive)}
            title="Disappearing messages (8 seconds)"
            className={`p-2 rounded-lg transition-colors cursor-pointer ${disappearingActive ? 'bg-rose-100 text-[#FF4D8D]' : 'hover:bg-rose-100 text-gray-400'}`}
          >
            <Clock className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Couple Tools Navigation Bar */}
      <div className="bg-white px-3 py-2 border-b border-rose-100/40 flex justify-between gap-1 overflow-x-auto select-none dark:bg-[#121212] dark:border-zinc-800/50">
        {[
          { id: 'chat', label: 'Chat', icon: <Compass className="w-3.5 h-3.5" /> },
          { id: 'todo', label: 'Lists', icon: <CheckSquare className="w-3.5 h-3.5" /> },
          { id: 'wishlist', label: 'Wishlist', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
          { id: 'drawing', label: 'Canvas', icon: <Palette className="w-3.5 h-3.5" /> },
          { id: 'polls', label: 'Polls', icon: <HelpCircle className="w-3.5 h-3.5" /> },
          { id: 'countdown', label: 'Timer', icon: <Clock className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === tab.id 
                ? 'bg-rose-50 text-[#FF4D8D] border border-rose-100/50 dark:bg-rose-950/20' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 1. MOCK PHONE CALL OVERLAY */}
      {activeCall && (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#111] via-[#1c0f13] to-[#200] z-50 flex flex-col justify-between p-8 text-center">
          <div className="mt-8 flex flex-col items-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-[#FF4D8D] to-[#FF8FB8] p-1 rounded-full animate-pulse shadow-xl">
              <img 
                src={partnerProfile.profilePic} 
                alt={partnerProfile.name} 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h4 className="text-xl font-bold text-white mt-4">{partnerProfile.nickname}</h4>
            <span className="text-xs text-[#FF8FB8] mt-1 font-mono tracking-widest uppercase">
              {activeCall === 'video' ? "SECURE VIDEO TUNNEL" : "SECURE VOICE CONNECTION"}
            </span>
          </div>

          {activeCall === 'video' && (
            <div className="w-44 h-56 bg-zinc-800 rounded-2xl mx-auto overflow-hidden border border-white/10 relative">
              <img src={userProfile.profilePic} alt="Me" className="w-full h-full object-cover brightness-95" />
              <div className="absolute bottom-2 left-2 text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-md">
                Liam (Self)
              </div>
            </div>
          )}

          <div className="text-white font-mono text-lg">{formatTimer(callTimer)}</div>

          <div className="mb-10">
            <button 
              onClick={() => setActiveCall(null)}
              className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow-lg shadow-red-500/30 active:scale-95 transition-all cursor-pointer"
            >
              End Connection
            </button>
          </div>
        </div>
      )}

      {/* Content Area based on sub tab selection */}
      <div className="flex-1 overflow-y-auto p-4 bg-rose-50/10 dark:bg-zinc-950/20">

        {/* CHAT TAB */}
        {activeSubTab === 'chat' && (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative mb-2">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search dialogue history..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#FF4D8D]/40 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
              />
            </div>

            {/* Simulated Incoming Trigger */}
            <div className="flex justify-center">
              <button 
                onClick={handleSimulateReceive}
                className="text-[10px] font-mono text-[#FF4D8D] bg-rose-50 border border-rose-100/50 px-3 py-1 rounded-full dark:bg-rose-950/20 hover:opacity-85 active:scale-95 cursor-pointer"
              >
                Simulate {partnerProfile.nickname} Sending a Message
              </button>
            </div>

            {filteredMessages.map((msg) => {
              const isMe = msg.senderId === userProfile.id;
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className={`flex items-end space-x-2 max-w-[85%] ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <img 
                      src={isMe ? userProfile.profilePic : partnerProfile.profilePic} 
                      alt="Avatar" 
                      className="w-7.5 h-7.5 rounded-lg object-cover"
                    />
                    
                    <div className="relative group">
                      {/* Reply preview if it's replying */}
                      {msg.replyToId && (
                        <div className="bg-gray-100 px-3 py-1 rounded-t-xl text-[10px] text-gray-500 max-w-full truncate border-l-2 border-[#FF4D8D] dark:bg-zinc-900">
                          Replying to message...
                        </div>
                      )}

                      <div className={`p-3.5 rounded-[20px] text-xs leading-relaxed shadow-sm ${
                        isMe 
                          ? 'bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none dark:bg-zinc-900 dark:text-zinc-200 border border-rose-50/10'
                      }`}>
                        
                        {msg.type === 'drawing' && msg.mediaUrl ? (
                          <div className="space-y-1.5">
                            <img src={msg.mediaUrl} alt="Draw Note" className="w-40 rounded-lg bg-rose-50/50" />
                            <p className="text-[10px] italic">{msg.text}</p>
                          </div>
                        ) : (
                          <p>{msg.text}</p>
                        )}

                        {/* Message Reactions inside */}
                        {msg.reactions.length > 0 && (
                          <div className="absolute -bottom-2 -right-2 flex space-x-1">
                            {msg.reactions.map((react, i) => (
                              <span 
                                key={i} 
                                className="bg-white border border-rose-50 text-[10px] p-0.5 rounded-full shadow-inner dark:bg-zinc-800 dark:border-zinc-700"
                                title={`Reacted by user`}
                              >
                                {react.emoji}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Micro actions on hover or tap */}
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 right-0 bg-white shadow-md border border-gray-100 rounded-lg p-1 flex space-x-1.5 text-gray-400 z-10 dark:bg-zinc-900 dark:border-zinc-800 transition-opacity">
                        <button onClick={() => handleReactToMessage(msg.id, "❤️")} className="hover:text-red-500 text-[10px]">❤️</button>
                        <button onClick={() => handleReactToMessage(msg.id, "🥰")} className="hover:text-red-500 text-[10px]">🥰</button>
                        <button onClick={() => setReplyingMessageId(msg.id)} className="hover:text-[#FF4D8D]" title="Reply"><Clock className="w-3 h-3" /></button>
                        {isMe && <button onClick={() => { setEditingMessageId(msg.id); setInputText(msg.text); }} className="hover:text-blue-500" title="Edit"><Edit2 className="w-3 h-3" /></button>}
                        <button onClick={() => handleDeleteMessage(msg.id)} className="hover:text-red-500" title="Delete"><Trash2 className="w-3 h-3" /></button>
                      </div>

                    </div>
                  </div>
                  
                  <span className="text-[9px] text-gray-400 mt-1 font-mono">{msg.timestamp} {isMe && '· Read'}</span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center space-x-2">
                <img src={partnerProfile.profilePic} alt="partner" className="w-7 h-7 rounded-lg object-cover" />
                <div className="bg-white px-3 py-2.5 rounded-full shadow-sm flex space-x-1 dark:bg-zinc-900 border border-rose-100/30">
                  <span className="w-1.5 h-1.5 bg-[#FF4D8D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#FF4D8D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-[#FF4D8D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}

        {/* TODO LIST TAB */}
        {activeSubTab === 'todo' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider mb-2">Our Shared To-Do Checklist</h4>
            
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <input 
                type="text" 
                required
                placeholder="Add shopping item or couple task..." 
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
              />
              <select 
                value={todoAssignee}
                onChange={(e: any) => setTodoAssignee(e.target.value)}
                className="px-2 py-2 bg-white border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
              >
                <option value="none">Anyone</option>
                <option value="user-a">{userProfile.nickname}</option>
                <option value="user-b">{partnerProfile.nickname}</option>
              </select>
              <button type="submit" className="px-3 bg-[#FF4D8D] text-white rounded-xl text-xs font-bold">Add</button>
            </form>

            <div className="space-y-2">
              {todoList.map(todo => (
                <div 
                  key={todo.id} 
                  className={`flex justify-between items-center p-3 bg-white border rounded-xl dark:bg-zinc-900 dark:border-zinc-800 ${todo.completed ? 'opacity-65' : ''}`}
                >
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={todo.completed} 
                      onChange={() => toggleTodo(todo.id)}
                      className="rounded text-[#FF4D8D] focus:ring-[#FF4D8D]"
                    />
                    <span className={`text-xs ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-zinc-200'}`}>
                      {todo.text}
                    </span>
                  </label>
                  {todo.assignedTo && (
                    <span className="text-[9px] bg-rose-50 text-[#FF4D8D] px-2 py-0.5 rounded-md dark:bg-rose-950/30">
                      {todo.assignedTo === 'user-a' ? userProfile.nickname : partnerProfile.nickname}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeSubTab === 'wishlist' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider mb-2">Our Love Gift Wishlist</h4>

            <form onSubmit={handleAddWish} className="grid grid-cols-3 gap-2">
              <input 
                type="text" 
                required
                placeholder="Item name" 
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
                className="col-span-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
              />
              <input 
                type="text" 
                placeholder="Price (opt)" 
                value={newWishPrice}
                onChange={(e) => setNewWishPrice(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
              />
              <button type="submit" className="col-span-3 py-2.5 bg-[#FF4D8D] text-white rounded-xl text-xs font-bold">Add Wishlist Item</button>
            </form>

            <div className="space-y-2">
              {wishlist.map(wish => (
                <div key={wish.id} className="p-3 bg-white border rounded-xl flex justify-between items-center dark:bg-zinc-900 dark:border-zinc-800">
                  <div>
                    <p className="text-xs font-bold text-gray-700 dark:text-zinc-200">{wish.title}</p>
                    {wish.price && <p className="text-[10px] text-gray-400 mt-0.5">{wish.price}</p>}
                  </div>
                  {wish.reservedBy ? (
                    <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-medium">Reserved Gift! 🎁</span>
                  ) : (
                    <button 
                      onClick={() => onUpdateWishlist(wishlist.map(w => w.id === wish.id ? { ...w, reservedBy: userProfile.id } : w))}
                      className="text-[9px] border border-rose-100 text-[#FF4D8D] px-2.5 py-1 rounded-full hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      Surprise Partner & Reserve
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DRAWING CANVAS TAB */}
        {activeSubTab === 'drawing' && (
          <div className="space-y-3 flex flex-col items-center">
            <h4 className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider text-center">Interactive Drawing Board</h4>

            <div className="border-2 border-rose-100 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 dark:border-zinc-800">
              <canvas
                ref={canvasRef}
                width={320}
                height={220}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseLeave={endDrawing}
                className="cursor-crosshair block"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-3 w-full justify-between">
              <div className="flex items-center space-x-2">
                {['#FF4D8D', '#FF8FB8', '#4DA6FF', '#4DFFB8', '#FFCC4D', '#111111'].map(c => (
                  <button 
                    key={c} 
                    type="button"
                    onClick={() => setDrawColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${drawColor === c ? 'border-zinc-800 scale-110' : 'border-white'}`}
                  />
                ))}
              </div>

              <div className="flex space-x-2">
                <button 
                  onClick={clearCanvas}
                  className="px-3 py-1.5 border border-gray-200 text-xs text-gray-500 rounded-lg hover:bg-gray-50 cursor-pointer dark:border-zinc-800"
                >
                  Clear
                </button>
                <button 
                  onClick={sendDrawingAsMessage}
                  className="px-4 py-1.5 bg-[#FF4D8D] text-white text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 cursor-pointer"
                >
                  Send Draw Note
                </button>
              </div>
            </div>
          </div>
        )}

        {/* POLLS TAB */}
        {activeSubTab === 'polls' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider mb-2">Create Couple Opinion Poll</h4>

            <form onSubmit={createPoll} className="space-y-2 p-3 bg-white border border-rose-50 rounded-xl dark:bg-zinc-900 dark:border-zinc-800">
              <input 
                type="text" required placeholder="Question (e.g. Next getaway spot?)" value={newPollQ} onChange={(e) => setNewPollQ(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs dark:bg-zinc-950 dark:border-zinc-900"
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" required placeholder="Option 1" value={newPollOptions[0]} onChange={(e) => setNewPollOptions([e.target.value, newPollOptions[1]])}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs dark:bg-zinc-950 dark:border-zinc-900"
                />
                <input 
                  type="text" required placeholder="Option 2" value={newPollOptions[1]} onChange={(e) => setNewPollOptions([newPollOptions[0], e.target.value])}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs dark:bg-zinc-950 dark:border-zinc-900"
                />
              </div>
              <button type="submit" className="w-full py-2 bg-rose-50 text-[#FF4D8D] hover:bg-rose-100 font-bold text-xs rounded-xl transition-all">Create Opinion Poll</button>
            </form>

            <div className="space-y-3">
              {polls.map(p => {
                const totalVotes = p.votes.reduce((a, b) => a + b, 0) || 1;
                return (
                  <div key={p.id} className="p-4 bg-white border rounded-xl space-y-2.5 dark:bg-zinc-900 dark:border-zinc-800">
                    <p className="text-xs font-bold text-gray-800 dark:text-zinc-100">{p.question}</p>
                    <div className="space-y-1.5">
                      {p.options.map((opt, idx) => {
                        const percent = Math.round((p.votes[idx] / totalVotes) * 100);
                        return (
                          <div key={idx} className="relative">
                            <button 
                              onClick={() => votePoll(p.id, idx)}
                              className="w-full text-left p-2.5 bg-gray-50 border border-gray-100 rounded-lg text-xs relative overflow-hidden flex justify-between z-1 dark:bg-zinc-950 dark:border-zinc-900 cursor-pointer"
                            >
                              <span className="relative z-10 font-medium text-gray-700 dark:text-zinc-300">{opt}</span>
                              <span className="relative z-10 font-bold text-gray-500">{percent}% ({p.votes[idx]})</span>
                              <div 
                                className="absolute left-0 top-0 bottom-0 bg-rose-100/50 transition-all duration-500" 
                                style={{ width: `${percent}%` }}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* COUNTDOWN TIMER TAB */}
        {activeSubTab === 'countdown' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-[#FF4D8D] uppercase tracking-wider mb-2">Our Couple Countdown Surprises</h4>

            <form onSubmit={createCountdown} className="grid grid-cols-2 gap-2">
              <input 
                type="text" required placeholder="Event name" value={newCdTitle} onChange={(e) => setNewCdTitle(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
              />
              <input 
                type="date" required value={newCdDate} onChange={(e) => setNewCdDate(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
              />
              <button type="submit" className="col-span-2 py-2 bg-[#FF4D8D] text-white rounded-xl text-xs font-bold">Add Countdown</button>
            </form>

            <div className="grid grid-cols-2 gap-3">
              {countdowns.map(cd => (
                <div key={cd.id} className="p-4 bg-white border rounded-2xl text-center space-y-1.5 dark:bg-zinc-900 dark:border-zinc-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8]" />
                  <p className="text-xs font-bold text-gray-700 dark:text-zinc-300 truncate">{cd.title}</p>
                  <p className="text-[10px] text-gray-400">{cd.date}</p>
                  <p className="text-sm font-black text-[#FF4D8D] font-mono mt-2 animate-pulse">{getDaysRemaining(cd.date)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 2. CHAT FOOTER PANEL (ONLY ACTIVE IN CHAT TAB) */}
      {activeSubTab === 'chat' && (
        <div className="border-t border-rose-100 dark:border-zinc-800 bg-white dark:bg-[#121212] flex flex-col">
          {/* AI Love Letter quick-compose bar */}
          <div className="px-4 py-2.5 flex items-center justify-between border-b border-rose-100/10 dark:border-zinc-800/30 bg-[#FFF6F9]/60 dark:bg-rose-950/5">
            <button
              type="button"
              onClick={handleGenerateContextLetter}
              disabled={isGeneratingLetter}
              className="flex items-center space-x-1.5 px-3 py-1 bg-gradient-to-r from-[#FF4D8D]/15 to-[#FF8FB8]/15 text-[#FF4D8D] border border-[#FF4D8D]/20 rounded-full text-[10px] font-black hover:from-[#FF4D8D]/25 hover:to-[#FF8FB8]/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingLetter ? 'animate-spin' : ''}`} />
              <span>{isGeneratingLetter ? 'AI Composing...' : 'AI Love Letter'}</span>
            </button>
            <span className="text-[10px] text-gray-400 font-medium italic">
              {isGeneratingLetter ? 'Drafting a romantic snippet...' : 'Generate a cute message from recent chat context'}
            </span>
          </div>

          <form 
            onSubmit={handleSendMessage}
            className="p-3 flex items-center space-x-2"
          >
            {replyingMessageId && (
              <div className="absolute bottom-16 left-4 right-4 bg-gray-50 border border-gray-200 p-2 rounded-xl flex justify-between items-center text-xs text-gray-500 z-10 dark:bg-zinc-900 dark:border-zinc-800">
                <span>Replying to message...</span>
                <button onClick={() => setReplyingMessageId(null)} className="font-bold text-[#FF4D8D]">Cancel</button>
              </div>
            )}

            <div className="flex space-x-1">
              <button 
                type="button" 
                onClick={() => setInputText("❤️")}
                className="p-1 text-base hover:scale-125 transition-transform"
              >
                ❤️
              </button>
              <button 
                type="button" 
                onClick={() => setInputText("✨")}
                className="p-1 text-base hover:scale-125 transition-transform"
              >
                ✨
              </button>
            </div>

            <input 
              type="text" 
              placeholder={editingMessageId ? "Edit message..." : "Type inside your romantic tunnel..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-[#FF4D8D]/40 focus:bg-white dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
            />

            <button 
              type="submit"
              className="p-3 bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] text-white rounded-full shadow-md hover:opacity-95 active:scale-95 cursor-pointer transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
