export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  gender: string;
  birthday: string;
  relationshipStatus: string;
  loveLanguage: string;
  favoriteColor: string;
  favoriteFood: string;
  favoriteSong: string;
  favoriteMovie: string;
  hobbies: string;
  anniversary: string;
  favoriteDateSpot: string;
  profilePic: string;
  coverPic: string;
  bio: string;
}

export interface CoupleState {
  code: string;
  isJoined: boolean;
  partnerName: string;
}

export interface MessageReaction {
  user: string;
  emoji: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'image' | 'voice' | 'drawing' | 'location' | 'sticker';
  mediaUrl?: string;
  reactions: MessageReaction[];
  isRead: boolean;
  replyToId?: string;
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'First Date' | 'Milestone' | 'Travel' | 'First Gift' | 'First Kiss' | 'Proposal' | 'General';
  mediaUrl?: string;
  location?: string;
  addedBy: string;
}

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  isLocked: boolean;
  secretCode?: string;
}

export interface FutureMessage {
  id: string;
  to: string;
  from: string;
  text: string;
  deliverDate: string;
  isOpened: boolean;
}

export interface LoveStats {
  streak: number;
  xp: number;
  level: number;
  moodA: string;
  moodB: string;
  trustScore: number; // 0 - 100
  commScore: number;  // 0 - 100
  loveMeter: number;  // 0 - 100
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  assignedTo?: string;
}

export interface WishlistItem {
  id: string;
  title: string;
  price?: string;
  link?: string;
  reservedBy?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  description?: string;
}

export interface DrawStroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}
