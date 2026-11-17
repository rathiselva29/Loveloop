import React, { useState } from "react";
import { motion } from "motion/react";
import { Calendar, MapPin, Search, Plus, Filter, Heart, Award, Star, Compass, Sparkles, AlertCircle } from "lucide-react";
import { Memory, UserProfile } from "../types";

interface MemoriesTabProps {
  userProfile: UserProfile;
  partnerProfile: UserProfile;
  memories: Memory[];
  onAddMemory: (memory: Memory) => void;
}

export default function MemoriesTab({ userProfile, partnerProfile, memories, onAddMemory }: MemoriesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Add memory modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newLoc, setNewLoc] = useState("");
  const [newCat, setNewCat] = useState<'First Date' | 'Milestone' | 'Travel' | 'First Gift' | 'First Kiss' | 'Proposal' | 'General'>('General');

  const categories = ["All", "First Date", "Milestone", "Travel", "First Gift", "First Kiss", "Proposal", "General"];

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: Memory = {
      id: `mem-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      date: newDate || new Date().toISOString().split('T')[0],
      category: newCat,
      location: newLoc || undefined,
      addedBy: userProfile.name
    };

    onAddMemory(item);
    setShowAddModal(false);
    setNewTitle("");
    setNewDesc("");
    setNewDate("");
    setNewLoc("");
    setNewCat('General');
  };

  const filteredMemories = memories.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (m.location && m.location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchCat = selectedCategory === "All" || m.category === selectedCategory;
    return matchSearch && matchCat;
  });

  // Predefined coordinates for Memory Map mock circles
  const mapPins = [
    { name: "Bean & Leaf Cafe", desc: "Our clumsy first coffee date", x: "32%", y: "45%" },
    { name: "Sartori's Garden Bistro", desc: "Where Liam asked Sophia to be his girlfriend", x: "65%", y: "30%" },
    { name: "Sunset Beach Cliffs", desc: "Midnight starlit walk and stardust wishes", x: "15%", y: "75%" },
    { name: "Botanical Greenhouse", desc: "Painting watercolors together in the warmth", x: "80%", y: "60%" }
  ];

  return (
    <div id="memories_tab" className="space-y-6 max-w-lg mx-auto pb-20">
      
      {/* Memories search, categories, and add trigger */}
      <div className="bg-white/95 rounded-[24px] p-5 border border-[#FF4D8D]/10 shadow-sm dark:bg-[#181818] dark:border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display font-black text-lg text-gray-800 dark:text-zinc-100">Shared Memory Vault</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-[#FF4D8D] text-white text-xs font-bold rounded-xl shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Memory</span>
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mb-3">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search dates, milestones, travel logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#FF4D8D]/40 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
          />
        </div>

        {/* Categories horizontal list */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-[#FF4D8D] text-white border-[#FF4D8D]"
                  : "bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100 dark:bg-zinc-900 dark:border-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 1. INTERACTIVE MEMORY MAP */}
      <div className="bg-white/95 rounded-[24px] p-5 border border-[#FF4D8D]/10 shadow-sm dark:bg-[#181818] dark:border-zinc-800">
        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2.5">Your Date Night Location Map</span>
        <div className="relative h-44 bg-[#FFF6F9] rounded-2xl overflow-hidden border border-[#FF4D8D]/10 dark:bg-zinc-900/60 dark:border-zinc-800 shadow-inner">
          
          {/* Mock abstract grid background */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#FF4D8D_1px,transparent_1px)] [background-size:16px_16px]" />
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Map interactive pins */}
          {mapPins.map((pin, i) => (
            <div 
              key={i} 
              className="absolute group"
              style={{ left: pin.x, top: pin.y }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-4 h-4 bg-[#FF4D8D] rounded-full animate-ping opacity-35" />
                <MapPin className="w-5 h-5 text-[#FF4D8D] relative z-10 cursor-pointer hover:scale-125 transition-transform" />
                
                {/* Pin Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2.5 py-1.5 rounded-xl whitespace-nowrap shadow-md z-20 pointer-events-none text-center">
                  <p className="font-bold">{pin.name}</p>
                  <p className="text-[8px] text-rose-300 mt-0.5">{pin.desc}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-lg text-[9px] font-bold text-[#FF4D8D] shadow-sm dark:bg-zinc-800">
            SECURE MAP TRACKING ACTIVE
          </div>
        </div>
      </div>

      {/* 2. MEMORY TIMELINE LIST */}
      <div className="relative border-l border-[#FF4D8D]/20 ml-4 space-y-6 dark:border-zinc-800">
        {filteredMemories.length === 0 ? (
          <div className="p-8 text-center text-gray-400 bg-white rounded-2xl dark:bg-zinc-900">
            <AlertCircle className="w-8 h-8 text-[#FF4D8D] mx-auto opacity-40 mb-2" />
            <p className="text-xs font-semibold">No memories matched your active filters.</p>
          </div>
        ) : (
          filteredMemories.map((mem) => (
            <div key={mem.id} className="relative pl-6">
              
              {/* Floating marker node on timeline */}
              <div className="absolute -left-2.5 top-1 w-5 h-5 bg-white border-2 border-[#FF4D8D] rounded-full flex items-center justify-center dark:bg-zinc-900">
                <Heart className="w-2.5 h-2.5 text-[#FF4D8D]" fill="#FF4D8D" />
              </div>

              {/* Memory Card */}
              <div className="bg-white/95 rounded-2xl p-5 border border-[#FF4D8D]/10 shadow-sm dark:bg-[#181818] dark:border-zinc-800/80">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] bg-rose-50 text-[#FF4D8D] font-bold px-2 py-0.5 rounded-md dark:bg-rose-950/20">
                      {mem.category}
                    </span>
                    <h4 className="text-sm font-bold text-gray-800 mt-2 dark:text-zinc-100">{mem.title}</h4>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">{mem.date}</span>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed mt-2 dark:text-gray-400">
                  {mem.description}
                </p>

                {mem.location && (
                  <div className="mt-3.5 flex items-center space-x-1.5 text-[10px] text-gray-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#FF4D8D]" />
                    <span>{mem.location}</span>
                  </div>
                )}

                <div className="mt-4 border-t border-gray-50 pt-2.5 flex justify-between items-center text-[9px] text-gray-400 dark:border-zinc-800/40">
                  <span>Archived by {mem.addedBy}</span>
                  <span className="font-semibold text-rose-300 flex items-center space-x-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Memory Synced</span>
                  </span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* 3. ADD MEMORY MODAL POPUP */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-sm w-full p-6 border border-rose-100 dark:bg-zinc-900 dark:border-zinc-800">
            <h4 className="font-display font-bold text-lg text-gray-800 mb-4 dark:text-zinc-100">Archive Sweet Memory</h4>
            
            <form onSubmit={handleCreateMemory} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Memory Title</label>
                <input 
                  type="text" required placeholder="e.g. Rainy sunset at the beach" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs dark:bg-zinc-950 dark:border-zinc-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Description / Scrapbook Story</label>
                <textarea 
                  rows={3} required placeholder="What made this moment beautiful?" value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs dark:bg-zinc-950 dark:border-zinc-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Date</label>
                  <input 
                    type="date" required value={newDate} onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs dark:bg-zinc-950 dark:border-zinc-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Category</label>
                  <select 
                    value={newCat} onChange={(e: any) => setNewCat(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs dark:bg-zinc-950 dark:border-zinc-900 dark:text-white"
                  >
                    <option>First Date</option>
                    <option>Milestone</option>
                    <option>Travel</option>
                    <option>First Gift</option>
                    <option>First Kiss</option>
                    <option>Proposal</option>
                    <option>General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Location Venue</label>
                <input 
                  type="text" placeholder="e.g. Bean & Leaf Cafe" value={newLoc} onChange={(e) => setNewLoc(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs dark:bg-zinc-950 dark:border-zinc-900 dark:text-white"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-500 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF4D8D] text-white rounded-xl text-xs font-bold shadow-md hover:opacity-90 cursor-pointer"
                >
                  Save in Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
