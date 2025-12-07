// LanguageManager.js - English only

// Translation keys (English only)
const translations = {
   // Auth
   login: "Login",
   signup: "Sign Up",
   username: "Username",
   password: "Password",
   confirmPassword: "Confirm Password",
   guest: "Guest",
   usernameRequired: "Username is required",
   passwordRequired: "Password is required",
   passwordsNotMatch: "Passwords don't match",
   passwordLength: "Password must be at least 6 characters",
   usernameExists: "Username already exists. Please choose another one.",

   // Quiz
   welcome: "Welcome",
   toTheQuiz: "To The Quiz About",
   yesterdayEvents: "Yesterday's Events",
   pressStart: "Press 'Start' to start the quiz!",
   start: "Start",
   questionsAbout: "Questions about",
   events: "events",
   loading: "Loading questions...",
   timeIsUp: "Time is up!",

   // Results
   quizCompleted: "Quiz Completed!",
   yourScore: "Your score",
   excellent: "Excellent! You're well-informed about current events!",
   goodJob: "Good job! You know your news!",
   notBad: "Not bad! Keep up with the news for a better score next time.",
   tryAgain: "Try again for a better score!",
   scoreHistory: "Your Score History",
   returnToMenu: "Return to Main Menu",

   // Leaderboard
   leaderboard: "Leaderboard",
   topPlayers: "Top Players",
   noScoresYet: "No scores yet. Be the first!",
   yourStats: "Your Stats",
   allTimeHigh: "All-time High",
   todayHigh: "Today's High",
   yesterdayHigh: "Yesterday's High",
   yourRank: "Your Rank",
   signUpToSee:
      "Sign up or log in to see the leaderboard and track your scores!",
   guestsNotOnLeaderboard:
      "Guests can't appear on the leaderboard or save their scores.",

   // General
   info: "Info",
   logout: "Logout",
};

/**
 * Get a translated string
 * @param {string} key - The translation key
 * @param {string} language - (ignored, kept for backwards compatibility)
 * @returns {string} The translated string
 */
export const getText = (key, language = "english") => {
   if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
   }

   return translations[key];
};

/**
 * Get the direction for a language
 * @param {string} language
 * @returns {string} The text direction (always ltr now)
 */
export const getDirection = (language = "english") => {
   return "ltr";
};

/**
 * Get all available languages
 * @returns {Array} Array of language objects
 */
export const getAvailableLanguages = () => {
   return [{ code: "english", name: "English" }];
};

export default {
   getText,
   getDirection,
   getAvailableLanguages,
};
