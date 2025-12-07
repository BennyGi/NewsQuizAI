import AuthScreen from "./AuthScreen";
import Leaderboard from "./Leaderboard";
import React, { useEffect, useState, useRef } from "react";
import {
   MoonStar,
   SunMedium,
   Home,
   Accessibility,
   SearchIcon,
   ChevronDown,
   Hourglass,
   Trophy,
   LogOut,
   User,
   Rocket,
} from "lucide-react";
import "./index.css";
import { getText, getDirection } from './LanguageManager';
import { getCurrentUser, setCurrentUser } from './UserManager';
import { saveScore } from './ScoreManager';

// =========================================================
// 🎨 DYNAMIC ANIMATIONS & INTERACTIVE EFFECTS
// =========================================================

// Dynamic CSS for beautiful animations
const DynamicStyles = () => (
   <style>{`
      @keyframes float-up {
         0%, 100% { transform: translateY(0px) scale(1); filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.3)); }
         50% { transform: translateY(-30px) scale(1.03); filter: drop-shadow(0 0 35px rgba(139, 92, 246, 0.6)); }
      }

      @keyframes robot-glow {
         0%, 100% { filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.3)) brightness(1); }
         50% { filter: drop-shadow(0 0 50px rgba(139, 92, 246, 0.7)) brightness(1.15); }
      }

      @keyframes pulse-ring {
         0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.1); }
         50% { box-shadow: 0 0 0 40px rgba(59, 130, 246, 0), inset 0 0 40px rgba(139, 92, 246, 0.2); }
      }

      @keyframes button-shine {
         0% { left: -100%; }
         100% { left: 100%; }
      }

      @keyframes float-particle {
         0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
         100% { transform: translateY(-100px) translateX(var(--tx, 0)) scale(0); opacity: 0; }
      }

      @keyframes shimmer-text {
         0%, 100% { background-position: 0% center; }
         50% { background-position: 100% center; }
      }

      .robot-image-container {
         animation: float-up 5s ease-in-out infinite, robot-glow 4s ease-in-out infinite;
         filter: drop-shadow(0 0 40px rgba(59, 130, 246, 0.5));
         transition: filter 0.3s ease;
      }

      .robot-image-container:hover {
         filter: drop-shadow(0 0 60px rgba(139, 92, 246, 0.8));
      }

      .interactive-container {
         animation: pulse-ring 3s ease-in-out infinite;
         position: relative;
      }

      .btn-modern {
         position: relative;
         overflow: hidden;
         transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
         transform-origin: center;
      }

      .btn-modern::before {
         content: '';
         position: absolute;
         top: 0;
         left: -100%;
         width: 100%;
         height: 100%;
         background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
         animation: button-shine 0.7s ease-in-out;
         z-index: 1;
      }

      .btn-modern:hover {
         transform: translateY(-6px) scale(1.08);
         box-shadow: 0 15px 40px rgba(59, 130, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3);
      }

      .btn-modern:active {
         transform: translateY(-2px) scale(0.96);
      }

      .particle-burst {
         position: fixed;
         pointer-events: none;
         animation: float-particle 2s ease-out forwards;
         font-size: 24px;
         z-index: 9999;
         font-weight: bold;
         text-shadow: 0 0 10px rgba(59, 130, 246, 0.8);
      }

      .icon-btn:hover {
         transform: scale(1.15) rotate(5deg);
         transition: all 0.3s ease;
      }

      .info-panel-animated {
         animation: slideInDown 0.4s ease-out;
      }

      @keyframes slideInDown {
         from {
            opacity: 0;
            transform: translateY(-20px);
         }
         to {
            opacity: 1;
            transform: translateY(0);
         }
      }

      .floating-star {
         animation: float-up 6s ease-in-out infinite;
      }

      @keyframes gradient-shift {
         0% { background-position: 0% 50%; }
         50% { background-position: 100% 50%; }
         100% { background-position: 0% 50%; }
      }

      @keyframes text-blur {
         0%, 100% { filter: blur(0px); opacity: 1; }
         50% { filter: blur(0.5px); opacity: 0.95; }
      }

      @keyframes letter-reveal {
         0% { opacity: 0; transform: translateY(20px) rotateX(90deg); filter: blur(10px); }
         100% { opacity: 1; transform: translateY(0) rotateX(0deg); filter: blur(0px); }
      }

      @keyframes word-slide {
         0% { opacity: 0; transform: translateX(-50px); filter: blur(10px); }
         100% { opacity: 1; transform: translateX(0); filter: blur(0px); }
      }

      @keyframes glow-text {
         0%, 100% { text-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3); }
         50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.4); }
      }

      @keyframes scale-in {
         0% { transform: scale(0.8); opacity: 0; }
         100% { transform: scale(1); opacity: 1; }
      }

      .modern-title {
         background: linear-gradient(
            135deg,
            #3b82f6 0%,
            #8b5cf6 25%,
            #06b6d4 50%,
            #8b5cf6 75%,
            #3b82f6 100%
         );
         background-size: 300% 300%;
         background-clip: text;
         -webkit-background-clip: text;
         -webkit-text-fill-color: transparent;
         animation: gradient-shift 8s ease infinite, glow-text 3s ease-in-out infinite;
         font-weight: 800;
         letter-spacing: 0.5px;
         font-size: clamp(1.1rem, 3.5vw, 1.8rem);
         line-height: 1.4;
         filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.25));
      }

      .modern-title-line {
         display: block;
      }

      .modern-title-line:nth-child(1) { }
      .modern-title-line:nth-child(2) { }
      .modern-title-line:nth-child(3) { }

      .username-highlight {
         background: linear-gradient(120deg, #06b6d4, #3b82f6, #8b5cf6);
         background-size: 200% 200%;
         -webkit-background-clip: text;
         -webkit-text-fill-color: transparent;
         background-clip: text;
         animation: gradient-shift 4s ease infinite;
         font-weight: 900;
         position: relative;
      }

      .subtitle-modern {
         font-size: clamp(0.85rem, 2.5vw, 1rem);
         background: linear-gradient(120deg, #93c5fd, #a5f3fc, #c4b5fd);
         background-size: 200% 200%;
         -webkit-background-clip: text;
         -webkit-text-fill-color: transparent;
         background-clip: text;
         animation: gradient-shift 6s ease infinite, scale-in 1s ease-out;
         font-weight: 600;
         letter-spacing: 0.5px;
         opacity: 0.95;
         filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.2));
      }

      .divider-line {
         width: 60%;
         height: 1px;
         background: linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, transparent);
         margin: 0.5rem auto;
         animation: shimmer 3s ease-in-out infinite;
      }

      @keyframes shimmer {
         0%, 100% { opacity: 0.4; }
         50% { opacity: 1; }
      }

      .btn-gradient-blue {
         background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
         position: relative;
         overflow: hidden;
      }

      .btn-gradient-blue::after {
         content: '';
         position: absolute;
         top: 0;
         left: -100%;
         width: 100%;
         height: 100%;
         background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
         animation: button-shine 0.7s ease-in-out;
      }

      .btn-gradient-purple {
         background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
         position: relative;
         overflow: hidden;
      }

      .btn-gradient-purple::after {
         content: '';
         position: absolute;
         top: 0;
         left: -100%;
         width: 100%;
         height: 100%;
         background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
         animation: button-shine 0.7s ease-in-out;
      }

      .btn-gradient-green {
         background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
         position: relative;
         overflow: hidden;
      }

      .btn-gradient-green::after {
         content: '';
         position: absolute;
         top: 0;
         left: -100%;
         width: 100%;
         height: 100%;
         background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
         animation: button-shine 0.7s ease-in-out;
      }

      @keyframes neon-glow {
         0%, 100% { text-shadow: 0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3); }
         50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.6), 0 0 60px rgba(6, 182, 212, 0.4); }
      }

      @keyframes float-subtle {
         0%, 100% { transform: translateY(0px); }
         50% { transform: translateY(-10px); }
      }

      .title-section {
         animation: scale-in 1s ease-out;
      }

      .button-container {
         animation: scale-in 1s ease-out 0.3s both;
      }
   `}</style>
);

// Particle burst effect
const createParticleBurst = (x, y) => {
   for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle-burst';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.setProperty('--tx', (Math.random() - 0.5) * 150 + 'px');

      const emojis = ['✨', '⭐', '🚀', '💫', '🌟', '⚡'];
      particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 2000);
   }
};

// =========================================================
// MAIN APP COMPONENT
// =========================================================

export default function App() {
   /* ----------------------- state ----------------------- */
   const [fontScale, setFontScale] = useState(100);
   const [started, setStarted] = useState(false);
   const [questions, setQuestions] = useState([]);
   const [current, setCurrent] = useState(0);
   const [selected, setSelected] = useState(null);
   const [score, setScore] = useState(0);
   const [showResult, setShowResult] = useState(false);
   const [showInfo, setShowInfo] = useState(false);
   const [showLeaderboard, setShowLeaderboard] = useState(false);
   const [darkMode, setDarkMode] = useState(true); // Default is now dark mode
   const [highContrast, setHighContrast] = useState(false);
   const [largeText, setLargeText] = useState(false);
   const [a11yOpen, setA11yOpen] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [loadError, setLoadError] = useState(false);
   const [timeLeft, setTimeLeft] = useState(30);
   const [showTimeUp, setShowTimeUp] = useState(false);
   const [user, setUser] = useState(null);
   const [showAuthScreen, setShowAuthScreen] = useState(true);
   const timerRef = useRef(null);
   const correctSound = useRef(null);
   const wrongSound = useRef(null);
   const backgroundMusic = useRef(null);

   const yesterdayStr = new Date(Date.now() - 8.64e7).toLocaleDateString("en-GB");

   /* -------------------- theme classes ------------------ */
   useEffect(() => {
      // <html> –
      const html = document.documentElement;

      html.classList.toggle('dark', darkMode);
      html.classList.toggle('hc', highContrast);

      html.style.fontSize = fontScale + '%';
   }, [darkMode, highContrast, fontScale]);  

   /* -------------------- check for saved user ------------------ */
   useEffect(() => {
      // Check if user is already logged in (from localStorage)
      const savedUser = getCurrentUser();
      if (savedUser) {
         setUser(savedUser);
         setShowAuthScreen(false);
      }
   }, []);

   /* ------------------ fetch questions ------------------ */
   useEffect(() => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      console.log("Fetching questions.json...");

      fetch("./questions.json", { signal: controller.signal })
         .then((r) => {
            console.log("Fetch response status:", r.status);
            return r.ok ? r.json() : Promise.reject(r.status);
         })
         .then((data) => {
            console.log("Loaded data:", data);
            // Handle both array format and object format
            let questionsArray = data;

            // If data is an object with Questions or questions property, use that
            if (!Array.isArray(data) && typeof data === 'object') {
               questionsArray = data.Questions || data.questions || [];
            }

            console.log("Setting questions state to:", questionsArray);
            setQuestions(questionsArray);
         })
         .catch((error) => {
            console.error("Error loading questions:", error);
            setQuestions([
               {
                  QuestionText: "Which country won the most recent FIFA World Cup?",
                  Answers: ["Brazil", "France", "Argentina", "Germany"],
                  CorrectAnswerIndex: 2,
               },
            ]);
            setLoadError(true);
         })
         .finally(() => {
            clearTimeout(timeoutId);
            setIsLoading(false);
         });

      return () => clearTimeout(timeoutId);
   }, []);

   /* ----------------- per‑question timer ---------------- */
   useEffect(() => {
      if (!started || isLoading || showResult) return;

      setTimeLeft(30);
      timerRef.current && clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
         setTimeLeft((t) => {
            if (t === 1) {
               clearInterval(timerRef.current);
               handleTimeUp();
               return 0;
            }
            return t - 1;
         });
      }, 1_000);

      return () => clearInterval(timerRef.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [current, started]);

   useEffect(() => {
      if (!started && backgroundMusic.current) {
         backgroundMusic.current.volume = 0.1;
         backgroundMusic.current.play().catch(() => { });
      } else if (started && backgroundMusic.current) {
         backgroundMusic.current.pause();
      }
   }, [started]);

   const handleTimeUp = () => {
      setShowTimeUp(true);
      setSelected(-1);
      setTimeout(() => {
         setSelected(questions[current].CorrectAnswerIndex);
      }, 500);
      setTimeout(() => {
         nextStep();
         setShowTimeUp(false);
      }, 4_000);
   };

   /* -------------------- helpers ----------------------- */
   const nextStep = () => {
      if (current + 1 < questions.length) {
         setCurrent((c) => c + 1);
         setSelected(null);
      } else {
         setShowResult(true);
         // Save score if user is logged in and not a guest
         if (user && !user.isGuest) {
            saveScore(user.username, score, questions.length);
         }
      }
   };

   const handleAnswer = (idx) => {
      if (selected !== null) return;
      setSelected(idx);
      const isCorrect = idx === questions[current].CorrectAnswerIndex;
      if (isCorrect && correctSound.current) correctSound.current.play();
      if (!isCorrect && wrongSound.current) wrongSound.current.play();
      if (isCorrect) setScore((s) => s + 1);
      clearInterval(timerRef.current);
      setTimeout(nextStep, 1_000);
   };

   const resetQuiz = () => {
      setStarted(false);
      setShowResult(false);
      setScore(0);
      setCurrent(0);
      setSelected(null);
      setShowTimeUp(false);
      setA11yOpen(false);
      setShowLeaderboard(false);
      setShowInfo(false);
   };

   const handleLogin = (userData) => {
      setUser(userData);
      setShowAuthScreen(false);
   };

   const handleLogout = () => {
      setCurrentUser(null);
      setUser(null);
      setShowAuthScreen(true);
      resetQuiz();
   };

   /* -------------------- UI ----------------------------- */
   return (
      <div className="min-h-screen bg-gray-900 flex flex-col text-gray-100 relative overflow-hidden">
         <DynamicStyles />
         {/* Space background with stars */}
         <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="stars"></div>
            <div className="stars2"></div>
            <div className="stars3"></div>
         </div>

         {/* skip link */}
         <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-gray-800 text-blue-400 px-4 py-1 rounded">
            Skip to main content
         </a>
         <audio ref={correctSound} src="/sounds/right.mp3" />
         <audio ref={wrongSound} src="/sounds/wrong.mp3" />
         <audio ref={backgroundMusic} src="/sounds/music.mp3" loop />

         {/* top‑bar icons - only show when logged in */}
         {!showAuthScreen && (
            <div className="relative flex justify-between items-center p-4 text-inherit">
               {/* User info and logout */}
               <div className="flex items-center">
                  <div className="flex items-center bg-gray-800/70 backdrop-blur-sm px-3 py-1 rounded-lg mr-2">
                     <User className="w-4 h-4 mr-2" />
                     <span className="text-sm">{user?.username || "Guest"}</span>
                  </div>
                  <button
                     title="Logout"
                     onClick={(e) => {
                        handleLogout();
                        createParticleBurst(e.clientX, e.clientY);
                     }}
                     className="icon-btn text-red-400 btn-modern hover:text-red-300"
                  >
                     <LogOut className="w-4 h-4" />
                  </button>
               </div>

               <div className="relative flex gap-4 items-center self-end p-4 text-inherit">
                  {/* Home */}
                  <button
                     title="Return to main menu"
                     onClick={(e) => {
                        resetQuiz();
                        createParticleBurst(e.clientX, e.clientY);
                     }}
                     className="icon-btn btn-modern">
                     <Home className="icon" />
                  </button>

                  {/* Accessibility */}
                  <div className="relative">
                     <button
                        title="Accessibility options"
                        onClick={(e) => {
                           setA11yOpen((v) => !v);
                           createParticleBurst(e.clientX, e.clientY);
                        }}
                        className="icon-btn btn-modern"
                        aria-haspopup="true"
                        aria-expanded={a11yOpen}
                     >
                        <Accessibility className="icon" />
                     </button>
                     {a11yOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 p-2 text-sm">
                           <label className="flex items-center justify-between py-1">
                              Large text
                              <input
                                 type="checkbox"
                                 checked={largeText}
                                 onChange={() => setLargeText((v) => !v)}
                              />
                           </label>
                           {/* Font size slider */}
                           <label className="flex flex-col gap-1 py-1 text-sm">
                              <span className="font-medium">Text size: {fontScale}%</span>
                              <input
                                 type="range"
                                 min="100"
                                 max="1000"
                                 step="25"
                                 value={fontScale}
                                 onChange={(e) => setFontScale(Number(e.target.value))}
                                 className="w-40 accent-blue-600"
                              />
                           </label>
                        </div>
                     )}
                  </div>

                  {/* We removed the fixed Leaderboard component - it's now a button in the main menu */}

                  {/* Dark‑mode */}
                  <button
                     title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                     onClick={(e) => {
                        setDarkMode((v) => !v);
                        createParticleBurst(e.clientX, e.clientY);
                     }}
                     className="icon-btn btn-modern"
                  >
                     {darkMode ? <SunMedium className="icon" /> : <MoonStar className="icon" />}
                  </button>
               </div>
            </div>
         )}

         {/* main content */}
         <main id="main" className="flex-1 flex flex-col items-center px-4 pb-12 leading-relaxed">
            {/* Show both Auth and Home screen inside the same container */}
            {!started ? (
               <HomeContainer
                  showAuthScreen={showAuthScreen}
                  user={user}
                  onLogin={handleLogin}
                  showInfo={showInfo}
                  setShowInfo={setShowInfo}
                  showLeaderboard={showLeaderboard}
                  setShowLeaderboard={setShowLeaderboard}
                  setStarted={setStarted}
                  yesterdayStr={yesterdayStr}
               />
            ) : isLoading ? (
               <Loader />
            ) : showResult ? (
               <Result score={score} total={questions.length} resetQuiz={resetQuiz} user={user} />
            ) : (
               <QuestionCard q={questions[current]} current={current} total={questions.length} selected={selected} handleAnswer={handleAnswer} timeLeft={timeLeft} showTimeUp={showTimeUp} />
            )}
         </main>

         {/* Leaderboard modal - only show when triggered from the button */}
         {showLeaderboard && !showAuthScreen && !started && (
            <div
               className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
               onClick={() => setShowLeaderboard(false)} 
            >
               <div
                  className="bg-gray-800 rounded-lg max-w-lg w-full"
                  onClick={(e) => e.stopPropagation()}      
               >
                  <Leaderboard
                     currentUser={user}
                     onClose={() => setShowLeaderboard(false)}
                  />
               </div>
            </div>
         )}


         <footer className="text-center text-xs text-gray-400 py-6">
            © All rights reserved to Benny Giorno
         </footer>
      </div>
   );
}

/* =========================================================
 * Components
 * =======================================================*/

// New container that holds both AuthScreen and HomeScreen with the same background
function HomeContainer({ showAuthScreen, user, onLogin, showInfo, setShowInfo, showLeaderboard, setShowLeaderboard, setStarted, yesterdayStr }) {
   return (
      <div className="relative w-full max-w-4xl
              rounded-3xl overflow-hidden shadow-lg
              bg-gray-800/30 backdrop-blur-sm
              mx-auto mt-12 interactive-container
              min-h-[480px] py-8">

         {/* Robot image background with animations */}
         <img
            src="/images/news-bg3.png"
            alt="AI robot reading newspaper"
            className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none robot-image-container"
            onMouseMove={(e) => {
               if (Math.random() > 0.8) {
                  createParticleBurst(e.clientX, e.clientY);
               }
            }}
         />

         {/* Content container */}
         <div className="relative z-10 h-full flex flex-col items-center justify-center">
            {/* Show either auth screen or home content based on showAuthScreen state */}
            {showAuthScreen ? (
               <div className="w-full max-w-md mx-auto p-4 flex justify-end">
                  <div className="w-full">
                     <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Daily News Quiz
                     </h1>
                     <AuthScreen onLogin={onLogin} onGuestPlay={onLogin} />
                  </div>
               </div>
            ) : (
               <HomeScreen
                  user={user}
                  showInfo={showInfo}
                  setShowInfo={setShowInfo}
                  showLeaderboard={showLeaderboard}
                  setShowLeaderboard={setShowLeaderboard}
                  setStarted={setStarted}
                  yesterdayStr={yesterdayStr}
               />
            )}
         </div>
      </div>
   );
}

function HomeScreen({ user, showInfo, setShowInfo, showLeaderboard, setShowLeaderboard, setStarted, yesterdayStr }) {
   return (
      <div
         className="relative z-10 h-full flex flex-col
                    justify-end items-end
                    text-center px-6 pb-10 gap-6
                    w-full"
      >
         {/* כותרת גדולה – כל הבלוק זז ימינה כי ה־items-end על ה-container */}
         <div className="max-w-2xl text-center space-y-2 title-section">
            <h1 className="modern-title">
               <span className="modern-title-line">
                  Welcome{" "}
                  <span className="username-highlight">
                     {user?.username}
                  </span>
               </span>
               <span className="modern-title-line">
                  To The Quiz
               </span>
               <span className="modern-title-line">
                  About Yesterday&apos;s Events
               </span>
            </h1>

            <div className="divider-line" />

            <p className="text-sm sm:text-base text-blue-100 animate-pulse">
               Click{" "}
               <strong className="text-blue-300 font-bold">
                  'START'
               </strong>{" "}
               to begin! ⚡
            </p>
         </div>

         {/* Score History – גם הוא מיושר ימינה אבל הטקסט באמצע */}
         {user && !user.isGuest && (
            <div className="w-full max-w-md text-sm bg-gradient-to-br from-gray-800/60 to-gray-900/40 backdrop-blur-md p-4 rounded-xl mb-4 info-panel-animated hover:from-gray-800/80 hover:to-gray-900/60 transition-all border border-blue-500/20 shadow-lg ml-auto">
               <h3 className="font-bold mb-3 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent uppercase tracking-wider text-sm">
                  📊 Recent Scores
               </h3>
               <ScoreHistory username={user.username} />
            </div>
         )}

         {/* כפתורים – מיושרים יותר לימין */}
         <div className="flex gap-4 w-full justify-end button-container">
            <button
               onClick={(e) => {
                  setShowInfo(v => !v);
                  createParticleBurst(e.clientX, e.clientY);
               }}
               className="flex items-center gap-2 btn-gradient-blue text-white px-6 py-3
                       rounded-xl shadow-lg hover:shadow-2xl transition-all btn-modern uppercase font-semibold tracking-wide text-sm"
               aria-expanded={showInfo}
               aria-controls="info-panel">
               <SearchIcon className="w-5 h-5" />
               Info
               <ChevronDown className={`w-5 h-5 transition-transform duration-300
                                     ${showInfo ? 'rotate-180' : ''}`} />
            </button>

            <button
               onClick={(e) => {
                  setShowLeaderboard(true);
                  createParticleBurst(e.clientX, e.clientY);
               }}
               className="flex items-center gap-2 btn-gradient-purple text-white px-6 py-3
                       rounded-xl shadow-lg hover:shadow-2xl transition-all btn-modern uppercase font-semibold tracking-wide text-sm">
               <Trophy className="w-5 h-5" />
               Leaderboard
            </button>

            <button
               onClick={(e) => {
                  setStarted(true);
                  createParticleBurst(e.clientX, e.clientY);
               }}
               className="flex items-center gap-2 btn-gradient-green text-white px-8 py-3
                       rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all btn-modern uppercase tracking-wider text-sm">
               <Rocket className="w-5 h-5" />
               Start Quiz
            </button>
         </div>

         {/* לוח מידע נשלף – גם מיושר לימין */}
         <div id="info-panel"
            className={`overflow-hidden transition-all duration-300 w-full max-w-md info-panel-animated ml-auto
                         ${showInfo ? 'max-h-48' : 'max-h-0'}`}>
            <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-md border border-blue-500/30 p-5 rounded-xl text-sm text-blue-100 space-y-3 shadow-lg">
               <p className="leading-relaxed">
                  ✨ <strong>AI-Powered Daily Quiz</strong> - Automatically generated at 00:00 Israel Time
               </p>
               <p className="leading-relaxed">
                  📰 Questions are fresh daily, testing your knowledge of <strong>yesterday&apos;s news events</strong>
               </p>
               <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider">
                  💡 Tip: Stay informed to ace the quiz!
               </p>
            </div>
         </div>

         <p className="text-sm sm:text-base text-blue-100">
            Questions about <strong>{yesterdayStr}</strong> events.
         </p>
      </div>
   );
}

// Component to display user's score history
function ScoreHistory({ username }) {
   // Get user scores from localStorage
   const scores = JSON.parse(localStorage.getItem(`scores_${username}`) || '[]');

   // Get the most recent 3 scores
   const recentScores = scores.slice(-3).reverse();

   if (recentScores.length === 0) {
      return <p className="text-blue-200">No previous scores yet.</p>;
   }

   return (
      <div className="grid grid-cols-3 gap-2 text-xs">
         {recentScores.map((score, index) => (
            <div key={index} className="text-center">
               <div className="font-medium text-blue-200">{new Date(score.date).toLocaleDateString()}</div>
               <div className={`font-bold ${score.percentage >= 70 ? 'text-green-400' : score.percentage >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {score.percentage}%
               </div>
               <div className="text-blue-200">{score.score}/{score.total}</div>
            </div>
         ))}
      </div>
   );
}

function Loader() {
   return (
      <div className="flex flex-col items-center justify-center flex-1 w-full" role="status" aria-live="polite">
         <div className="text-lg mb-4 text-blue-300">Loading questions…</div>
         <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
   );
}

function Result({ score, total, resetQuiz, user }) {
   const percentage = Math.round((score / total) * 100);
   let message = "Try again for a better score!";

   if (percentage >= 80) {
      message = "Excellent! You're well-informed about current events!";
   } else if (percentage >= 60) {
      message = "Good job! You know your news!";
   } else if (percentage >= 40) {
      message = "Not bad! Keep up with the news for a better score next time.";
   }

   return (
      <div className="flex flex-col items-center justify-center flex-1 w-full text-center">
         <h2 className="text-3xl font-bold mb-2 text-blue-300">Quiz Completed!</h2>

         <div className="relative w-40 h-40 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="text-4xl font-bold text-blue-200">{percentage}%</div>
            </div>
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
               <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#374151"
                  strokeWidth="8"
               />
               <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke={percentage >= 70 ? "#10b981" : percentage >= 40 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="8"
                  strokeDasharray={`${percentage * 2.83} 283`}
               />
            </svg>
         </div>

         <p className="text-xl mb-2 text-blue-200">Your score: {score} / {total}</p>
         <p className="mb-6 text-blue-300">{message}</p>

         {user && !user.isGuest && (
            <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg mb-6">
               <h3 className="font-semibold mb-2 text-blue-300">Your Score History</h3>
               <ScoreHistory username={user.username} />
            </div>
         )}

         <button
            onClick={resetQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition"
         >
            Return to Main Menu
         </button>
      </div>
   );
}

function QuestionCard({ q, current, total, selected, handleAnswer, timeLeft, showTimeUp }) {
   return (
      <div className="w-full max-w-xl bg-gray-800/60 backdrop-blur-sm p-6 rounded-lg">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-center flex-1 text-blue-200">
               {q.QuestionText}
            </h2>
            <div className="flex items-center gap-2 text-blue-300" aria-live="polite">
               <Hourglass
                  className="w-6 h-6 animate-pulse text-blue-400"
                  aria-hidden="true"
               />
               <span>{timeLeft}s</span>
            </div>
         </div>

         {showTimeUp && (
            <div className="bg-red-500/90 text-white px-4 py-2 rounded mb-3 text-center animate-bounce">
               Time is up!
            </div>
         )}

         <ul className="space-y-3" role="list">
            {q.Answers.map((ans, i) => {
               const correct = i === q.CorrectAnswerIndex;
               const isSel = selected !== null && i === selected;
               const selectable = selected === null;

               let cls = "bg-gray-700/70 border border-transparent hover:bg-gray-600 text-blue-100";
               if (selected !== null) {
                  if (isSel && correct) cls = "bg-green-800 border-green-500 text-white";
                  else if (isSel && !correct) cls = "bg-red-800 border-red-500 text-white";
                  else if (correct) cls = "bg-green-900 border-green-600 text-white";
               }

               return (
                  <li key={i}>
                     <button
                        onClick={() => selectable && handleAnswer(i)}
                        disabled={!selectable}
                        className={`w-full text-left px-4 py-3 rounded-lg transition ${cls}`}
                     >
                        {ans}
                     </button>
                  </li>
               );
            })}
         </ul>

         <div className="mt-6 text-sm text-right text-blue-300">
            {current + 1} / {total}
         </div>
      </div>
   );
}