# 📰 NewsQuiz AI - Daily AI-Powered News Quiz

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![.NET](https://img.shields.io/badge/.NET-7.0+-512BD4?logo=.net)](https://dotnet.microsoft.com/download)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

An interactive **daily quiz application** that tests how well you remember **yesterday's news events**. Powered by real-time news data and AI-generated questions.

## 🎬 Demo Video

[![Watch the demo video](https://img.shields.io/badge/▶️%20Watch-Demo%20Video-blue?style=for-the-badge)](assets/NewsQuizAI.mp4)

## 🎯 Overview

NewsQuiz AI is a modern, full-stack web application that:

- 📰 Fetches **real headlines** from yesterday using [NewsAPI](https://newsapi.org/)
- 🤖 Generates **quiz questions** automatically using [OpenAI](https://openai.com/)
- ✨ Displays them in a **beautiful, animated React UI** with Tailwind CSS
- 🏆 Tracks user scores and maintains a **leaderboard**
- 🔄 Updates **daily at midnight** with fresh questions
- ♿ Includes **accessibility features** (text size, high contrast, skip links)

---

## ✨ Key Features

### 🎮 Quiz Gameplay
- ⏱️ **30-second timer** per question
- 🎯 **4 multiple-choice answers** with randomized positions
- 🔊 **Sound effects** for correct/wrong answers
- 🎵 **Background music** during quiz
- 📊 **Result screen** with percentage score and personal stats

### 👤 User Management
- 🔐 **Sign up / Login** system with localStorage
- 👥 **Guest mode** for quick play
- 📋 **Personal score history** (last 3 scores displayed)

### 🏅 Leaderboard
- 🥇 **Top scores** from all users
- 📈 **Personal statistics** and trends
- 💾 Persistent storage using localStorage

### ♿ Accessibility
- 📝 **Text size slider** (100%-1000%)
- 🌓 **Dark mode toggle**
- ⌨️ **Skip to main content** link
- 🎨 **High contrast mode**
- 📱 **Fully responsive** design

### 🎨 UI/UX Features
- ✨ **Animated gradient text** with pulsing glow effects
- 🚀 **Floating robot mascot** with parallax animations
- 💫 **Particle burst effects** on interactions
- 🎭 **Smooth transitions** and micro-interactions
- 🌟 **Modern glassmorphism** design

---

## 🛠️ Tech Stack

### Backend
- **C# / .NET** (7.0+)
- **OpenAI SDK** - GPT models for question generation
- **NewsAPI.org SDK** - Real-time news data
- **System.Text.Json** - JSON handling
- **Scheduled Services** - Daily automation

### Frontend
- **React 18+** - UI framework
- **Vite** - Fast build tool & dev server
- **Tailwind CSS 3+** - Utility-first styling
- **lucide-react** - Beautiful icons
- **LocalStorage API** - Client-side persistence

### External APIs
- 🔗 [NewsAPI.org](https://newsapi.org/) - News headlines
- 🤖 [OpenAI API](https://platform.openai.com/) - Quiz generation

---

## 📦 Installation & Setup

### Prerequisites

- **.NET SDK** 7.0+ ([download](https://dotnet.microsoft.com/download))
- **Node.js** 16+ & npm ([download](https://nodejs.org/))
- **NewsAPI API Key** ([get one free](https://newsapi.org/))
- **OpenAI API Key** ([get one here](https://platform.openai.com/api-keys))

### Step 1: Clone Repository

```bash
git clone https://github.com/BennyGi/NewsQuizAI.git
cd NewsQuizAI
```

### Step 2: Backend Setup

Navigate to backend folder:

```bash
cd backend
```

#### Create `appsettings.json`

Create a new file `appsettings.json` in the backend root:

```json
{
  "OpenAI": {
    "ApiKey": "your_openai_api_key_here"
  },
  "NewsApi": {
    "ApiKey": "your_newsapi_key_here"
  },
  "Quiz": {
    "OutputPath": "C:\\ABSOLUTE\\PATH\\TO\\frontend\\news-quiz-tailwind\\public\\questions.json",
    "QuestionCount": 5
  }
}
```

⚠️ **Important:**
- Replace API keys with your actual keys
- `OutputPath` must be **absolute path** to `questions.json` in the frontend public folder
- `appsettings.json` is in `.gitignore` - never commit API keys!

#### Restore & Run Backend

```bash
dotnet restore
dotnet run
```

You should see:

```
Quiz generator service started. Will generate quiz at midnight every day.
Questions will be saved to C:\...\frontend\news-quiz-tailwind\public\questions.json
[dd/MM/yyyy HH:mm:ss] Generating quiz.
```

✅ The backend generates questions immediately, then schedules the next run for **00:00 (midnight)** daily.

### Step 3: Frontend Setup

In a **new terminal**, navigate to frontend:

```bash
cd frontend/news-quiz-tailwind
npm install
npm run dev
```

Open your browser and visit:

```
http://localhost:5173
```

🎉 You should see the Daily News Quiz home screen!

---

## 🏗️ Project Structure

```
NewsQuizAI/
├── backend/
│   ├── Program.cs                    # Entry point, scheduling logic
│   ├── GlobalUsings.cs               # Global using statements
│   ├── Models/
│   │   ├── QuizQuestion.cs           # Question model
│   │   └── QuizData.cs               # Question collection wrapper
│   ├── Services/
│   │   ├── NewsService.cs            # Fetch headlines from NewsAPI
│   │   └── OpenAIService.cs          # Generate questions via OpenAI
│   ├── appsettings.json              # Config (NOT IN GIT - add your keys)
│   ├── .csproj                       # Project file
│   └── ...
│
├── frontend/
│   └── news-quiz-tailwind/
│       ├── src/
│       │   ├── App.jsx               # Main app component
│       │   ├── AuthScreen.jsx        # Login/signup/guest
│       │   ├── Leaderboard.jsx       # Score leaderboard
│       │   ├── LanguageManager.js    # Text helpers
│       │   ├── UserManager.js        # User localStorage
│       │   ├── ScoreManager.js       # Score persistence
│       │   ├── main.jsx              # Entry point
│       │   └── index.css             # Global styles
│       ├── public/
│       │   ├── questions.json        # Daily questions (auto-generated)
│       │   ├── images/               # Robot mascot, backgrounds
│       │   └── sounds/               # Audio effects, music
│       ├── package.json
│       ├── vite.config.js
│       └── ...
│
├── .gitignore                        # Git ignore patterns
├── README.md                         # This file
└── LICENSE                           # MIT License
```

---

## ⚙️ How It Works

### 📰 Step 1: Fetch Yesterday's News

**NewsService.cs** queries [NewsAPI.org](https://newsapi.org/):

- Calculates **yesterday's date** (UTC)
- Fetches headlines matching category (e.g., "Israel")
- Validates response: `status == "ok"` and `totalResults > 0`
- Extracts and returns headline titles

```csharp
var yesterday = DateTime.UtcNow.AddDays(-1).Date;
var from = yesterday.ToString("yyyy-MM-dd");
var to = yesterday.AddDays(1).ToString("yyyy-MM-dd");

var url = $"https://newsapi.org/v2/everything" +
          $"?q=Israel&from={from}&to={to}" +
          $"&language=en&sortBy=popularity" +
          $"&apiKey={_newsApiKey}";
```

### 🤖 Step 2: Generate Quiz Questions

**OpenAIService.cs** uses OpenAI's Chat API:

- Builds a **prompt** with all yesterday's headlines
- Requests **5 multiple-choice questions** in JSON format
- Each question has:
  - `QuestionText` - the question
  - `Answers[4]` - four possible answers
  - `CorrectAnswerIndex` - correct answer position (0-3, randomized)
- Validates response and shuffles answers

```csharp
var chatCompletionCreateRequest = new ChatCompletionCreateRequest {
    Messages = new List<ChatMessage> {
        ChatMessage.FromSystem("You are a news quiz generator..."),
        ChatMessage.FromUser(prompt)
    },
    Model = Models.Gpt_4o_mini,
    Temperature = 0.4f
};
```

### 💾 Step 3: Save Questions

The backend saves generated questions to:

```
frontend/news-quiz-tailwind/public/questions.json
```

This JSON file is served directly to the frontend.

### ⚛️ Step 4: Frontend Quiz Experience

**App.jsx** orchestrates the quiz:

1. **Loads** `questions.json` on component mount
2. **Displays** one question at a time with a 30-second timer
3. **Handles** user selections, validates answers, plays sounds
4. **Calculates** score based on correct answers
5. **Saves** user score to localStorage
6. **Shows** result screen with percentage, message, and history

---

## 🔄 Daily Scheduling

The backend runs as a **long-lived service**:

1. **On start:** Generates quiz immediately
2. **Then:** Waits until next **00:00 (midnight)** to regenerate
3. **Repeats:** Every day automatically

You can:
- Run `dotnet run` manually and keep the console open
- Use **Windows Task Scheduler** with helper scripts (optional):
  - `generate-question.bat` - Run manually
  - `setup-scheduled-task.bat` - Auto-schedule

---

## 🔐 Security & Secrets

### ⚠️ API Keys

- **Never** commit `appsettings.json` to Git
- File is in `.gitignore`
- Each developer should create their own `appsettings.json` locally

### For Production Deployment

Move secrets to:
- **Environment variables**
- **.NET User Secrets** (development)
- **Cloud Key Vault** (Azure, AWS)
- **Secrets Management** (Docker, K8s)

Example with environment variables:

```bash
export OPENAI_APIKEY="your-key"
export NEWSAPI_APIKEY="your-key"
export QUIZ_OUTPUTPATH="/path/to/questions.json"
```

---

## 🚀 Usage

### For Players

1. **Visit** `http://localhost:5173`
2. **Sign up** with a username/password or play as **Guest**
3. **View** quiz questions about yesterday's news
4. **Answer** each question before the 30-second timer runs out
5. **See** your score and compare on the leaderboard
6. **Come back daily** for fresh questions!

### For Developers

**Start backend:**

```bash
cd backend
dotnet run
```

**Start frontend (in another terminal):**

```bash
cd frontend/news-quiz-tailwind
npm run dev
```

**Build for production:**

```bash
# Frontend
cd frontend/news-quiz-tailwind
npm run build

# Backend
cd backend
dotnet publish -c Release
```

---

## 📋 Troubleshooting

### ❌ "Could not find questions.json"

**Problem:** Frontend fails to load questions.

**Solution:**
- Ensure backend is running (`dotnet run`)
- Check that `OutputPath` in `appsettings.json` is correct
- Verify the path exists and backend has write permissions
- Check browser console for fetch errors

### ❌ "OpenAI API Error"

**Problem:** Question generation fails.

**Solutions:**
- Verify your OpenAI API key is valid and has credits
- Check rate limits (free tier has limits)
- View backend console output for detailed error

### ❌ "NewsAPI Error - Invalid Key"

**Problem:** Headlines not fetching.

**Solutions:**
- Verify your NewsAPI key is correct in `appsettings.json`
- Check NewsAPI website for quota/limits
- Ensure your API key has required permissions

### ❌ Frontend won't load on `localhost:5173`

**Problem:** Dev server not running or port conflict.

**Solutions:**
- Ensure you ran `npm run dev` in frontend folder
- Check if port 5173 is available (use `npm run dev -- --port 3000` to change)
- Check firewall/antivirus settings

---

## 🎨 Customization

### Change News Category

Edit **backend/Services/NewsService.cs**:

```csharp
// Change "Israel" to any topic
var url = $"https://newsapi.org/v2/everything?q=Technology&from={from}...";
```

### Adjust Question Count

Edit **backend/appsettings.json**:

```json
"Quiz": {
  "QuestionCount": 10  // Change from 5 to 10, etc.
}
```

### Modify Timer Duration

Edit **frontend/src/App.jsx**:

```jsx
setTimeLeft(30);  // Change 30 to any number of seconds
```

### Change OpenAI Model

Edit **backend/Services/OpenAIService.cs**:

```csharp
Model = Models.Gpt_4_turbo  // Use different model
```

---

## 🤝 Contributing

Contributions are **welcome**! 🎉

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "Add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

### Ideas for Contributions

- 🌍 Multi-language support
- 🎨 Custom themes / color schemes
- 📊 Advanced analytics & statistics
- 🌐 Database backend (replace localStorage)
- 🔄 Real-time multiplayer mode
- 📱 Mobile app (React Native)
- ☁️ Cloud deployment guides

---

## 🐛 Bug Reports & Feature Requests

Found a bug? Have an idea? 

Please **open an issue** on GitHub with:
- 📝 Clear description
- 🔄 Steps to reproduce (for bugs)
- 📸 Screenshots (if applicable)
- 💻 Environment info (OS, browsers, etc.)

---

## 📈 Future Roadmap

- [ ] 🌍 Multi-country/topic selection
- [ ] 🎮 Difficulty levels (easy, medium, hard)
- [ ] 📱 Mobile app (iOS/Android)
- [ ] 🌐 Real user database (PostgreSQL/MongoDB)
- [ ] 🔐 Social login (Google, GitHub)
- [ ] 🏆 Achievements & badges
- [ ] 🎯 Question history & analytics
- [ ] 🤖 Improved AI with follow-up questions
- [ ] ☁️ Cloud deployment (Vercel, Azure, Heroku)
- [ ] 🌙 Custom themes & dark mode variants

---

## 📝 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Use privately

Just include the original copyright notice and license.

---

## 👨‍💻 Author

**Benny Giorno**

**Feel free to reach out with questions, suggestions, or just to say hi!** 👋

---

## 🙏 Acknowledgments

- 📰 [NewsAPI.org](https://newsapi.org/) - Real-time news data
- 🤖 [OpenAI](https://openai.com/) - Powerful AI models
- ⚛️ [React](https://reactjs.org/) - UI framework
- 🎨 [Tailwind CSS](https://tailwindcss.com/) - Styling
- ⚡ [Vite](https://vitejs.dev/) - Build tooling
- 🔧 [.NET](https://dotnet.microsoft.com/) - Backend framework

---

**⭐ If you found this project useful, please give it a star!** ⭐

```
Made with ❤️ by Benny Giorno
```
