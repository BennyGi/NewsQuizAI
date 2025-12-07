using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using NewsQuizGenerator.Models;
using OpenAI.ObjectModels.RequestModels;
using OpenAI.ObjectModels.ResponseModels;
using OpenAI.Interfaces;
using OpenAI.ObjectModels;

namespace NewsQuizGenerator.Services
{
   public class OpenAIService
   {
      private readonly IOpenAIService _openAIService;
      private readonly int _qCount;

      public OpenAIService(string openAiKey, int questions = 5)
      {
         _openAIService = new OpenAI.Managers.OpenAIService(new OpenAI.OpenAiOptions()
         {
            ApiKey = openAiKey
         });
         _qCount = questions;
      }

      public async Task<List<QuizQuestion>> GenerateQuizAsync(List<string> headlines)
      {
         var prompt = BuildPrompt(headlines);

         var chatCompletionCreateRequest = new ChatCompletionCreateRequest
         {
            Messages = new List<ChatMessage>
                {
                    ChatMessage.FromSystem("You are a news quiz generator. Create interesting trivia questions based on recent news headlines. Each question should be clear and precise, with 4 answer options where only one is correct. Create questions that test real knowledge about the events in the news, not general questions or guessing."),
                    ChatMessage.FromUser(prompt)
                },
            Model = "gpt-4",
            Temperature = 0.4f
         };

         try
         {
            var completionResult = await _openAIService.ChatCompletion.CreateCompletion(chatCompletionCreateRequest);

            if (!completionResult.Successful)
            {
               if (completionResult.Error == null)
               {
                  throw new Exception("Unknown error calling OpenAI API");
               }
               throw new Exception($"OpenAI API error: {completionResult.Error.Message}");
            }

            var json = completionResult.Choices.First().Message.Content;

            if (string.IsNullOrEmpty(json))
            {
               throw new Exception("Received empty response from OpenAI");
            }

            try
            {
               var questions = JsonSerializer.Deserialize<List<QuizQuestion>>(json);
               if (questions == null || questions.Count == 0)
               {
                  throw new Exception("Failed to parse quiz questions from response");
               }

               // Validate each question
               foreach (var q in questions)
               {
                  if (string.IsNullOrEmpty(q.QuestionText) ||
                      q.Answers == null ||
                      q.Answers.Length != 4 ||
                      q.CorrectAnswerIndex < 0 ||
                      q.CorrectAnswerIndex > 3)
                  {
                     throw new Exception("Invalid question format in response");
                  }
               }

               return questions;
            }
            catch (JsonException ex)
            {
               throw new Exception($"Failed to parse JSON response: {ex.Message}\nResponse: {json}");
            }
         }
         catch (Exception ex)
         {
            throw new Exception($"OpenAI API error: {ex.Message}");
         }
      }

      private string BuildPrompt(List<string> heads) => $@"
Create {_qCount} trivia questions about yesterday's news headlines.
The questions should be based directly on the information in the headlines, not general questions.
For each headline, provide at least one specific question related to the main event mentioned in the headline.
For each question, create 4 possible answers where only one is correct.

Return JSON only in the following format:
[
  {{
    ""QuestionText"": ""Question about a news event"",
    ""Answers"": [""Correct answer"", ""Wrong answer 1"", ""Wrong answer 2"", ""Wrong answer 3""],
    ""CorrectAnswerIndex"": 0
  }}
]

In this case, the correct answer is always at position 0, but you can change the position to any number between 0-3.

Yesterday's headlines:
- {string.Join("\n- ", heads)}
";
   }
}