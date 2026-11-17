import { UserProfile, ChatMessage, Memory, DiaryEntry, FutureMessage, LoveStats, TodoItem, WishlistItem, CalendarEvent } from "./types";

export const initialProfileA: UserProfile = {
  id: "user-a",
  name: "Liam Parker",
  nickname: "Lee",
  gender: "Male",
  birthday: "1999-10-12",
  relationshipStatus: "In a Relationship",
  loveLanguage: "Quality Time",
  favoriteColor: "#FF4D8D",
  favoriteFood: "Truffle Pasta",
  favoriteSong: "Lover by Taylor Swift",
  favoriteMovie: "About Time",
  hobbies: "Acoustic Guitar, Coffee Brewing, Photography",
  anniversary: "2024-05-20",
  favoriteDateSpot: "Sunset Beach Cliffs",
  profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
  coverPic: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop&q=80",
  bio: "Just a romantic soul captured by your smile. Coffee geek & amateur photog."
};

export const initialProfileB: UserProfile = {
  id: "user-b",
  name: "Sophia Evans",
  nickname: "Sophie",
  gender: "Female",
  birthday: "2000-02-14",
  relationshipStatus: "In a Relationship",
  loveLanguage: "Words of Affirmation",
  favoriteColor: "#FF8FB8",
  favoriteFood: "Sushi & Matcha Mochi",
  favoriteSong: "Adore You by Harry Styles",
  favoriteMovie: "La La Land",
  hobbies: "Watercolor Painting, Reading, Hiking",
  anniversary: "2024-05-20",
  favoriteDateSpot: "Secret Botanical Greenhouse",
  profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
  coverPic: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop&q=80",
  bio: "Painting my world in pink and gold. Dog lover. Forever day-dreaming with you."
};

export const initialMessages: ChatMessage[] = [
  {
    id: "msg-1",
    senderId: "user-a",
    text: "Hey beautiful! Did you see the sunrise this morning? Reminded me of our trip last summer 🌅",
    timestamp: "10:30 AM",
    type: "text",
    reactions: [{ user: "user-b", emoji: "❤️" }],
    isRead: true
  },
  {
    id: "msg-2",
    senderId: "user-b",
    text: "Aww, yes I did! It was absolutely stunning. I was just thinking about you!",
    timestamp: "10:32 AM",
    type: "text",
    reactions: [{ user: "user-a", emoji: "🥰" }],
    isRead: true
  },
  {
    id: "msg-3",
    senderId: "user-a",
    text: "Can't wait for our dinner tonight! I reserved a table at that cozy garden spot you love.",
    timestamp: "10:35 AM",
    type: "text",
    reactions: [],
    isRead: true
  }
];

export const initialMemories: Memory[] = [
  {
    id: "mem-1",
    title: "First Meeting at the Coffee Shop",
    description: "You spilled a tiny bit of matcha on my sketchbook, and then spent 10 minutes apologizing. Best clumsy moment ever.",
    date: "2024-01-15",
    category: "First Date",
    location: "Bean & Leaf Cafe",
    addedBy: "Liam Parker"
  },
  {
    id: "mem-2",
    title: "Our Anniversary Trip",
    description: "Rented that tiny cabin in the woods. Watched the rainfall from the glass patio under a warm duvet.",
    date: "2025-05-20",
    category: "Milestone",
    location: "Cascade Ridge Cabins",
    addedBy: "Sophia Evans"
  },
  {
    id: "mem-3",
    title: "First Gift: Hand-painted Sketchbook",
    description: "Liam got me an embossed leather sketchbook with custom gold lettering on the first page. Still my favorite item.",
    date: "2024-02-14",
    category: "First Gift",
    location: "My Cozy Room",
    addedBy: "Sophia Evans"
  }
];

export const initialDiaryEntries: DiaryEntry[] = [
  {
    id: "diary-1",
    title: "The day I knew it was real",
    content: "When I was sick last week and Liam drove all the way across town at 1 AM just to bring me chicken soup and medicine. I've never felt so protected. I want to keep this feeling locked in my heart forever.",
    date: "2025-06-11",
    author: "Sophia Evans",
    isLocked: true,
    secretCode: "5201314"
  }
];

export const initialFutureMessages: FutureMessage[] = [
  {
    id: "future-1",
    to: "Sophia Evans",
    from: "Liam Parker",
    text: "If you're reading this, happy 2nd Anniversary, my queen! I hope we are standing in our dream greenhouse right now, holding a cozy matcha latte. Thank you for making these past 2 years the happiest of my life.",
    deliverDate: "2026-05-20",
    isOpened: false
  }
];

export const initialLoveStats: LoveStats = {
  streak: 42,
  xp: 780,
  level: 8,
  moodA: "😊 Happy",
  moodB: "🥰 Loved",
  trustScore: 98,
  commScore: 95,
  loveMeter: 96
};

export const initialTodoList: TodoItem[] = [
  { id: "todo-1", text: "Reserve weekend movie tickets", completed: true, assignedTo: "user-a" },
  { id: "todo-2", text: "Buy matcha mochi powder", completed: false, assignedTo: "user-b" },
  { id: "todo-3", text: "Plan our fall getaway", completed: false }
];

export const initialWishlist: WishlistItem[] = [
  { id: "wish-1", title: "Retro Fujifilm Instax Mini", price: "$79.99" },
  { id: "wish-2", title: "Cozy Alpaca Throw Blanket", price: "$45.00", reservedBy: "user-a" }
];

export const initialEvents: CalendarEvent[] = [
  { id: "event-1", title: "Anniversary Celebration Dinner 🍷", date: "2026-05-20", time: "07:00 PM", description: "Sartori's Garden Bistro. Dress code: Formal elegant." },
  { id: "event-2", title: "Couples Pottery Class 🏺", date: "2026-07-15", time: "02:00 PM", description: "Clay Harmony Studio. Get ready to get messy!" }
];

export interface QuizQuestion {
  question: string;
  options: string[];
  answerA?: number; // Chosen index by Liam
  answerB?: number; // Chosen index by Sophia
}

export const initialQuiz: QuizQuestion[] = [
  {
    question: "What is Liam's absolute dream travel destination?",
    options: ["Kyoto, Japan", "Amalfi Coast, Italy", "Reykjavik, Iceland", "Swiss Alps"],
    answerA: 0,
    answerB: 0
  },
  {
    question: "What was our first movie together?",
    options: ["About Time", "The Notebook", "La La Land", "Interstellar"],
    answerA: 2,
    answerB: 2
  },
  {
    question: "What is Sophia's ideal weekend morning?",
    options: ["Sleeping in & matcha in bed", "Hike up the mountain to see sunrise", "Strolling through farmer's market", "Painting with cozy music"],
    answerA: 3,
    answerB: 3
  }
];
