// ScoreManager.js - Utility for managing user scores

/**
 * Save a new score for a user
 * @param {string} username - The username
 * @param {number} score - The raw score
 * @param {number} total - The total possible score
 * @param {boolean} updateHighScore - Whether to update user's all-time high score
 * @returns {object} The saved score object
 */
export const saveScore = (username, score, total) => {
   if (!username) return null;

   const percentage = Math.round((score / total) * 100);
   const timestamp = new Date().toISOString();

   // Create the score object
   const scoreObj = {
      date: timestamp,
      score: score,
      total: total,
      percentage: percentage
   };

   // Save to user's score history
   const scoresKey = `scores_${username}`;
   const savedScores = JSON.parse(localStorage.getItem(scoresKey) || '[]');
   savedScores.push(scoreObj);
   localStorage.setItem(scoresKey, JSON.stringify(savedScores));

   // Update user's high score if needed
   updateUserHighScore(username, percentage, timestamp);

   return scoreObj;
};

/**
 * Update a user's all-time high score if the new score is higher
 * @param {string} username - The username
 * @param {number} percentage - The score percentage
 * @param {string} timestamp - The ISO timestamp
 */
const updateUserHighScore = (username, percentage, timestamp) => {
   // Get all users
   const usersData = localStorage.getItem("quizUsers");
   if (!usersData) return;

   try {
      const users = JSON.parse(usersData);
      const userIndex = users.findIndex(u => u.username === username);

      if (userIndex === -1) return;

      const user = users[userIndex];

      // Update high score if better than previous
      if (!user.highestScore || percentage > user.highestScore) {
         user.highestScore = percentage;
         user.highestScoreDate = timestamp;

         users[userIndex] = user;
         localStorage.setItem("quizUsers", JSON.stringify(users));
      }
   } catch (err) {
      console.error("Error updating high score", err);
   }
};

/**
 * Get scores for a specific date
 * @param {string} date - The date in YYYY-MM-DD format
 * @returns {Array} Array of score objects with usernames
 */
export const getScoresByDate = (date) => {
   // Get all users
   const usersData = localStorage.getItem("quizUsers");
   if (!usersData) return [];

   try {
      const users = JSON.parse(usersData);
      const allScores = [];

      users.forEach(user => {
         const scoresKey = `scores_${user.username}`;
         const userScoresData = localStorage.getItem(scoresKey);

         if (userScoresData) {
            const scores = JSON.parse(userScoresData);

            // Filter scores by date and add username
            const dateScores = scores
               .filter(score => score.date.startsWith(date))
               .map(score => ({
                  ...score,
                  username: user.username
               }));

            allScores.push(...dateScores);
         }
      });

      return allScores;
   } catch (err) {
      console.error("Error getting scores by date", err);
      return [];
   }
};

/**
 * Get top scores of all time
 * @param {number} limit - Maximum number of scores to return
 * @returns {Array} Array of top score objects with usernames
 */
export const getTopScores = (limit = 10) => {
   // Get all users
   const usersData = localStorage.getItem("quizUsers");
   if (!usersData) return [];

   try {
      const users = JSON.parse(usersData);
      const allScores = [];

      users.forEach(user => {
         const scoresKey = `scores_${user.username}`;
         const userScoresData = localStorage.getItem(scoresKey);

         if (userScoresData) {
            const scores = JSON.parse(userScoresData);

            // Add username to all scores
            const userScores = scores.map(score => ({
               ...score,
               username: user.username
            }));

            allScores.push(...userScores);
         }
      });

      // Sort by percentage (highest first)
      return allScores
         .sort((a, b) => b.percentage - a.percentage)
         .slice(0, limit);
   } catch (err) {
      console.error("Error getting top scores", err);
      return [];
   }
};

/**
 * Get a user's statistics
 * @param {string} username - The username
 * @returns {object} User statistics
 */
export const getUserStats = (username) => {
   if (!username) return null;

   const today = new Date().toISOString().split('T')[0];
   const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

   const scoresKey = `scores_${username}`;
   const userScoresData = localStorage.getItem(scoresKey);

   if (!userScoresData) {
      return {
         gamesPlayed: 0,
         averageScore: 0,
         highestScore: 0,
         todayHighest: 0,
         yesterdayHighest: 0
      };
   }

   try {
      const scores = JSON.parse(userScoresData);

      const todayScores = scores.filter(s => s.date.startsWith(today));
      const yesterdayScores = scores.filter(s => s.date.startsWith(yesterday));

      const stats = {
         gamesPlayed: scores.length,
         averageScore: scores.length > 0
            ? Math.round(scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length)
            : 0,
         highestScore: scores.length > 0
            ? Math.max(...scores.map(s => s.percentage))
            : 0,
         todayHighest: todayScores.length > 0
            ? Math.max(...todayScores.map(s => s.percentage))
            : 0,
         yesterdayHighest: yesterdayScores.length > 0
            ? Math.max(...yesterdayScores.map(s => s.percentage))
            : 0
      };

      return stats;
   } catch (err) {
      console.error("Error getting user stats", err);
      return null;
   }
};