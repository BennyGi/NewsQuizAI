using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;
using System.Net.Http;
using System.Net.Http.Headers;

namespace NewsQuizGenerator.Services;

public class NewsService
{
   private readonly HttpClient _http;
   private readonly string _newsApiKey;

   public NewsService(string newsApiKey)
   {
      _newsApiKey = newsApiKey;
      _http = new HttpClient();
      _http.DefaultRequestHeaders.UserAgent.Add(
         new ProductInfoHeaderValue("NewsQuizGenerator", "1.0"));
   }

   public async Task<List<string>> GetYesterdayHeadlinesAsync(int max = 15)
   {
      var yesterday = DateTime.UtcNow.AddDays(-1).Date;
      var from = yesterday.ToString("yyyy-MM-dd");
      var to = yesterday.AddDays(1).ToString("yyyy-MM-dd");

      var url = $"https://newsapi.org/v2/everything" +
          $"?q=Israel" +
          $"&from={from}" +
          $"&to={to}" +
          $"&language=en" +
          $"&sortBy=popularity" +
          $"&apiKey={_newsApiKey}";


      try
      {
         var response = await _http.GetAsync(url);

         if (!response.IsSuccessStatusCode)
         {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"NewsAPI returned status code {response.StatusCode}: {errorContent}");
         }

         var json = await response.Content.ReadAsStringAsync();

         using var doc = JsonDocument.Parse(json);

         var status = doc.RootElement.GetProperty("status").GetString();
         if (status != "ok")
         {
            var message = doc.RootElement.TryGetProperty("message", out var msgElement)
               ? msgElement.GetString()
               : "Unknown error";
            throw new Exception($"NewsAPI error: {message}");
         }

         var totalResults = doc.RootElement.GetProperty("totalResults").GetInt32();
         if (totalResults == 0)
         {
            throw new Exception("No news articles found for yesterday");
         }

         return doc.RootElement.GetProperty("articles")
                  .EnumerateArray()
                  .Select(a => a.GetProperty("title").GetString()!)
                  .Where(t => !string.IsNullOrEmpty(t))
                  .ToList();
      }
      catch (Exception ex) when (ex is HttpRequestException || ex is TaskCanceledException)
      {
         throw new Exception($"Failed to connect to NewsAPI: {ex.Message}");
      }
      catch (JsonException ex)
      {
         throw new Exception($"Failed to parse NewsAPI response: {ex.Message}");
      }
   }
}