@echo off
echo Fixing OpenAIService.cs File (English Only)
echo =====================================

cd /d %~dp0\backend\Services

echo Creating backup of current file...
copy /y OpenAIService.cs OpenAIService.cs.bak

echo Writing English-only OpenAIService.cs file...
echo using System.Text.Json; > OpenAIService.cs
echo using NewsQuizGenerator.Models; >> OpenAIService.cs
echo using OpenAI.ObjectModels.RequestModels; >> OpenAIService.cs
echo using OpenAI.ObjectModels.ResponseModels; >> OpenAIService.cs
echo using OpenAI.Interfaces; >> OpenAIService.cs
echo using OpenAI.ObjectModels; >> OpenAIService.cs
echo. >> OpenAIService.cs
echo namespace NewsQuizGenerator.Services; >> OpenAIService.cs
echo. >> OpenAIService.cs
echo public class OpenAIService >> OpenAIService.cs
echo { >> OpenAIService.cs
echo    private readonly IOpenAIService _openAIService; >> OpenAIService.cs
echo    private readonly int _qCount; >> OpenAIService.cs
echo. >> OpenAIService.cs
echo    public OpenAIService(string openAiKey, int questions = 5) >> OpenAIService.cs
echo    { >> OpenAIService.cs
echo       _openAIService = new OpenAI.Managers.OpenAIService(new OpenAI.OpenAiOptions()  >> OpenAIService.cs
echo       {  >> OpenAIService.cs
echo          ApiKey = openAiKey >> OpenAIService.cs
echo       }); >> OpenAIService.cs
echo       _qCount = questions; >> OpenAIService.cs
echo    } >> OpenAIService.cs
echo. >> OpenAIService.cs
echo    public async Task^<List^<QuizQuestion^>^> GenerateQuizAsync(List^<string^> headlines) >> OpenAIService.cs
echo    { >> OpenAIService.cs
echo       var prompt = BuildPrompt(headlines); >> OpenAIService.cs
echo. >> OpenAIService.cs
echo       var chatCompletionCreateRequest = new ChatCompletionCreateRequest >> OpenAIService.cs
echo       { >> OpenAIService.cs
echo          Messages = new List^<ChatMessage^> >> OpenAIService.cs
echo          { >> OpenAIService.cs
echo             ChatMessage.FromSystem(@"You are a news quiz generator. Create interesting trivia questions based on recent news headlines. >> OpenAIService.cs
echo Each question should be clear and precise, with 4 answer options where only one is correct. >> OpenAIService.cs
echo Create questions that test real knowledge about the events in the news, not general questions or guessing."), >> OpenAIService.cs
echo             ChatMessage.FromUser(prompt) >> OpenAIService.cs
echo          }, >> OpenAIService.cs
echo          Model = Models.Gpt_4o_mini, >> OpenAIService.cs
echo          Temperature = 0.4f, >> OpenAIService.cs
echo       }; >> OpenAIService.cs
echo. >> OpenAIService.cs
echo       try >> OpenAIService.cs
echo       { >> OpenAIService.cs
echo          var completionResult = await _openAIService.ChatCompletion.CreateCompletion(chatCompletionCreateRequest); >> OpenAIService.cs
echo. >> OpenAIService.cs
echo          if (!completionResult.Successful) >> OpenAIService.cs
echo          { >> OpenAIService.cs
echo             if (completionResult.Error == null) >> OpenAIService.cs
echo             { >> OpenAIService.cs
echo                throw new Exception("Unknown error calling OpenAI API"); >> OpenAIService.cs
echo             } >> OpenAIService.cs
echo             throw new Exception($"OpenAI API error: {completionResult.Error.Message}"); >> OpenAIService.cs
echo          } >> OpenAIService.cs
echo. >> OpenAIService.cs
echo          var json = completionResult.Choices.First().Message.Content; >> OpenAIService.cs
echo. >> OpenAIService.cs
echo          if (string.IsNullOrEmpty(json)) >> OpenAIService.cs
echo          { >> OpenAIService.cs
echo             throw new Exception("Received empty response from OpenAI"); >> OpenAIService.cs
echo          } >> OpenAIService.cs
echo. >> OpenAIService.cs
echo          try >> OpenAIService.cs
echo          { >> OpenAIService.cs
echo             var questions = JsonSerializer.Deserialize^<List^<QuizQuestion^>^>(json); >> OpenAIService.cs
echo             if (questions == null ^|^| questions.Count == 0) >> OpenAIService.cs
echo             { >> OpenAIService.cs
echo                throw new Exception("Failed to parse quiz questions from response"); >> OpenAIService.cs
echo             } >> OpenAIService.cs
echo. >> OpenAIService.cs
echo             // Validate each question >> OpenAIService.cs
echo             foreach (var q in questions) >> OpenAIService.cs
echo             { >> OpenAIService.cs
echo                if (string.IsNullOrEmpty(q.QuestionText) ^|^| >> OpenAIService.cs
echo                    q.Answers == null ^|^| >> OpenAIService.cs
echo                    q.Answers.Length != 4 ^|^| >> OpenAIService.cs
echo                    q.CorrectAnswerIndex ^< 0 ^|^| >> OpenAIService.cs
echo                    q.CorrectAnswerIndex ^> 3) >> OpenAIService.cs
echo                { >> OpenAIService.cs
echo                   throw new Exception("Invalid question format in response"); >> OpenAIService.cs
echo                } >> OpenAIService.cs
echo             } >> OpenAIService.cs
echo. >> OpenAIService.cs
echo             return questions; >> OpenAIService.cs
echo          } >> OpenAIService.cs
echo          catch (JsonException ex) >> OpenAIService.cs
echo          { >> OpenAIService.cs
echo             throw new Exception($"Failed to parse JSON response: {ex.Message}\nResponse: {json}"); >> OpenAIService.cs
echo          } >> OpenAIService.cs
echo       } >> OpenAIService.cs
echo       catch (Exception ex) >> OpenAIService.cs
echo       { >> OpenAIService.cs
echo          throw new Exception($"OpenAI API error: {ex.Message}"); >> OpenAIService.cs
echo       } >> OpenAIService.cs
echo    } >> OpenAIService.cs
echo. >> OpenAIService.cs
echo    private string BuildPrompt(List^<string^> heads) =^> $@" >> OpenAIService.cs
echo Create {_qCount} trivia questions about yesterday's news headlines. >> OpenAIService.cs
echo The questions should be based directly on the information in the headlines, not general questions. >> OpenAIService.cs
echo For each headline, provide at least one specific question related to the main event mentioned in the headline. >> OpenAIService.cs
echo For each question, create 4 possible answers where only one is correct. >> OpenAIService.cs
echo. >> OpenAIService.cs
echo Return JSON only in the following format: >> OpenAIService.cs
echo [ >> OpenAIService.cs
echo   {{ >> OpenAIService.cs
echo     ""QuestionText"": ""Question about a news event"", >> OpenAIService.cs
echo     ""Answers"": [""Correct answer"", ""Wrong answer 1"", ""Wrong answer 2"", ""Wrong answer 3""], >> OpenAIService.cs
echo     ""CorrectAnswerIndex"": 0 >> OpenAIService.cs
echo   }} >> OpenAIService.cs
echo ] >> OpenAIService.cs
echo. >> OpenAIService.cs
echo In this case, the correct answer is always at position 0, but you can change the position to any number between 0-3. >> OpenAIService.cs
echo. >> OpenAIService.cs
echo Yesterday's headlines: >> OpenAIService.cs
echo - {string.Join(""\n- "", heads)} >> OpenAIService.cs
echo "; >> OpenAIService.cs
echo } >> OpenAIService.cs

echo Done! File has been fixed with English-only content.
echo.
echo Now running the quiz generator...
cd ..
dotnet run

echo.
echo Press any key to exit.
pause > nul