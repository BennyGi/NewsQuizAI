// UserManager.js - Handles user management functions

/**
 * Get all registered users
 * @returns {Array} Array of user objects
 */
export const getAllUsers = () => {
   const usersData = localStorage.getItem("quizUsers");
   if (!usersData) {
      // Initialize users array if it doesn't exist
      localStorage.setItem("quizUsers", JSON.stringify([]));
      return [];
   }

   try {
      return JSON.parse(usersData);
   } catch (err) {
      console.error("Error parsing users data", err);
      return [];
   }
};

/**
 * Check if a username already exists
 * @param {string} username - The username to check
 * @returns {boolean} True if username exists, false otherwise
 */
export const usernameExists = (username) => {
   const users = getAllUsers();
   return users.some(user => user.username.toLowerCase() === username.toLowerCase());
};

/**
 * Create a new user
 * @param {object} userData - User data object
 * @returns {object} Created user object
 */
export const createUser = (userData) => {
   if (!userData.username) {
      throw new Error("Username is required");
   }

   if (usernameExists(userData.username)) {
      throw new Error("Username already exists");
   }

   const users = getAllUsers();

   const newUser = {
      username: userData.username,
      password: userData.password, // In a real app, hash this password
      language: userData.language || "english",
      created: new Date().toISOString(),
      highestScore: 0,
      highestScoreDate: null
   };

   users.push(newUser);
   localStorage.setItem("quizUsers", JSON.stringify(users));

   // Return a safe version without the password
   const { password, ...safeUser } = newUser;
   return safeUser;
};

/**
 * Authenticate a user
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {object|null} User object if authenticated, null otherwise
 */
export const authenticateUser = (username, password) => {
   const users = getAllUsers();
   const user = users.find(u => u.username === username);

   if (!user) {
      return null;
   }

   if (user.password !== password) { // In a real app, use proper password comparison
      return null;
   }

   // Return a safe version without the password
   const { password: pwd, ...safeUser } = user;
   return safeUser;
};

/**
 * Get currently logged in user
 * @returns {object|null} Current user object or null if not logged in
 */
export const getCurrentUser = () => {
   const userData = localStorage.getItem("quizUser");
   if (!userData) {
      return null;
   }

   try {
      return JSON.parse(userData);
   } catch (err) {
      console.error("Error parsing user data", err);
      return null;
   }
};

/**
 * Set current user session
 * @param {object} user - User object
 */
export const setCurrentUser = (user) => {
   if (!user) {
      localStorage.removeItem("quizUser");
      return;
   }

   localStorage.setItem("quizUser", JSON.stringify(user));
};

/**
 * Create a guest user
 * @param {string} language - Preferred language
 * @returns {object} Guest user object
 */
export const createGuestUser = (language = "english") => {
   const guestUser = {
      username: `Guest_${Math.floor(Math.random() * 10000)}`,
      language: language,
      isGuest: true
   };

   setCurrentUser(guestUser);
   return guestUser;
};

/**
 * Update user's language preference
 * @param {string} username - The username
 * @param {string} language - The language
 * @returns {boolean} True if updated successfully
 */
export const updateUserLanguage = (username, language) => {
   if (!username || !language) return false;

   const users = getAllUsers();
   const userIndex = users.findIndex(u => u.username === username);

   if (userIndex === -1) return false;

   users[userIndex].language = language;
   localStorage.setItem("quizUsers", JSON.stringify(users));

   // Also update current user if this is the logged in user
   const currentUser = getCurrentUser();
   if (currentUser && currentUser.username === username) {
      currentUser.language = language;
      setCurrentUser(currentUser);
   }

   return true;
};

export default {
   getAllUsers,
   usernameExists,
   createUser,
   authenticateUser,
   getCurrentUser,
   setCurrentUser,
   createGuestUser,
   updateUserLanguage
};