"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, RotateCcw, Loader2 } from "lucide-react";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizState, setQuizState] = useState("loading"); // loading, active, completed
  const [retryCount, setRetryCount] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [timerActive, setTimerActive] = useState(false);
  const router = useRouter();

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    error: generateError,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveResultFn,
    error: saveError,
  } = useFetch(saveQuizResult);

  // Generate quiz on component mount
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        console.log('Calling generateQuizFn...');
        const generatedQuestions = await generateQuizFn();
        console.log('Generated questions received:', generatedQuestions);
        
        // Check if generatedQuestions is valid
        if (!generatedQuestions || !Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
          console.error("Invalid quiz data received:", generatedQuestions);
          
          // Retry up to 3 times
          if (retryCount < 3) {
            console.log(`Retrying quiz generation (attempt ${retryCount + 1}/3)`);
            setRetryCount(prev => prev + 1);
            setTimeout(() => {
              initializeQuiz();
            }, 1000);
            return;
          }
          
          toast.error("Failed to generate quiz questions after multiple attempts. Please try again later.");
          setQuizState("loading");
          return;
        }
        
        setQuestions(generatedQuestions);
        setAnswers(new Array(generatedQuestions.length).fill(null));
        setQuizState("active");
        setTimerActive(true);
      } catch (error) {
        toast.error("Failed to generate quiz questions. Please try again.");
        console.error("Quiz generation error:", error);
        setQuizState("loading");
      }
    };

    initializeQuiz();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0 && quizState === "active") {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            setTimerActive(false);
            handleCompleteQuiz();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, quizState]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = questions[currentQuestion].options[answerIndex];
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleCompleteQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleCompleteQuiz = async () => {
    setTimerActive(false);
    setQuizState("completed");
    
    // Calculate score
    const correctAnswers = questions.reduce((acc, question, index) => {
      return acc + (question.correctAnswer === answers[index] ? 1 : 0);
    }, 0);
    
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);

    // Save results
    try {
      await saveResultFn(questions, answers, finalScore);
      toast.success("Quiz completed and results saved!");
    } catch (error) {
      toast.error("Failed to save quiz results.");
      console.error("Save error:", error);
    }
  };

  const handleRetakeQuiz = () => {
    router.refresh();
  };

  const handleGoBack = () => {
    router.push("/interview");
  };

  if (generatingQuiz) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-lg">Generating your personalized quiz...</p>
            <p className="text-sm text-muted-foreground">This may take a few moments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (generateError || (quizState === "loading" && retryCount >= 3)) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <p className="text-lg">Failed to generate quiz</p>
            <p className="text-sm text-muted-foreground">
              {generateError ? generateError.message : "Unable to load quiz questions"}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => {
                setRetryCount(0);
                setQuizState("loading");
                window.location.reload();
              }}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button variant="outline" onClick={handleGoBack}>
                Go Back
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quizState === "completed") {
    const correctAnswers = questions.reduce((acc, question, index) => {
      return acc + (question.correctAnswer === answers[index] ? 1 : 0);
    }, 0);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Quiz Completed!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-4xl font-bold text-primary">{score}%</p>
            <p className="text-lg">
              {correctAnswers} out of {questions.length} questions correct
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Answers:</h3>
            {questions.map((question, index) => {
              const isCorrect = question.correctAnswer === answers[index];
              return (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="space-y-2 flex-1">
                      <p className="font-medium">{question.question}</p>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Your answer:</span>{" "}
                          <Badge variant={isCorrect ? "default" : "destructive"}>
                            {answers[index] || "No answer"}
                          </Badge>
                        </p>
                        {!isCorrect && (
                          <p className="text-sm">
                            <span className="font-medium">Correct answer:</span>{" "}
                            <Badge variant="default">{question.correctAnswer}</Badge>
                          </p>
                        )}
                      </div>
                      {question.explanation && (
                        <p className="text-sm text-muted-foreground italic">
                          💡 {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <Button onClick={handleRetakeQuiz} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button onClick={handleGoBack}>
              View All Results
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="text-lg">Loading questions...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Question {currentQuestion + 1} of {questions.length}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            <span className={timeLeft < 60 ? "text-red-600 font-semibold" : ""}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">{currentQ.question}</h2>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === option;
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-gray-400"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion]}
          >
            {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
