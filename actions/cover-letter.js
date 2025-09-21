"use server";

import { db } from "@/lib/prisma";
import { checkUser } from "@/lib/checkUser";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getCoverLetters() {
  try {
    const user = await checkUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const coverLetters = await db.coverLetter.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return coverLetters;
  } catch (error) {
    console.error("Error getting cover letters:", error);
    throw new Error("Failed to fetch cover letters");
  }
}

export async function deleteCoverLetter(id) {
  try {
    const user = await checkUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // First check if the cover letter belongs to the user
    const coverLetter = await db.coverLetter.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!coverLetter) {
      throw new Error("Cover letter not found or you don't have permission to delete it");
    }

    // Delete the cover letter
    await db.coverLetter.delete({
      where: {
        id,
      },
    });

    // Revalidate the page to show updated data
    revalidatePath("/ai-cover-letter");
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting cover letter:", error);
    throw new Error(error.message || "Failed to delete cover letter");
  }
}

export async function createCoverLetter(data) {
  try {
    const user = await checkUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const { content, jobDescription, companyName, jobTitle } = data;

    const coverLetter = await db.coverLetter.create({
      data: {
        content,
        jobDescription,
        companyName,
        jobTitle,
        userId: user.id,
      },
    });

    revalidatePath("/ai-cover-letter");
    
    return coverLetter;
  } catch (error) {
    console.error("Error creating cover letter:", error);
    throw new Error("Failed to create cover letter");
  }
}

export async function getCoverLetterById(id) {
  try {
    const user = await checkUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const coverLetter = await db.coverLetter.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!coverLetter) {
      throw new Error("Cover letter not found or you don't have permission to view it");
    }

    return coverLetter;
  } catch (error) {
    console.error("Error getting cover letter:", error);
    throw new Error("Failed to fetch cover letter");
  }
}

export async function updateCoverLetter(id, data) {
  try {
    const user = await checkUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    // First check if the cover letter belongs to the user
    const existingCoverLetter = await db.coverLetter.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingCoverLetter) {
      throw new Error("Cover letter not found or you don't have permission to update it");
    }

    const { content, jobDescription, companyName, jobTitle } = data;

    const coverLetter = await db.coverLetter.update({
      where: {
        id,
      },
      data: {
        content,
        jobDescription,
        companyName,
        jobTitle,
      },
    });

    revalidatePath("/ai-cover-letter");
    revalidatePath(`/ai-cover-letter/${id}`);
    
    return coverLetter;
  } catch (error) {
    console.error("Error updating cover letter:", error);
    throw new Error(error.message || "Failed to update cover letter");
  }
}

// Alias for getCoverLetterById to match import expectations
export const getCoverLetter = getCoverLetterById;

export async function generateCoverLetter({ jobTitle, companyName, jobDescription, personalizedContent }) {
  try {
    const user = await checkUser();
    
    if (!user) {
      throw new Error("User not authenticated");
    }

    const prompt = `
      Write a professional cover letter for the following position:
      
      Job Title: ${jobTitle}
      Company: ${companyName}
      ${jobDescription ? `Job Description: ${jobDescription}` : ""}
      
      Candidate Background:
      - Name: ${user.name}
      - Industry: ${user.industryName || "Professional"}
      - Experience: ${user.experience || "Professional"} years
      - Skills: ${user.skills?.join(", ") || "Various professional skills"}
      ${user.bio ? `- Bio: ${user.bio}` : ""}
      ${personalizedContent ? `\nAdditional Information: ${personalizedContent}` : ""}
      
      Requirements:
      1. Write a compelling opening paragraph that captures attention
      2. Highlight relevant experience and skills for this specific role
      3. Show knowledge of the company (if possible from context)
      4. Include specific achievements with quantifiable results when possible
      5. End with a strong call to action
      6. Keep it concise (3-4 paragraphs)
      7. Use professional tone and format
      8. Make it ATS-friendly
      
      Format the cover letter with proper structure:
      - Date
      - Company Address (placeholder)
      - Salutation
      - Body paragraphs
      - Professional closing
      - Signature line
      
      Make it personalized and engaging while maintaining professionalism.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text();

    // Save the cover letter
    const coverLetter = await db.coverLetter.create({
      data: {
        userId: user.id,
        jobTitle,
        companyName,
        jobDescription: jobDescription || "",
        content,
      },
    });

    revalidatePath("/ai-cover-letter");
    return { success: true, content, id: coverLetter.id };
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter");
  }
}


