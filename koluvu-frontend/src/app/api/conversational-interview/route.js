import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Store conversation sessions in memory (in production, use Redis or database)
const conversationSessions = new Map();

export async function POST(req) {
  try {
    const { scriptId, action, userMessage, sessionId } = await req.json();

    switch (action) {
      case "start":
        return await startConversationalInterview(scriptId, sessionId);

      case "chat":
        return await handleConversation(scriptId, sessionId, userMessage);

      case "end":
        return await endConversationalInterview(scriptId, sessionId);

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Conversational Interview API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process conversational interview",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

async function startConversationalInterview(scriptId, sessionId) {
  try {
    // Get script and candidate data
    const scriptResult = await query(
      `
      SELECT s.*, m.name, m.role, m.experience, m.interview_types, m.skills
      FROM interview_scripts s
      JOIN mock_interview_setups m ON s.setup_id = m.id
      WHERE s.id = $1
    `,
      [scriptId]
    );

    if (scriptResult.rows.length === 0) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    const scriptData = scriptResult.rows[0];
    const questions = JSON.parse(scriptData.questions_data);

    // Initialize conversation session
    conversationSessions.set(sessionId, {
      scriptId,
      questions,
      currentQuestionIndex: 0,
      conversationHistory: [],
      candidateData: {
        name: scriptData.name,
        role: scriptData.role,
        experience: scriptData.experience,
        interview_types: scriptData.interview_types,
        skills: scriptData.skills,
      },
      startTime: new Date(),
    });

    // Start with first question
    const firstQuestion = questions[0];
    const session = conversationSessions.get(sessionId);
    session.conversationHistory.push({
      role: "interviewer",
      content: firstQuestion.question,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: firstQuestion.question,
      questionData: firstQuestion,
      totalQuestions: questions.length,
      currentQuestion: 1,
    });
  } catch (error) {
    console.error("Error starting conversational interview:", error);
    return NextResponse.json(
      { error: "Failed to start interview", details: error.message },
      { status: 500 }
    );
  }
}

async function handleConversation(scriptId, sessionId, userMessage) {
  try {
    const session = conversationSessions.get(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Add user message to history
    session.conversationHistory.push({
      role: "candidate",
      content: userMessage,
      timestamp: new Date(),
    });

    // Generate AI response based on conversation context
    const conversationContext = session.conversationHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const currentQuestion = session.questions[session.currentQuestionIndex];

    const prompt = `You are conducting a technical interview. Here's the context:

Candidate: ${session.candidateData.name}
Role: ${session.candidateData.role}
Experience: ${session.candidateData.experience}

Current Question: ${currentQuestion.question}
Expected Skills: ${currentQuestion.skills.join(", ")}

Conversation so far:
${conversationContext}

As an interviewer, provide a natural follow-up response. You can:
1. Ask for clarification or deeper details
2. Provide encouragement and move to next question
3. Ask follow-up questions based on their answer
4. Give constructive feedback

Keep your response conversational and professional. If the candidate has adequately answered, you can transition to the next question.

Response:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = await response.text();

    // Add AI response to history
    session.conversationHistory.push({
      role: "interviewer",
      content: aiResponse,
      timestamp: new Date(),
    });

    // Check if we should move to next question (simple heuristic)
    const shouldMoveToNext =
      aiResponse.toLowerCase().includes("next question") ||
      aiResponse.toLowerCase().includes("moving on") ||
      session.conversationHistory.filter(
        (msg) =>
          msg.role === "candidate" &&
          msg.content.includes(currentQuestion.question)
      ).length > 3;

    if (
      shouldMoveToNext &&
      session.currentQuestionIndex < session.questions.length - 1
    ) {
      session.currentQuestionIndex++;
      const nextQuestion = session.questions[session.currentQuestionIndex];

      session.conversationHistory.push({
        role: "interviewer",
        content: nextQuestion.question,
        timestamp: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: `${aiResponse}\n\n${nextQuestion.question}`,
        questionData: nextQuestion,
        totalQuestions: session.questions.length,
        currentQuestion: session.currentQuestionIndex + 1,
      });
    }

    return NextResponse.json({
      success: true,
      message: aiResponse,
      questionData: currentQuestion,
      totalQuestions: session.questions.length,
      currentQuestion: session.currentQuestionIndex + 1,
    });
  } catch (error) {
    console.error("Error handling conversation:", error);
    return NextResponse.json(
      { error: "Failed to process conversation", details: error.message },
      { status: 500 }
    );
  }
}

async function endConversationalInterview(scriptId, sessionId) {
  try {
    const session = conversationSessions.get(sessionId);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Calculate interview duration
    const endTime = new Date();
    const duration = Math.round((endTime - session.startTime) / 1000); // in seconds

    // Generate final feedback
    const conversationSummary = session.conversationHistory
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const feedbackPrompt = `Please provide constructive feedback for this technical interview:

Candidate: ${session.candidateData.name}
Role: ${session.candidateData.role}
Experience: ${session.candidateData.experience}

Interview Transcript:
${conversationSummary}

Provide feedback in the following format:
STRENGTHS:
- [List 3-5 strengths]

AREAS FOR IMPROVEMENT:
- [List 3-5 areas to improve]

OVERALL ASSESSMENT:
[Brief overall assessment]

RECOMMENDATION:
[Hiring recommendation with reasoning]`;

    const result = await model.generateContent(feedbackPrompt);
    const response = await result.response;
    const feedback = await response.text();

    // Store session results (you might want to save this to database)
    const sessionResult = {
      scriptId,
      sessionId,
      duration,
      questionsAnswered: session.currentQuestionIndex + 1,
      totalQuestions: session.questions.length,
      feedback,
      conversationHistory: session.conversationHistory,
      endTime,
    };

    // Update session status in database
    await query(
      "UPDATE mock_interview_sessions SET session_status = $1, completed_at = NOW() WHERE id = $2",
      ["completed", sessionId]
    );

    // Clean up memory
    conversationSessions.delete(sessionId);

    return NextResponse.json({
      success: true,
      message: "Interview completed successfully",
      results: sessionResult,
      feedback,
    });
  } catch (error) {
    console.error("Error ending conversational interview:", error);
    return NextResponse.json(
      { error: "Failed to end interview", details: error.message },
      { status: 500 }
    );
  }
}
