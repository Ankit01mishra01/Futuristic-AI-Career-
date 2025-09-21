"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateQuiz() {
  console.log('generateQuiz function called');
  try {
    const { userId } = await auth();
    console.log('User ID:', userId);
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        industryName: true,
        skills: true,
      },
    });

    console.log('User found:', user);
    if (!user) throw new Error("User not found");

    // Check if user has completed onboarding
    if (!user.industryName) {
      console.warn('User has not completed onboarding, using default industry');
      // Use a default industry for users who haven't completed onboarding
      user.industryName = 'Technology';
    }

  // Check if API key is properly configured
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('AI API key not configured, using fallback quiz questions');
    const fallbackQuestions = getFallbackQuizQuestions(user.industryName, user.skills);
    console.log('Fallback questions generated:', fallbackQuestions.length);
    return fallbackQuestions;
  }

  const prompt = `
    Generate 10 technical interview questions for a ${user.industryName
    } professional${user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.
    
    Each question should be multiple choice with 4 options.
    
    Return the response in this JSON format only, no additional text:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": "string",
          "explanation": "string"
        }
      ]
    }
  `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
      const quiz = JSON.parse(cleanedText);

      // Ensure we return an array
      if (quiz && Array.isArray(quiz.questions) && quiz.questions.length > 0) {
        return quiz.questions;
      } else {
        console.warn('AI returned invalid quiz format, using fallback');
        return getFallbackQuizQuestions(user.industryName, user.skills);
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      console.warn('Falling back to default quiz questions');
      return getFallbackQuizQuestions(user.industryName, user.skills);
    }
  } catch (error) {
    console.error("Error in generateQuiz:", error);
    // Always return fallback questions as last resort
    const fallbackQuestions = getFallbackQuizQuestions('Technology', []);
    console.log('Error fallback questions generated:', fallbackQuestions.length);
    return fallbackQuestions;
  }
}

// Fallback quiz questions
const getFallbackQuizQuestions = (industryName, skills) => {
  return [
    {
      question: "What is the most important skill for career advancement?",
      options: [
        "Technical expertise only",
        "Communication and leadership",
        "Working longer hours",
        "Avoiding challenges"
      ],
      correctAnswer: "Communication and leadership",
      explanation: "While technical skills are important, communication and leadership abilities are crucial for career growth and team collaboration."
    },
    {
      question: "How should you approach learning new technologies?",
      options: [
        "Wait for formal training",
        "Only learn what's required",
        "Continuously learn and adapt",
        "Avoid new technologies"
      ],
      correctAnswer: "Continuously learn and adapt",
      explanation: "The technology landscape changes rapidly, so continuous learning and adaptation are essential for staying relevant."
    },
    {
      question: "What's the best approach to problem-solving?",
      options: [
        "Work alone always",
        "Use only one method",
        "Analyze, collaborate, and iterate",
        "Avoid complex problems"
      ],
      correctAnswer: "Analyze, collaborate, and iterate",
      explanation: "Effective problem-solving involves analyzing the issue, collaborating with others for insights, and iterating on solutions."
    },
    {
      question: "How important is feedback in professional development?",
      options: [
        "Not important at all",
        "Only negative feedback matters",
        "Essential for growth and improvement",
        "Should be avoided"
      ],
      correctAnswer: "Essential for growth and improvement",
      explanation: "Constructive feedback, both positive and negative, is crucial for identifying areas of improvement and professional growth."
    },
    {
      question: "What defines effective teamwork?",
      options: [
        "Working in isolation",
        "Competing with team members",
        "Clear communication and shared goals",
        "Avoiding responsibility"
      ],
      correctAnswer: "Clear communication and shared goals",
      explanation: "Effective teamwork requires clear communication, shared objectives, and mutual support among team members."
    },
    {
      question: "How should you handle workplace challenges?",
      options: [
        "Ignore them completely",
        "Blame others for problems",
        "Address them proactively",
        "Wait for someone else to solve them"
      ],
      correctAnswer: "Address them proactively",
      explanation: "Proactively addressing challenges demonstrates initiative and problem-solving skills that employers value."
    },
    {
      question: "What's most important for career networking?",
      options: [
        "Only connect with senior people",
        "Building genuine relationships",
        "Collecting as many contacts as possible",
        "Networking only when job searching"
      ],
      correctAnswer: "Building genuine relationships",
      explanation: "Effective networking is about building genuine, mutually beneficial relationships rather than simply collecting contacts."
    },
    {
      question: "How should you approach work-life balance?",
      options: [
        "Work should always come first",
        "Personal life should always come first",
        "Find a sustainable balance",
        "Balance is not important"
      ],
      correctAnswer: "Find a sustainable balance",
      explanation: "A sustainable work-life balance is essential for long-term success, productivity, and personal well-being."
    },
    {
      question: "What's the best way to handle criticism?",
      options: [
        "Take it personally",
        "Ignore it completely",
        "Listen, evaluate, and learn",
        "Become defensive immediately"
      ],
      correctAnswer: "Listen, evaluate, and learn",
      explanation: "Constructive criticism should be listened to, evaluated objectively, and used as a learning opportunity for improvement."
    },
    {
      question: "How important is continuous improvement?",
      options: [
        "Not important at all",
        "Only needed when performance is poor",
        "Essential for long-term success",
        "Should be avoided to maintain status quo"
      ],
      correctAnswer: "Essential for long-term success",
      explanation: "Continuous improvement is vital for staying competitive, developing skills, and achieving long-term career success."
    }
  ];
};

export async function saveQuizResult(questions, answers, score) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const questionResults = questions.map((q, index) => ({
    question: q.question,
    answer: q.correctAnswer,
    userAnswer: answers[index],
    isCorrect: q.correctAnswer === answers[index],
    explanation: q.explanation,
  }));

  // Get wrong answers
  const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

  // Only generate improvement tips if there are wrong answers
  let improvementTip = null;
  if (wrongAnswers.length > 0) {
    const wrongQuestionsText = wrongAnswers
      .map(
        (q) =>
          `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
      )
      .join("\n\n");

    const improvementPrompt = `
      The user got the following ${user.industryName} technical interview questions wrong:

      ${wrongQuestionsText}

      Based on these mistakes, provide a concise, specific improvement tip.
      Focus on the knowledge gaps revealed by these wrong answers.
      Keep the response under 2 sentences and make it encouraging.
      Don't explicitly mention the mistakes, instead focus on what to learn/practice.
    `;

    try {
      const result = await model.generateContent(improvementPrompt);
      const response = result.response;
      improvementTip = response.text().trim();
      console.log(improvementTip);
    } catch (error) {
      console.error("Error generating improvement tip:", error);
      // Continue without improvement tip if generation fails
    }
  }

  try {
    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    return assessment;
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw new Error("Failed to save quiz result");
  }
}

export async function getAssessments() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  try {
    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return assessments;
  } catch (error) {
    console.error("Error fetching assessments:", error);
    throw new Error("Failed to fetch assessments");
  }
}