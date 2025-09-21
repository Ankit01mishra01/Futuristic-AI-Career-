"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (industry) => {
  // Check if API key is properly configured
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('AI API key not configured, using fallback data');
    return getFallbackInsights(industry);
  }

  try {
    const prompt = `
            Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
            {
              "salaryRanges": [
                { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
              ],
              "growthRate": number,
              "demandLevel": "HIGH" | "MEDIUM" | "LOW",
              "topSkills": ["skill1", "skill2"],
              "marketOutlook": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
              "keyTrends": ["trend1", "trend2"],
              "recommendedSkills": ["skill1", "skill2"]
            }
            
            IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
            Include at least 5 common roles for salary ranges.
            Growth rate should be a percentage.
            Include at least 5 skills and trends.
          `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error generating AI insights:', error);
    console.warn('Falling back to default insights');
    return getFallbackInsights(industry);
  }
};

// Fallback function to provide realistic default data
const getFallbackInsights = (industry) => {
  const industryName = industry?.split('-')[0] || 'Technology';
  
  return {
    salaryRanges: [
      {
        role: `${industryName} Analyst`,
        min: 60000,
        max: 120000,
        median: 85000,
        location: "US"
      },
      {
        role: `${industryName} Engineer`,
        min: 75000,
        max: 150000,
        median: 100000,
        location: "US"
      },
      {
        role: `${industryName} Manager`,
        min: 90000,
        max: 180000,
        median: 130000,
        location: "US"
      },
      {
        role: `Senior ${industryName} Specialist`,
        min: 100000,
        max: 200000,
        median: 150000,
        location: "US"
      },
      {
        role: `${industryName} Director`,
        min: 120000,
        max: 250000,
        median: 180000,
        location: "US"
      }
    ],
    growthRate: 12.5,
    demandLevel: "HIGH",
    topSkills: [
      "Problem Solving",
      "Communication",
      "Technical Expertise",
      "Project Management",
      "Data Analysis"
    ],
    marketOutlook: "POSITIVE",
    keyTrends: [
      "Digital Transformation",
      "Remote Work Adoption",
      "Automation & AI Integration",
      "Sustainability Focus",
      "Skills-based Hiring"
    ],
    recommendedSkills: [
      "Leadership",
      "Adaptability",
      "Critical Thinking",
      "Technology Proficiency",
      "Cross-functional Collaboration"
    ]
  };
};

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industry: true,
    },
  });

  if (!user) throw new Error("User not found");
  
  // Check if user has completed onboarding
  if (!user.industryName) {
    throw new Error("User has not completed onboarding. Please complete your profile first.");
  }

  // If no insights exist, generate them
  if (!user.industry) {
    const insights = await generateAIInsights(user.industryName);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industryName,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return industryInsight;
  }

  return user.industry;
}