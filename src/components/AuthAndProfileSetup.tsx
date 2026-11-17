import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, Lock, Shield, Sparkles, Smartphone, Eye, EyeOff, Check, AlertCircle, 
  User, Calendar, Heart, Music, Film, MapPin, Camera, Image as ImageIcon,
  CheckCircle2, Laptop, Tablet, LogOut, ArrowRight, Palette, RefreshCw, SmartphoneIcon
} from "lucide-react";
import { UserProfile, CoupleState } from "../types";
import { initialProfileA, initialProfileB } from "../data";

interface AuthProfileSetupProps {
  onSetupComplete: (userProfile: UserProfile, partnerProfile: UserProfile, coupleState: CoupleState) => void;
}

export default function AuthAndProfileSetup({ onSetupComplete }: AuthProfileSetupProps) {
  const [step, setStep] = useState<'login' | 'otp' | 'profile' | 'couple'>('login');
  const [authMethod, setAuthMethod] = useState<'email' | 'google' | 'sms'>('email');
  
  // Login Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "Weak", color: "bg-red-400" });
  const [rememberDevice, setRememberDevice] = useState(true);

  // Google Login states
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  
  // Phone SMS states
  const [phoneNumber, setPhoneNumber] = useState("");

  // OTP States
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpError, setOtpError] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");

  // Profile Wizard states (Clean, empty by default to prevent default characters)
  const [profileSubStep, setProfileSubStep] = useState<'user' | 'partner'>('user');
  
  // User Profile
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("Female");
  const [birthday, setBirthday] = useState("");
  const [relationshipStatus, setRelationshipStatus] = useState("In a Relationship");
  const [loveLanguage, setLoveLanguage] = useState("Quality Time");
  const [favoriteColor, setFavoriteColor] = useState("#FF4D8D");
  const [favoriteFood, setFavoriteFood] = useState("");
  const [favoriteSong, setFavoriteSong] = useState("");
  const [favoriteMovie, setFavoriteMovie] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [favoriteDateSpot, setFavoriteDateSpot] = useState("");
  const [profilePic, setProfilePic] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80"); // Elegant generic woman pic
  const [coverPic, setCoverPic] = useState("https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=400&fit=crop&q=80");
  const [bio, setBio] = useState("");

  // Partner Profile
  const [pName, setPName] = useState("");
  const [pNickname, setPNickname] = useState("");
  const [pGender, setPGender] = useState("Male");
  const [pBirthday, setPBirthday] = useState("");
  const [pLoveLanguage, setPLoveLanguage] = useState("Words of Affirmation");
  const [pFavoriteColor, setPFavoriteColor] = useState("#3B82F6");
  const [pFavoriteFood, setPFavoriteFood] = useState("");
  const [pFavoriteSong, setPFavoriteSong] = useState("");
  const [pFavoriteMovie, setPFavoriteMovie] = useState("");
  const [pHobbies, setPHobbies] = useState("");
  const [pFavoriteDateSpot, setPFavoriteDateSpot] = useState("");
  const [pProfilePic, setPProfilePic] = useState("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80"); // Elegant generic man pic
  const [pCoverPic, setPCoverPic] = useState("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop&q=80");
  const [pBio, setPBio] = useState("");

  // Setup mode: manully set up both profiles or invite partner
  const [setupMode, setSetupMode] = useState<'both' | 'invite'>('both');

  // Couple Connection States
  const [coupleCode, setCoupleCode] = useState("L0V3-L00P-777");
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [partnerConnected, setPartnerConnected] = useState(false);

  // Active devices mock list
  const [activeDevices, setActiveDevices] = useState([
    { id: "dev-1", name: "Apple iPhone 15 Pro", location: "San Francisco, US (Current)", active: true, icon: <Smartphone className="w-4 h-4 text-[#FF4D8D]" /> },
    { id: "dev-2", name: "MacBook Pro 16", location: "San Francisco, US", active: false, icon: <Laptop className="w-4 h-4 text-gray-400" /> }
  ]);

  // Generate dynamic captcha on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    if (step === 'otp' && otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, otpTimer]);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let text = "";
    for (let i = 0; i < 5; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaValue(text);
    setCaptchaInput("");
    setCaptchaError("");
  };

  const triggerOtpDelivery = (targetMedium: string, type: 'SMS' | 'Email' | 'Google') => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSentOtp(randomCode);
    setOtpCode(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpTimer(60);

    let msg = "";
    if (type === 'SMS') {
      msg = `💬 SMS Gateway: Your LoveLoop OTP verification code is ${randomCode}`;
    } else if (type === 'Google') {
      msg = `📧 Google Identity check: Authentication code for ${targetMedium} is ${randomCode}`;
    } else {
      msg = `📧 Secure Mail Server: LoveLoop code sent to ${targetMedium} is ${randomCode}`;
    }

    setNotificationMsg(msg);
    setShowNotification(true);
    setStep('otp');

    // Auto-dismiss notification after 15 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 15000);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    
    let score = 0;
    if (val.length >= 8) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    if (val.length === 0) {
      setPasswordStrength({ score: 0, text: "Too short", color: "bg-gray-200" });
    } else if (score <= 1) {
      setPasswordStrength({ score: 1, text: "Weak", color: "bg-red-400" });
    } else if (score <= 3) {
      setPasswordStrength({ score: 3, text: "Medium", color: "bg-amber-400" });
    } else {
      setPasswordStrength({ score: 4, text: "Strong! 💪", color: "bg-emerald-400" });
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.toUpperCase() !== captchaValue) {
      setCaptchaError("Incorrect security code. Please try again.");
      generateCaptcha();
      return;
    }
    if (authMethod === 'email') {
      setStep('profile');
    } else if (authMethod === 'sms') {
      if (!phoneNumber.trim()) {
        setCaptchaError("Please enter a valid phone number.");
        return;
      }
      setStep('profile');
    }
  };

  // Google Simulated SSO Activation
  const handleGoogleSsoSelect = (gmail: string, userName: string) => {
    setEmail(gmail);
    setShowGoogleModal(false);
    setStep('profile');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otpCode];
    newOtp[index] = val.substring(val.length - 1);
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const joined = otpCode.join("");
    if (joined.length < 6) {
      setOtpError("Please enter the complete 6-digit verification code.");
      return;
    }
    
    // Check real generated code
    if (joined !== sentOtp) {
      setOtpError("Invalid verification code. Please check your notification or click resend.");
      return;
    }

    // Success OTP - transition to Profile setup
    setShowNotification(false);
    setStep('profile');
  };

  const handleAutofillDemo = () => {
    // Fill self
    setName("Liam Parker");
    setNickname("Lee");
    setGender("Male");
    setBirthday("1999-10-12");
    setRelationshipStatus("In a Relationship");
    setLoveLanguage("Quality Time");
    setFavoriteColor("#FF4D8D");
    setFavoriteFood("Truffle Pasta");
    setFavoriteSong("Lover by Taylor Swift");
    setFavoriteMovie("About Time");
    setHobbies("Acoustic Guitar, Coffee, Photography");
    setAnniversary("2024-05-20");
    setFavoriteDateSpot("Sunset Beach Cliffs");
    setProfilePic("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80");
    setBio("Coffee geek & amateur photographer. Captivated by your smile.");

    // Fill partner
    setPName("Sophia Evans");
    setPNickname("Sophie");
    setPGender("Female");
    setPBirthday("2000-02-14");
    setPLoveLanguage("Words of Affirmation");
    setPFavoriteColor("#FF8FB8");
    setPFavoriteFood("Sushi & Matcha Mochi");
    setPFavoriteSong("Adore You by Harry Styles");
    setPFavoriteMovie("La La Land");
    setPHobbies("Watercolor, Reading, Hiking");
    setPProfilePic("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80");
    setPBio("Painting my world in pink and gold. Dog lover. Forever daydreaming.");
  };

  const handleProfileWizardNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileSubStep === 'user') {
      if (setupMode === 'both') {
        setProfileSubStep('partner');
      } else {
        // Invite Mode: Auto create a clean template partner
        setPName("My Loved One");
        setPNickname("Love");
        setPGender("Male");
        setPBirthday("1999-01-01");
        setPLoveLanguage("Quality Time");
        setPFavoriteColor("#FF8FB8");
        setPProfilePic("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80");
        setStep('couple');
      }
    } else {
      setStep('couple');
    }
  };

  // Quick setup with preset couples Liam & Sophia
  const handleQuickBypass = () => {
    const userProfile: UserProfile = {
      id: "user-a",
      name: "Liam Parker",
      nickname: "Lee",
      gender: "Male",
      birthday: "1999-10-12",
      relationshipStatus: "In a Relationship",
      loveLanguage: "Quality Time",
      favoriteColor: "#FF4D8D",
      favoriteFood: "Truffle Pasta",
      favoriteSong: "Lover",
      favoriteMovie: "About Time",
      hobbies: "Acoustic Guitar",
      anniversary: "2024-05-20",
      favoriteDateSpot: "Sunset Cliffs",
      profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
      coverPic: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop&q=80",
      bio: "Amateur photographer and romantic."
    };

    const partnerProfile: UserProfile = {
      id: "user-b",
      name: "Sophia Evans",
      nickname: "Sophie",
      gender: "Female",
      birthday: "2000-02-14",
      relationshipStatus: "In a Relationship",
      loveLanguage: "Words of Affirmation",
      favoriteColor: "#FF8FB8",
      favoriteFood: "Sushi",
      favoriteSong: "Adore You",
      favoriteMovie: "La La Land",
      hobbies: "Watercolor Painting",
      anniversary: "2024-05-20",
      favoriteDateSpot: "Botanical Garden",
      profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
      coverPic: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop&q=80",
      bio: "Painting my world in pink and gold."
    };

    const coupleState: CoupleState = {
      code: "L0V3-L00P-777",
      isJoined: true,
      partnerName: "Sophia Evans"
    };

    onSetupComplete(userProfile, partnerProfile, coupleState);
  };

  const handleConnectPartner = () => {
    if (!inviteCodeInput.trim()) return;
    setPartnerConnected(true);
  };

  const handleStartSharedSpace = () => {
    const userProfile: UserProfile = {
      id: "user-a",
      name: name || "You",
      nickname: nickname || "You",
      gender,
      birthday,
      relationshipStatus,
      loveLanguage,
      favoriteColor,
      favoriteFood,
      favoriteSong,
      favoriteMovie,
      hobbies,
      anniversary,
      favoriteDateSpot,
      profilePic,
      coverPic,
      bio
    };

    // If setupManually is false, partner name will be filled from input or generic
    const partnerProfile: UserProfile = {
      id: "user-b",
      name: setupMode === 'both' ? (pName || "Partner") : "Partner",
      nickname: setupMode === 'both' ? (pNickname || "Partner") : "Partner",
      gender: pGender,
      birthday: pBirthday,
      relationshipStatus,
      loveLanguage: pLoveLanguage,
      favoriteColor: pFavoriteColor,
      favoriteFood: pFavoriteFood,
      favoriteSong: pFavoriteSong,
      favoriteMovie: pFavoriteMovie,
      hobbies: pHobbies,
      anniversary,
      favoriteDateSpot: pFavoriteDateSpot,
      profilePic: pProfilePic,
      coverPic: pCoverPic,
      bio: pBio
    };

    const coupleState: CoupleState = {
      code: coupleCode,
      isJoined: setupMode === 'both' ? true : partnerConnected,
      partnerName: setupMode === 'both' ? (pName || "Partner") : (partnerConnected ? "Partner" : "")
    };

    onSetupComplete(userProfile, partnerProfile, coupleState);
  };

  return (
    <div className="min-h-screen animated-romantic-bg flex flex-col justify-center items-center py-10 px-4 relative">
      
      {/* 2FA Push Notification alert overlay */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="fixed top-6 left-4 right-4 max-w-md mx-auto bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-rose-500/30 z-50 flex items-start space-x-3 cursor-pointer"
            onClick={() => setShowNotification(false)}
          >
            <div className="p-2 bg-gradient-to-tr from-[#FF4D8D] to-[#FF8FB8] rounded-xl text-white">
              <SmartphoneIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[#FF8FB8] uppercase tracking-wider text-[10px]">Security Gateway</span>
                <span className="text-[10px] text-gray-400">Just Now</span>
              </div>
              <p className="font-mono text-gray-200 leading-relaxed font-bold select-all bg-slate-950/60 p-2 rounded-lg mt-1 border border-slate-800">
                {notificationMsg}
              </p>
              <p className="text-[10px] text-gray-400 mt-1">💡 Click this banner to dismiss, or highlight the code to copy.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Sign-In Simulation Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-2xl border border-gray-100 text-gray-800"
            >
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs font-black">G</div>
                  <span className="font-bold text-sm text-gray-700">Sign in with Google</span>
                </div>
                <button 
                  onClick={() => setShowGoogleModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-gray-500 mb-4">Choose an account to proceed securely to <strong>LoveLoop Private Space</strong>:</p>
              
              <div className="space-y-2">
                {/* 1. Developer's verified account */}
                <button
                  type="button"
                  onClick={() => handleGoogleSsoSelect("ratthikaratthika55@gmail.com", "Ratthika")}
                  className="w-full p-3.5 border border-gray-200 hover:border-[#FF4D8D] hover:bg-rose-50/10 rounded-2xl text-left flex items-center space-x-3 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-100 text-[#FF4D8D] flex items-center justify-center font-bold text-sm">
                    R
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">Ratthika</p>
                    <p className="text-[10px] text-gray-400">ratthikaratthika55@gmail.com</p>
                  </div>
                </button>

                {/* 2. Secondary custom test email */}
                <button
                  type="button"
                  onClick={() => handleGoogleSsoSelect("my.loved.one@gmail.com", "My Love")}
                  className="w-full p-3.5 border border-gray-200 hover:border-[#FF4D8D] hover:bg-rose-50/10 rounded-2xl text-left flex items-center space-x-3 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center font-bold text-sm">
                    L
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">My Love</p>
                    <p className="text-[10px] text-gray-400">my.loved.one@gmail.com</p>
                  </div>
                </button>
              </div>

              <p className="text-[10px] text-gray-400 text-center mt-5 leading-normal">
                Google verifies your identity instantly so you can securely proceed to your LoveLoop space.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Bypass floating button in corner */}
      <div className="fixed top-4 right-4 z-40">
        <button 
          onClick={handleQuickBypass}
          className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] text-white text-xs font-semibold rounded-full shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Connect Demo Setup</span>
        </button>
      </div>

      <div className="w-full max-w-xl bg-white/95 rounded-[32px] shadow-xl p-8 border border-rose-100 dark:bg-[#181818]/95 dark:border-zinc-800">
        
        {/* Step Header */}
        <div className="text-center mb-8">
          <div className="inline-flex justify-center items-center p-2.5 bg-rose-50 rounded-full text-[#FF4D8D] mb-4 dark:bg-rose-950/20">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-gray-900 dark:text-white">
            {step === 'login' && "Human Verification & Sign-In"}
            {step === 'profile' && (profileSubStep === 'user' ? "Your Personal Profile" : "Your Loved One's Profile")}
            {step === 'couple' && "Create Shared Bubble"}
          </h2>
          <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
            {step === 'login' && "Enter your credentials and solve the captcha to proceed directly to profile setup."}
            {step === 'profile' && (profileSubStep === 'user' ? "Share your genuine real-life traits, food, and color." : "Configure your partner's actual custom name and nickname.")}
            {step === 'couple' && "Connect directly with your partner to lock down your private space."}
          </p>
        </div>

        {/* 1. LOGIN SCREEN */}
        {step === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            
            {/* Method Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl dark:bg-zinc-900">
              <button 
                type="button"
                onClick={() => { setAuthMethod('email'); setCaptchaError(""); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${authMethod === 'email' ? 'bg-white text-[#FF4D8D] shadow-sm dark:bg-zinc-800' : 'text-gray-500'}`}
              >
                Email & Pass
              </button>
              <button 
                type="button"
                onClick={() => { setAuthMethod('sms'); setCaptchaError(""); }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${authMethod === 'sms' ? 'bg-white text-[#FF4D8D] shadow-sm dark:bg-zinc-800' : 'text-gray-500'}`}
              >
                Phone Login
              </button>
            </div>

            {authMethod === 'email' ? (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. ratthikaratthika55@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#FF4D8D]/40 focus:bg-white text-xs transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={handlePasswordChange}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#FF4D8D]/40 focus:bg-white text-xs transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>Password Strength:</span>
                        <span className="font-semibold text-gray-600 dark:text-zinc-300">{passwordStrength.text}</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden dark:bg-zinc-800">
                        <div className={`h-full ${passwordStrength.color} transition-all duration-300`} style={{ width: `${(passwordStrength.score / 4) * 100}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Mobile Phone Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono font-bold">
                    +1
                  </span>
                  <input 
                    type="tel" 
                    required
                    placeholder="(555) 019-2834"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#FF4D8D]/40 focus:bg-white text-xs transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-white font-mono"
                  />
                </div>
              </div>
            )}

            {/* Captcha - Required only for Standard Sign Up/In */}
            <div className="bg-gray-50 p-4 rounded-[20px] border border-gray-100 space-y-3 dark:bg-zinc-900/60 dark:border-zinc-800">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Anti-Bot Validation</span>
                <button 
                  type="button" 
                  onClick={generateCaptcha}
                  className="text-[10px] text-[#FF4D8D] flex items-center space-x-1 font-semibold hover:opacity-85"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh Code</span>
                </button>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-tr from-rose-100 to-rose-200 px-4 py-2 rounded-xl text-sm font-mono tracking-widest text-[#FF4D8D] font-black italic select-none border border-rose-300 dark:from-rose-950 dark:to-rose-900 dark:border-rose-900 shadow-inner">
                  {captchaValue}
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Characters"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-white border border-gray-200 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-[#FF4D8D]/40 text-xs font-mono dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                />
              </div>
              {captchaError && (
                <div className="flex items-center space-x-1.5 text-xs text-red-500 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{captchaError}</span>
                </div>
              )}
            </div>

            {/* Remember toggle */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 cursor-pointer dark:text-gray-400">
                <input 
                  type="checkbox" 
                  checked={rememberDevice}
                  onChange={(e) => setRememberDevice(e.target.checked)}
                  className="rounded text-[#FF4D8D] focus:ring-[#FF4D8D] w-3.5 h-3.5"
                />
                <span>Remember this device</span>
              </label>
              <button type="button" className="text-[10px] text-[#FF4D8D] font-bold hover:underline">
                Forgot password?
              </button>
            </div>

            {/* Google Single Sign-On Button */}
            <div className="border-t border-gray-100 pt-4 dark:border-zinc-800">
              <p className="text-[10px] text-gray-400 text-center uppercase tracking-wider font-bold mb-3">Or Authenticate Fast Via</p>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowGoogleModal(true)}
                  className="py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                >
                  <span className="font-black text-[#FF4D8D]">G</span>
                  <span>Login with Google</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setStep('profile')}
                  className="py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 transition-all dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-[#FF4D8D]" />
                  <span>Guest Sign-In</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] text-white text-xs font-black rounded-[18px] shadow-lg shadow-rose-200/50 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer uppercase"
            >
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* 2. OTP AUTHENTICATION SCREEN */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="text-center">
              <span className="text-[10px] uppercase font-bold text-[#FF4D8D] bg-rose-50 px-2.5 py-1 rounded-full dark:bg-rose-950/40">Real Security Shield Active</span>
            </div>
            
            <div className="flex justify-center space-x-2">
              {otpCode.map((char, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={char}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !char && index > 0) {
                      const prevInput = document.getElementById(`otp-${index - 1}`);
                      prevInput?.focus();
                    }
                  }}
                  className="w-10 h-12 text-center text-lg font-black bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FF4D8D] focus:ring-0 focus:bg-white text-gray-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white font-mono"
                />
              ))}
            </div>

            {otpError && (
              <div className="flex items-center justify-center space-x-1.5 text-xs text-red-500 font-bold text-center">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{otpError}</span>
              </div>
            )}

            <div className="text-center text-xs text-gray-400">
              {otpTimer > 0 ? (
                <span>Resend secure OTP code in <strong className="text-gray-600 dark:text-zinc-200 font-mono font-bold">{otpTimer}s</strong></span>
              ) : (
                <button 
                  type="button" 
                  onClick={() => triggerOtpDelivery(email || phoneNumber || "user", authMethod === 'sms' ? 'SMS' : 'Email')}
                  className="text-[#FF4D8D] font-bold hover:underline cursor-pointer"
                >
                  Resend Secure Code
                </button>
              )}
            </div>

            <div className="border-t border-gray-100 pt-5 dark:border-zinc-800">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">Protected Session Logs</h4>
              <div className="space-y-2">
                {activeDevices.map(device => (
                  <div key={device.id} className="flex justify-between items-center text-xs text-gray-500 bg-gray-50/60 p-2.5 rounded-xl dark:bg-zinc-900/40">
                    <div className="flex items-center space-x-2">
                      {device.icon}
                      <div>
                        <p className="font-bold text-gray-700 dark:text-zinc-200 text-[11px]">{device.name}</p>
                        <p className="text-[9px] text-gray-400">{device.location}</p>
                      </div>
                    </div>
                    {device.active ? (
                      <span className="text-[8px] bg-rose-50 text-[#FF4D8D] font-black px-1.5 py-0.5 rounded-md dark:bg-rose-950/40">CURRENT</span>
                    ) : (
                      <button type="button" className="text-[9px] text-gray-400 hover:text-red-400 transition-colors">Terminate</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                type="button"
                onClick={() => setStep('login')}
                className="flex-1 py-3 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] text-white text-xs font-black rounded-xl shadow-md hover:opacity-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer uppercase"
              >
                <span>Verify & Unlock</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* 3. CREATE PROFILE FORM SCREEN */}
        {step === 'profile' && (
          <form onSubmit={handleProfileWizardNext} className="space-y-5">
            
            {/* Quick Demo Autofill helper */}
            <div className="flex justify-between items-center bg-[#FFF6F9] border border-[#FF4D8D]/10 p-3 rounded-2xl dark:bg-rose-950/5">
              <span className="text-[10px] text-gray-500 font-medium">Want to quickly explore with demo data?</span>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="px-3 py-1 bg-gradient-to-r from-[#FF4D8D]/15 to-[#FF8FB8]/15 text-[#FF4D8D] rounded-lg text-[10px] font-bold hover:opacity-90 transition-all cursor-pointer"
              >
                Autofill Cozy Characters
              </button>
            </div>

            {/* Sub-step indicator */}
            <div className="flex items-center space-x-3 border-b border-gray-100 pb-3 dark:border-zinc-800">
              <span className={`text-xs font-bold pb-1 cursor-pointer transition-all ${profileSubStep === 'user' ? 'text-[#FF4D8D] border-b-2 border-[#FF4D8D]' : 'text-gray-400'}`} onClick={() => setProfileSubStep('user')}>
                1. Your Profile ({nickname || "You"})
              </span>
              {setupMode === 'both' && (
                <span className={`text-xs font-bold pb-1 cursor-pointer transition-all ${profileSubStep === 'partner' ? 'text-[#FF4D8D] border-b-2 border-[#FF4D8D]' : 'text-gray-400'}`} onClick={() => { if (name && nickname) setProfileSubStep('partner'); }}>
                  2. Loved One's Profile ({pNickname || "Partner"})
                </span>
              )}
            </div>

            <div className="max-h-[380px] overflow-y-auto pr-1.5 space-y-4">
              
              {profileSubStep === 'user' ? (
                <>
                  {/* USER PICTURES */}
                  <div className="relative">
                    <div className="h-24 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative dark:bg-zinc-900 dark:border-zinc-800">
                      <img src={coverPic} alt="Cover" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setCoverPic("https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=400&fit=crop&q=80")}
                        className="absolute bottom-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full text-xs"
                        title="Change cover photo"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="absolute -bottom-4 left-4 flex items-end">
                      <div className="w-12 h-12 rounded-2xl border-2 border-white overflow-hidden shadow-md bg-white dark:border-[#181818] dark:bg-zinc-900">
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          const pics = [
                            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80"
                          ];
                          setProfilePic(pics[Math.floor(Math.random() * pics.length)]);
                        }}
                        className="ml-1 bg-rose-50 text-[#FF4D8D] p-1 rounded-full border border-rose-100 hover:bg-rose-100 transition-colors"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* USER FIELDS */}
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                      <input 
                        type="text" required placeholder="Your real name" value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#FF4D8D]/40 text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Love Nickname</label>
                      <input 
                        type="text" required placeholder="Pet name/short name" value={nickname} onChange={(e) => setNickname(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#FF4D8D]/40 text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Gender</label>
                      <select 
                        value={gender} onChange={(e) => setGender(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                      >
                        <option>Female</option>
                        <option>Male</option>
                        <option>Non-binary</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Birthday</label>
                      <input 
                        type="date" required value={birthday} onChange={(e) => setBirthday(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Relationship settings */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Anniversary Day</label>
                      <input 
                        type="date" required value={anniversary} onChange={(e) => setAnniversary(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">How to Set Up?</label>
                      <select 
                        value={setupMode} onChange={(e) => setSetupMode(e.target.value as any)}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 border border-[#FF4D8D]/20 rounded-xl text-xs font-bold text-[#FF4D8D] dark:bg-zinc-900 dark:border-zinc-800"
                      >
                        <option value="both">Create Both Profiles Manually</option>
                        <option value="invite">Create Mine & Invite My Partner</option>
                      </select>
                    </div>
                  </div>

                  {/* Love Language and Favorite color */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Love Language</label>
                      <select 
                        value={loveLanguage} onChange={(e) => setLoveLanguage(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                      >
                        <option>Quality Time</option>
                        <option>Words of Affirmation</option>
                        <option>Acts of Service</option>
                        <option>Physical Touch</option>
                        <option>Receiving Gifts</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center space-x-1">
                        <Palette className="w-3 h-3" />
                        <span>Fav Color</span>
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input 
                          type="color" value={favoriteColor} onChange={(e) => setFavoriteColor(e.target.value)}
                          className="w-7 h-7 border border-gray-200 rounded-lg cursor-pointer bg-transparent"
                        />
                        <span className="text-[10px] text-gray-400 font-mono uppercase">{favoriteColor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Favorites Section */}
                  <div className="space-y-2.5 p-3.5 bg-rose-50/40 rounded-2xl border border-rose-100/50 dark:bg-zinc-900/40 dark:border-zinc-800">
                    <span className="text-[10px] font-bold text-[#FF4D8D] uppercase tracking-wider flex items-center space-x-1">
                      <Heart className="w-3 h-3" fill="#FF4D8D" />
                      <span>About Your Favorites</span>
                    </span>
                    
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="text-gray-400 font-medium">Favorite Food</label>
                        <input 
                          type="text" placeholder="e.g. Italian Pizza" value={favoriteFood} onChange={(e) => setFavoriteFood(e.target.value)}
                          className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 font-medium">Favorite Song</label>
                        <input 
                          type="text" placeholder="e.g. Lover" value={favoriteSong} onChange={(e) => setFavoriteSong(e.target.value)}
                          className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="text-gray-400 font-medium">Favorite Movie</label>
                        <input 
                          type="text" placeholder="e.g. Titanic" value={favoriteMovie} onChange={(e) => setFavoriteMovie(e.target.value)}
                          className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 font-medium">Dream Date Spot</label>
                        <input 
                          type="text" placeholder="e.g. Venice Canal" value={favoriteDateSpot} onChange={(e) => setFavoriteDateSpot(e.target.value)}
                          className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Your Hobbies</label>
                    <input 
                      type="text" placeholder="Painting, Gardening, Music" value={hobbies} onChange={(e) => setHobbies(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Status Quote / Love Bio</label>
                    <textarea 
                      rows={2} placeholder="Write a sweet bio or quote that describes your mood." value={bio} onChange={(e) => setBio(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* PARTNER PICTURES */}
                  <div className="relative">
                    <div className="h-24 w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 relative dark:bg-zinc-900 dark:border-zinc-800">
                      <img src={pCoverPic} alt="Cover" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setPCoverPic("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop&q=80")}
                        className="absolute bottom-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full text-xs"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="absolute -bottom-4 left-4 flex items-end">
                      <div className="w-12 h-12 rounded-2xl border-2 border-white overflow-hidden shadow-md bg-white dark:border-[#181818] dark:bg-zinc-900">
                        <img src={pProfilePic} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => {
                          const pics = [
                            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&h=150&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80",
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&q=80"
                          ];
                          setPProfilePic(pics[Math.floor(Math.random() * pics.length)]);
                        }}
                        className="ml-1 bg-rose-50 text-[#FF4D8D] p-1 rounded-full border border-rose-100 hover:bg-rose-100 transition-colors"
                      >
                        <RefreshCw className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* PARTNER FIELDS */}
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Partner's Name</label>
                      <input 
                        type="text" required placeholder="Real name of your partner" value={pName} onChange={(e) => setPName(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#FF4D8D]/40 text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Love Nickname</label>
                      <input 
                        type="text" required placeholder="Partner's pet name" value={pNickname} onChange={(e) => setPNickname(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#FF4D8D]/40 text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Gender</label>
                      <select 
                        value={pGender} onChange={(e) => setPGender(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Non-binary</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Birthday</label>
                      <input 
                        type="date" required value={pBirthday} onChange={(e) => setPBirthday(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Love Language</label>
                      <select 
                        value={pLoveLanguage} onChange={(e) => setPLoveLanguage(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                      >
                        <option>Words of Affirmation</option>
                        <option>Quality Time</option>
                        <option>Acts of Service</option>
                        <option>Physical Touch</option>
                        <option>Receiving Gifts</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center space-x-1">
                        <Palette className="w-3 h-3" />
                        <span>Fav Color</span>
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <input 
                          type="color" value={pFavoriteColor} onChange={(e) => setPFavoriteColor(e.target.value)}
                          className="w-7 h-7 border border-gray-200 rounded-lg cursor-pointer bg-transparent"
                        />
                        <span className="text-[10px] text-gray-400 font-mono uppercase">{pFavoriteColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 p-3.5 bg-blue-50/40 rounded-2xl border border-blue-100/30 dark:bg-zinc-900/40 dark:border-zinc-800">
                    <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider flex items-center space-x-1">
                      <Heart className="w-3 h-3" fill="currentColor" />
                      <span>Partner's Favorites</span>
                    </span>
                    
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="text-gray-400 font-medium">Favorite Food</label>
                        <input 
                          type="text" placeholder="e.g. Pasta / Steak" value={pFavoriteFood} onChange={(e) => setPFavoriteFood(e.target.value)}
                          className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 font-medium">Favorite Song</label>
                        <input 
                          type="text" placeholder="e.g. Perfect" value={pFavoriteSong} onChange={(e) => setPFavoriteSong(e.target.value)}
                          className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <label className="text-gray-400 font-medium">Favorite Movie</label>
                        <input 
                          type="text" placeholder="e.g. Inception" value={pFavoriteMovie} onChange={(e) => setPFavoriteMovie(e.target.value)}
                          className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 font-medium">Dream Date Spot</label>
                        <input 
                          type="text" placeholder="e.g. Paris Eiffel" value={pFavoriteDateSpot} onChange={(e) => setPFavoriteDateSpot(e.target.value)}
                          className="w-full mt-0.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Partner's Hobbies</label>
                    <input 
                      type="text" placeholder="Guitars, Poetry, Hiking" value={pHobbies} onChange={(e) => setPHobbies(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Partner's Love Bio</label>
                    <textarea 
                      rows={2} placeholder="Write a short quote or description of your favorite companion." value={pBio} onChange={(e) => setPBio(e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                    />
                  </div>
                </>
              )}

            </div>

            <div className="flex space-x-3 pt-2">
              {profileSubStep === 'partner' && (
                <button
                  type="button"
                  onClick={() => setProfileSubStep('user')}
                  className="flex-1 py-3 border border-gray-200 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-50 dark:border-zinc-800 dark:text-zinc-400"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-3.5 bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] text-white text-xs font-black rounded-[18px] shadow-lg shadow-rose-200/50 hover:opacity-95 transition-all flex items-center justify-center space-x-1.5 cursor-pointer uppercase"
              >
                <span>
                  {profileSubStep === 'user' && setupMode === 'both' ? "Next: Partner Profile" : "Connect Private Space"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* 4. COUPLE CONNECT INVITATION SCREEN */}
        {step === 'couple' && (
          <div className="space-y-6">
            
            {/* Generate Invite Code section */}
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 text-center dark:bg-rose-950/20 dark:border-rose-900/30">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Your Secured Shared Bond Key</span>
              <div className="mt-2 text-2xl font-mono font-black text-[#FF4D8D] tracking-widest bg-white py-3 px-6 rounded-xl border border-rose-200 shadow-sm inline-block dark:bg-zinc-900 dark:border-zinc-800">
                {coupleCode}
              </div>
              <p className="text-xs text-gray-400 mt-2.5 max-w-sm mx-auto leading-relaxed">
                Send this secret connection key to your partner. When they login on their device, your Private Secured Space is synchronized instantly!
              </p>
            </div>

            {/* Enter Code From Partner section */}
            <div className="border border-gray-100 rounded-2xl p-5 space-y-3 dark:border-zinc-800">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Pair Instantly with Partner's Key</span>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="Paste partner's secure code"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4D8D]/40 text-xs font-mono dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                />
                <button 
                  onClick={handleConnectPartner}
                  className="px-5 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-colors cursor-pointer dark:bg-zinc-800 dark:hover:bg-zinc-700"
                >
                  Connect
                </button>
              </div>

              {partnerConnected ? (
                <div className="flex items-center space-x-2 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-600 font-bold dark:bg-emerald-950/30 dark:border-emerald-900/30">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Success! Connected securely with <strong>{pName || pNickname || "your loved one"}</strong>.</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 p-2.5 bg-rose-50 border border-rose-100/50 rounded-xl text-xs text-rose-500 font-semibold dark:bg-rose-950/20 dark:border-rose-900/20 animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  <span>Secure connection open. Waiting for pairing...</span>
                </div>
              )}
            </div>

            {/* Complete setup Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleStartSharedSpace}
                disabled={setupMode === 'invite' && !partnerConnected}
                className={`w-full py-4 text-xs font-black text-white rounded-[24px] shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer uppercase ${
                  (setupMode === 'both' || partnerConnected)
                    ? "bg-gradient-to-r from-[#FF4D8D] to-[#FF8FB8] hover:opacity-95 shadow-rose-200/50" 
                    : "bg-gray-300 shadow-none cursor-not-allowed opacity-60 dark:bg-zinc-800 dark:text-zinc-500"
                }`}
              >
                <span>Enter Protected Love Sanctuary</span>
                <Check className="w-5 h-5" />
              </button>

              {setupMode === 'invite' && !partnerConnected && (
                <button
                  type="button"
                  onClick={() => {
                    setInviteCodeInput("L00P-PARTNER-888");
                    setPartnerConnected(true);
                  }}
                  className="w-full py-2.5 bg-rose-50/50 text-[#FF4D8D] font-bold text-xs rounded-full border border-rose-100/50 hover:bg-rose-100 transition-all dark:bg-zinc-900 dark:border-zinc-800"
                >
                  Simulate Partner Joining Automatically
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
