import React, { useState, useEffect } from "react";
import { UserCircle, User, Key, LogIn, UserPlus } from "lucide-react";

function AuthScreen({ onLogin, onGuestPlay }) {
   const [activeTab, setActiveTab] = useState("login"); // "login" or "signup"
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [allUsers, setAllUsers] = useState([]);

   // localStorage
   useEffect(() => {
      const usersData = localStorage.getItem("quizUsers");
      if (usersData) {
         try {
            setAllUsers(JSON.parse(usersData));
         } catch (err) {
            localStorage.setItem("quizUsers", JSON.stringify([]));
            setAllUsers([]);
         }
      } else {
         localStorage.setItem("quizUsers", JSON.stringify([]));
         setAllUsers([]);
      }
   }, []);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      if (!username || !password) {
         setError("Username and password are required");
         return;
      }

      // ----- LOGIN -----
      if (activeTab === "login") {
         const foundUser = allUsers.find((u) => u.username === username);

         if (!foundUser) {
            setError("Username not found");
            return;
         }

         if (foundUser.password !== password) {
            setError("Incorrect password");
            return;
         }

         setIsLoading(true);
         try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            const userData = {
               username: foundUser.username,
               language: foundUser.language || "english",
               isGuest: false,
            };

            localStorage.setItem("quizUser", JSON.stringify(userData));
            onLogin(userData);
         } catch (err) {
            setError("Authentication failed. Please try again.");
         } finally {
            setIsLoading(false);
         }
      }
      // ----- SIGNUP -----
      else {
         if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
         }

         if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
         }

         if (allUsers.some((u) => u.username === username)) {
            setError("Username already exists. Please choose another one.");
            return;
         }

         setIsLoading(true);
         try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            const newUser = {
               username,
               password,
               language: "english",
               created: new Date().toISOString(),
               highestScore: 0,
               highestScoreDate: null,
            };

            const updatedUsers = [...allUsers, newUser];
            setAllUsers(updatedUsers);
            localStorage.setItem("quizUsers", JSON.stringify(updatedUsers));

            const userData = {
               username: newUser.username,
               language: newUser.language,
               isGuest: false,
            };

            localStorage.setItem("quizUser", JSON.stringify(userData));
            onLogin(userData);
         } catch (err) {
            setError("Registration failed. Please try again.");
         } finally {
            setIsLoading(false);
         }
      }
   };

   const handleGuestPlayClick = () => {
      const guestData = {
         username: `Guest_${Math.floor(Math.random() * 10000)}`,
         language: "english",
         isGuest: true,
      };

      localStorage.setItem("quizUser", JSON.stringify(guestData));
      onGuestPlay(guestData);
   };

   return (
      <div className="w-full max-w-sm mx-auto bg-gray-900/80 backdrop-blur-sm p-5 rounded-lg shadow-lg">
         <div className="flex justify-center mb-4">
            <UserCircle className="w-12 h-12 text-blue-400" />
         </div>

         <div className="flex border-b border-gray-700 mb-4">
            <button
               className={`flex-1 py-2 font-medium text-center ${activeTab === "login"
                     ? "text-blue-400 border-b-2 border-blue-400"
                     : "text-gray-400 hover:text-gray-300"
                  }`}
               onClick={() => setActiveTab("login")}
            >
               Login
            </button>
            <button
               className={`flex-1 py-2 font-medium text-center ${activeTab === "signup"
                     ? "text-blue-400 border-b-2 border-blue-400"
                     : "text-gray-400 hover:text-gray-300"
                  }`}
               onClick={() => setActiveTab("signup")}
            >
               Sign Up
            </button>
         </div>

         {error && (
            <div className="mb-3 p-2 bg-red-900/50 text-red-300 rounded text-sm">
               {error}
            </div>
         )}

         <form onSubmit={handleSubmit}>
            <div className="mb-3">
               <label className="flex items-center mb-1 text-gray-300 text-sm">
                  <User className="w-4 h-4 mr-2" />
                  <span>Username</span>
               </label>
               <input
                  type="text"
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 border-gray-700 text-white"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
               />
            </div>

            <div className="mb-3">
               <label className="flex items-center mb-1 text-gray-300 text-sm">
                  <Key className="w-4 h-4 mr-2" />
                  <span>Password</span>
               </label>
               <input
                  type="password"
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 border-gray-700 text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
               />
            </div>

            {activeTab === "signup" && (
               <>
                  <div className="mb-3">
                     <label className="flex items-center mb-1 text-gray-300 text-sm">
                        <Key className="w-4 h-4 mr-2" />
                        <span>Confirm Password</span>
                     </label>
                     <input
                        type="password"
                        className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 border-gray-700 text-white"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                     />
                  </div>
               </>
            )}

            <button
               type="submit"
               className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors mb-3 text-sm"
               disabled={isLoading}
            >
               {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
               ) : activeTab === "login" ? (
                  <LogIn className="w-4 h-4 mr-2" />
               ) : (
                  <UserPlus className="w-4 h-4 mr-2" />
               )}
               {activeTab === "login" ? "Login" : "Sign Up"}
            </button>
         </form>

         <div className="text-center">
            <p className="text-gray-400 mb-3 text-sm">Or</p>
            <button
               onClick={handleGuestPlayClick}
               className="w-full bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-4 rounded-lg transition-colors text-sm"
            >
               Play as Guest
            </button>
         </div>
      </div>
   );
}

export default AuthScreen;
