import React, { useState, useEffect } from "react";
import { Trophy, Award, Medal, X, ChevronUp, ChevronDown } from "lucide-react";

function Leaderboard({ currentUser }) {
   const [isOpen, setIsOpen] = useState(false);
   const [topUsers, setTopUsers] = useState([]);
   const [userStats, setUserStats] = useState({
      allTimeHigh: 0,
      todayHigh: 0,
      yesterdayHigh: 0,
      rank: null
   });

   useEffect(() => {
      if (isOpen) {
         loadLeaderboardData();
      }
   }, [isOpen, currentUser]);

   const loadLeaderboardData = () => {
      // In a real application, this would be an API call
      // For this example, we'll load data from localStorage

      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Get all users
      const usersData = localStorage.getItem("quizUsers");
      let allUsers = [];

      if (usersData) {
         try {
            allUsers = JSON.parse(usersData);
         } catch (err) {
            console.error("Error parsing users data", err);
         }
      }

      // Get all scores
      const allScores = [];
      const currentUserScores = [];

      allUsers.forEach(user => {
         const userScoresKey = `scores_${user.username}`;
         const userScoresData = localStorage.getItem(userScoresKey);

         if (userScoresData) {
            try {
               const scores = JSON.parse(userScoresData);

               // Add all scores to the combined list with username
               scores.forEach(score => {
                  allScores.push({
                     ...score,
                     username: user.username
                  });

                  // Also keep track of current user's scores separately
                  if (user.username === currentUser?.username) {
                     currentUserScores.push(score);
                  }
               });
            } catch (err) {
               console.error(`Error parsing scores for ${user.username}`, err);
            }
         }
      });

      // Get the top users (by highest score)
      const topUsersData = [...allScores]
         .sort((a, b) => b.percentage - a.percentage || b.score - a.score)
         .slice(0, 10);

      // Get unique users for the top 3
      const uniqueUsers = Array.from(new Set(topUsersData.map(s => s.username)))
         .map(username => {
            const bestScore = topUsersData.find(s => s.username === username);
            return { username, ...bestScore };
         })
         .slice(0, 3);

      setTopUsers(uniqueUsers);

      // Calculate user stats
      if (currentUser && !currentUser.isGuest) {
         // All-time high
         const allTimeHigh = currentUserScores.length > 0
            ? Math.max(...currentUserScores.map(s => s.percentage))
            : 0;

         // Today's high
         const todayScores = currentUserScores.filter(s =>
            s.date.startsWith(today)
         );
         const todayHigh = todayScores.length > 0
            ? Math.max(...todayScores.map(s => s.percentage))
            : 0;

         // Yesterday's high
         const yesterdayScores = currentUserScores.filter(s =>
            s.date.startsWith(yesterday)
         );
         const yesterdayHigh = yesterdayScores.length > 0
            ? Math.max(...yesterdayScores.map(s => s.percentage))
            : 0;

         // User's rank
         let rank = null;
         const uniqueUsernames = Array.from(new Set(allScores.map(s => s.username)));
         const usersByScore = uniqueUsernames
            .map(username => {
               const scores = allScores.filter(s => s.username === username);
               const highestScore = Math.max(...scores.map(s => s.percentage));
               return { username, highestScore };
            })
            .sort((a, b) => b.highestScore - a.highestScore);

         const userIndex = usersByScore.findIndex(u => u.username === currentUser.username);
         if (userIndex !== -1) {
            rank = userIndex + 1;
         }

         setUserStats({
            allTimeHigh,
            todayHigh,
            yesterdayHigh,
            rank
         });
      }
   };

   const toggleLeaderboard = () => {
      setIsOpen(!isOpen);
   };

   const getMedalColor = (index) => {
      switch (index) {
         case 0: return "text-yellow-500"; // Gold
         case 1: return "text-gray-400";   // Silver
         case 2: return "text-amber-700";  // Bronze
         default: return "text-gray-500";
      }
   };

   // If user is a guest, show limited info
   if (currentUser?.isGuest) {
      return (
         <div className="fixed bottom-4 right-4 z-10">
            <button
               onClick={toggleLeaderboard}
               className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
               title="Leaderboard"
            >
               <Trophy className="w-6 h-6" />
            </button>

            {isOpen && (
               <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-72">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-lg">Leaderboard</h3>
                     <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                     </button>
                  </div>

                  <div className="text-center py-4">
                     <p className="mb-2">Sign up or log in to see the leaderboard and track your scores!</p>
                     <p className="text-sm text-gray-500 dark:text-gray-400">
                        Guests can't appear on the leaderboard or save their scores.
                     </p>
                  </div>
               </div>
            )}
         </div>
      );
   }

   return (
      <div className="fixed bottom-4 right-4 z-10">
         <button
            onClick={toggleLeaderboard}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg"
            title="Leaderboard"
         >
            <Trophy className="w-6 h-6" />
         </button>

         {isOpen && (
            <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-80">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Leaderboard</h3>
                  <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                     <X className="w-5 h-5" />
                  </button>
               </div>

               {/* Top Users */}
               <div className="mb-6">
                  <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">Top Players</h4>

                  {topUsers.length === 0 ? (
                     <p className="text-center text-sm py-2">No scores yet. Be the first!</p>
                  ) : (
                     <div className="space-y-2">
                        {topUsers.map((user, index) => (
                           <div
                              key={index}
                              className={`flex items-center justify-between p-2 rounded ${user.username === currentUser?.username ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                           >
                              <div className="flex items-center">
                                 {index === 0 && <Award className={`w-5 h-5 mr-2 ${getMedalColor(index)}`} />}
                                 {index === 1 && <Award className={`w-5 h-5 mr-2 ${getMedalColor(index)}`} />}
                                 {index === 2 && <Medal className={`w-5 h-5 mr-2 ${getMedalColor(index)}`} />}
                                 <span className={`${user.username === currentUser?.username ? 'font-bold' : ''}`}>
                                    {user.username}
                                 </span>
                              </div>
                              <div className="font-bold">{user.percentage}%</div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {/* User Stats */}
               <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">Your Stats</h4>

                  <div className="grid grid-cols-2 gap-2">
                     <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <div className="text-xs text-gray-500 dark:text-gray-400">All-time High</div>
                        <div className="font-bold">{userStats.allTimeHigh}%</div>
                     </div>

                     <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Today's High</div>
                        <div className="font-bold">{userStats.todayHigh}%</div>
                     </div>

                     <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Yesterday's High</div>
                        <div className="font-bold">{userStats.yesterdayHigh}%</div>
                     </div>

                     <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Your Rank</div>
                        <div className="font-bold">
                           {userStats.rank ? `#${userStats.rank}` : 'N/A'}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}

export default Leaderboard;