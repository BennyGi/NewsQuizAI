using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NewsQuizGenerator.Models;

public record QuizQuestion(
    string QuestionText,
    string[] Answers,
    int CorrectAnswerIndex);
