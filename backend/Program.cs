using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using NewsQuizGenerator.Services;
using NewsQuizGenerator.Models;

namespace NewsQuizGenerator
{
   internal class Program
   {
      static async Task Main(string[] args)
      {
         // Load configuration
         var configuration = new ConfigurationBuilder()
             .AddJsonFile("appsettings.json")
             .Build();

         var openAiKey = configuration["OpenAI:ApiKey"];
         var newsApiKey = configuration["NewsApi:ApiKey"];
         var outputPath = configuration["Quiz:OutputPath"] ?? "questions.json";
         var questionCount = int.Parse(configuration["Quiz:QuestionCount"] ?? "5");

         if (string.IsNullOrEmpty(openAiKey) || openAiKey == "YOUR_OPENAI_KEY")
         {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("Error: Please set your OpenAI API key in appsettings.json");
            Console.ResetColor();
            return;
         }

         if (string.IsNullOrEmpty(newsApiKey) || newsApiKey == "YOUR_NEWSAPI_KEY")
         {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("Error: Please set your NewsAPI key in appsettings.json");
            Console.ResetColor();
            return;
         }

         var news = new NewsService(newsApiKey);
         var gpt = new OpenAIService(openAiKey, questionCount);

         async Task GenerateQuizAsync()
         {
            Console.WriteLine($"[{DateTime.Now}] Generating quiz.");

            try
            {
               var headlines = await news.GetYesterdayHeadlinesAsync();

               if (headlines.Count == 0)
                  throw new Exception("No headlines found for yesterday");

               Console.WriteLine($"Found {headlines.Count} headlines");
               var quiz = await gpt.GenerateQuizAsync(headlines);
               // Randomize correct answer position for each question
               var random = new Random();

               for (int i = 0; i < quiz.Count; i++)
               {
                  var q = quiz[i];

                  var answers = q.Answers.ToArray();

                  int currentCorrectIndex = q.CorrectAnswerIndex;

                  int newCorrectIndex = random.Next(answers.Length);

                  var temp = answers[currentCorrectIndex];
                  answers[currentCorrectIndex] = answers[newCorrectIndex];
                  answers[newCorrectIndex] = temp;

                  quiz[i] = q with
                  {
                     Answers = answers,
                     CorrectAnswerIndex = newCorrectIndex
                  };
               }


               // Make sure output directory exists
               var outputDirectory = Path.GetDirectoryName(outputPath);
               if (!string.IsNullOrEmpty(outputDirectory) && !Directory.Exists(outputDirectory))
               {
                  Directory.CreateDirectory(outputDirectory);
               }

               await File.WriteAllTextAsync(
                   outputPath,
                   JsonSerializer.Serialize(quiz, new JsonSerializerOptions
                   {
                      WriteIndented = true
                   })
               );

               Console.ForegroundColor = ConsoleColor.Green;
               Console.WriteLine($"✓ Quiz updated ({quiz.Count} questions) at {outputPath}");
            }
            catch (Exception ex)
            {
               Console.ForegroundColor = ConsoleColor.Red;
               Console.WriteLine("✗ Error: " + ex.Message);
            }
            finally
            {
               Console.ResetColor();
            }
         }

         // Check - run once and exit
         // Can cancel the loop for one-time test:
         // await GenerateQuizAsync();
         // return;

         // Every midnight loop
         Console.WriteLine("Quiz generator service started. Will generate quiz at midnight every day.");
         Console.WriteLine($"Questions will be saved to {outputPath}");

         await GenerateQuizAsync();
         return;

         //while (true)
         //{
         //   var now = DateTime.Now;
         //   var next = now.Date.AddDays(1); // 00:00
         //   var delay = next - now;

         //   Console.WriteLine($"Next quiz will be generated at {next} (in {delay.TotalHours:F1} hours)");

         //   await Task.Delay(delay);
         //   await GenerateQuizAsync();
         //}
      }
   }
}
