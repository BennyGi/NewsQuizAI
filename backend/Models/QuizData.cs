using System;
using System.Collections.Generic;

namespace NewsQuizGenerator.Models;

public class QuizData
{
   public string Date { get; set; } = string.Empty;
   public List<QuizQuestion> Questions { get; set; } = new();
}