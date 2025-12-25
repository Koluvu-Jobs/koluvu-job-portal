import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { query } from '../../../lib/db';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Store conversation sessions in memory (in production, use Redis or database)
const conversationSessions = new Map();

export async function POST(req) {
  try {
    const { scriptId, action, userMessage, sessionId } = await req.json();
    
    switch (action) {
      case 'start':
        return await startConversationalInterview(scriptId, sessionId);
      
      case 'chat':
        return await handleConversation(scriptId, sessionId, userMessage);
      
      case 'end':
        return await endConversationalInterview(scriptId, sessionId);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Conversational Interview API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process conversational interview', details: error.message },
      { status: 500 }
    );
  }
}

async function startConversationalInterview(scriptId, sessionId) {
  try {
    // Get script and candidate data
    const scriptResult = await query(`
      SELECT s.*, m.name, m.role, m.experience, m.interview_types, m.skills
      FROM interview_scripts s
      JOIN mock_interview_setups m ON s.setup_id = m.id
      WHERE s.id = $1
    `, [scriptId]);
    
    if (scriptResult.rows.length === 0) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 });
    }
    
    const script = scriptResult.rows[0];
    const candidateInfo = {
      name: script.name,
      role: script.role,
      experience: script.experience,
      interviewTypes: script.interview_types,
      skills: script.skills
    };
    
    // Initialize conversation context
    const conversationContext = {
      scriptId,
      sessionId,
      candidateInfo,
      questions: script.script_data,
      currentQuestionIndex: 0,
      conversationHistory: [],
      interviewPhase: 'greeting', // greeting, questioning, deep_dive, closing
      askedFollowUps: 0,
      maxFollowUps: 2,
      startTime: new Date().toISOString()
    };
    
    // Store session
    conversationSessions.set(sessionId, conversationContext);
      // Generate opening greeting
    const greetingPrompt = `You are an experienced, warm, and professional human interviewer named Sarah. You have a natural conversational style and make candidates feel comfortable while maintaining professionalism.

IMPORTANT PERSONALITY TRAITS:
- Speak like a real human, not a robot
- Use natural filler words occasionally (like "um", "you know", "right")
- Show genuine interest and enthusiasm
- Ask follow-up questions naturally
- React to what the candidate says with appropriate responses

Start the interview with a warm, genuinely human greeting for ${candidateInfo.name} who is interviewing for the ${candidateInfo.role} position (${candidateInfo.experience} level).

INSTRUCTIONS:
1. Greet them by name warmly
2. Introduce yourself as Sarah, their interviewer
3. Thank them for their time
4. Ask them to briefly introduce themselves (keep this part short)
5. Make it feel like talking to a real person, not an AI

TONE: Friendly, professional, conversational, human-like
LENGTH: 2-3 sentences maximum

Example style: "Hi ${candidateInfo.name}! I'm Sarah, really great to meet you. Thanks so much for taking the time to chat with us today about the ${candidateInfo.role} role. Before we dive in, could you give me a quick intro about yourself?"

Respond as if you're a real human interviewer speaking naturally.`;

    const greetingResult = await model.generateContent(greetingPrompt);
    const greeting = await greetingResult.response.text();
    
    // Save greeting to conversation history
    conversationContext.conversationHistory.push({
      speaker: 'interviewer',
      message: greeting,
      timestamp: new Date().toISOString(),
      phase: 'greeting'
    });
    
    return NextResponse.json({
      success: true,
      sessionId,
      message: greeting,
      phase: 'greeting',
      totalQuestions: conversationContext.questions.length
    });
    
  } catch (error) {
    console.error('Error starting conversational interview:', error);
    return NextResponse.json({ error: 'Failed to start interview' }, { status: 500 });
  }
}

async function handleConversation(scriptId, sessionId, userMessage) {
  try {
    const context = conversationSessions.get(sessionId);
    if (!context) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    // Add user message to history
    context.conversationHistory.push({
      speaker: 'candidate',
      message: userMessage,
      timestamp: new Date().toISOString(),
      phase: context.interviewPhase
    });
    
    let aiResponse;
    let nextPhase = context.interviewPhase;
    
    switch (context.interviewPhase) {
      case 'greeting':
        aiResponse = await handleGreetingPhase(context, userMessage);
        nextPhase = 'questioning';
        break;
        
      case 'questioning':
        aiResponse = await handleQuestioningPhase(context, userMessage);
        break;
        
      case 'deep_dive':
        aiResponse = await handleDeepDivePhase(context, userMessage);
        break;
        
      case 'closing':
        aiResponse = await handleClosingPhase(context, userMessage);
        break;
        
      default:
        aiResponse = "I'm sorry, I didn't understand. Could you please repeat that?";
    }
    
    // Update phase
    context.interviewPhase = nextPhase;
    
    // Add AI response to history
    context.conversationHistory.push({
      speaker: 'interviewer',
      message: aiResponse.message,
      timestamp: new Date().toISOString(),
      phase: nextPhase
    });
    
    // Save conversation to database
    await saveConversationTurn(scriptId, sessionId, userMessage, aiResponse.message, nextPhase);
    
    return NextResponse.json({
      success: true,
      message: aiResponse.message,
      phase: nextPhase,
      progress: aiResponse.progress || calculateProgress(context),
      completed: aiResponse.completed || false,
      currentQuestion: context.currentQuestionIndex + 1,
      totalQuestions: context.questions.length
    });
    
  } catch (error) {
    console.error('Error handling conversation:', error);
    return NextResponse.json({ error: 'Failed to process conversation' }, { status: 500 });
  }
}

async function handleGreetingPhase(context, userMessage) {
  const prompt = `You are Sarah, a warm and experienced human interviewer. The candidate just introduced themselves: "${userMessage}"

RESPOND LIKE A REAL HUMAN:
- Acknowledge something specific they mentioned
- Show genuine interest with natural reactions like "Oh, that's interesting!" or "Great!"
- Use natural speech patterns
- Transition smoothly to the first question
- Don't sound robotic or scripted

Current candidate info:
- Name: ${context.candidateInfo.name}
- Role: ${context.candidateInfo.role}
- Experience: ${context.candidateInfo.experience}

First question to ask: "${context.questions[0].question}"

EXAMPLE RESPONSE STYLE:
"Oh, that's really interesting, ${context.candidateInfo.name}! [comment on something they mentioned]. I can see you have some great experience there. Well, let's jump into our first question - I'm curious about [naturally lead into the first question]."

TONE: Natural, conversational, enthusiastic, human-like
Make it sound like a real person is responding, not an AI.`;

  const result = await model.generateContent(prompt);
  const response = await result.response.text();
  
  return {
    message: response,
    progress: 10
  };
}

async function handleQuestioningPhase(context, userMessage) {
  const currentQuestion = context.questions[context.currentQuestionIndex];
    // Determine if we should ask follow-up or move to next question
  const analysisPrompt = `You are analyzing a candidate's answer as a human interviewer would.

Question asked: "${currentQuestion.question}"
Candidate's answer: "${userMessage}"

As a human interviewer, would you:
1. Ask a follow-up to get more details/examples (if the answer seems incomplete, vague, or interesting)
2. Move to the next question (if they gave a complete, detailed answer)

Consider:
- Answer completeness and depth
- Whether they gave specific examples
- If there's something interesting to explore further
- Whether clarification is needed

Respond with ONLY one word:
- "FOLLOWUP" if you'd naturally ask for more details as a human interviewer
- "NEXT" if you're satisfied and would move on`;

  const analysisResult = await model.generateContent(analysisPrompt);
  const decision = (await analysisResult.response.text()).trim().toUpperCase();
  
  if (decision === "FOLLOWUP" && context.askedFollowUps < context.maxFollowUps) {
    // Generate follow-up question
    const followUpPrompt = `You are Sarah, a natural human interviewer. The candidate answered: "${userMessage}" to: "${currentQuestion.question}"

Generate a natural, human follow-up question that shows you're genuinely interested. 

SPEAK LIKE A REAL HUMAN:
- Use natural conversation starters like "That's interesting, can you tell me more about..."
- Show genuine curiosity
- Ask for specific examples or details
- Use natural speech patterns and reactions

EXAMPLES:
- "Oh, that sounds challenging! Can you walk me through how you handled that specific situation?"
- "Interesting approach! I'd love to hear more about [specific part they mentioned]..."
- "That's a great point. Can you give me a concrete example of when you [specific scenario]?"

Make it sound conversational and natural, like how a real person would respond in an interview.`;

    const followUpResult = await model.generateContent(followUpPrompt);
    const followUpResponse = await followUpResult.response.text();
    
    context.askedFollowUps++;
    context.interviewPhase = 'deep_dive';
    
    return {
      message: followUpResponse,
      progress: calculateProgress(context)
    };
  } else {
    // Move to next question
    context.currentQuestionIndex++;
    context.askedFollowUps = 0;
    
    if (context.currentQuestionIndex >= context.questions.length) {
      // Interview completed
      context.interviewPhase = 'closing';
      const closingMessage = `Great, ${context.candidateInfo.name}! You've given me some really thoughtful answers today. I think we've covered all the main questions I had prepared. 

Before we wrap up - is there anything you'd like to ask me about the role, the team, or anything else? Or maybe something about your experience that you feel we haven't touched on yet that you'd like to share?`;
      
      return {
        message: closingMessage,
        progress: 95,
        completed: false
      };
    } else {
      // Ask next question
      const nextQuestion = context.questions[context.currentQuestionIndex];
      const transitionPrompt = `You are Sarah, a natural human interviewer. Smoothly transition from the previous topic to asking: "${nextQuestion.question}"

TRANSITION LIKE A REAL HUMAN:
- Acknowledge their previous answer briefly
- Use natural transition phrases
- Make the flow feel conversational
- Don't sound robotic

EXAMPLES:
- "Perfect, that gives me good insight into your approach. Now, I'm curious about..."
- "Great example! Let me shift gears a bit and ask you about..."
- "That's really helpful context. So moving on to another area..."

Make it natural and conversational.`;

      const transitionResult = await model.generateContent(transitionPrompt);
      const transitionResponse = await transitionResult.response.text();
      
      return {
        message: transitionResponse,
        progress: calculateProgress(context)
      };
    }
  }
}

async function handleDeepDivePhase(context, userMessage) {
  // After follow-up, usually move to next question
  context.interviewPhase = 'questioning';
  return await handleQuestioningPhase(context, userMessage);
}

async function handleClosingPhase(context, userMessage) {
  const closingPrompt = `You are Sarah, a warm human interviewer. The candidate just responded: "${userMessage}" to closing questions.

RESPOND AS A REAL HUMAN:
- Thank them genuinely and warmly
- Mention something specific they shared that impressed you
- Give realistic next steps
- End on an encouraging, positive note
- Use natural, conversational language

EXAMPLE RESPONSE STYLE:
"Thank you so much for sharing that, ${context.candidateInfo.name}. I really enjoyed our conversation today, especially hearing about [mention something specific]. You clearly have some great experience with [relevant area]. 

We'll be wrapping up interviews this week and I'll make sure to get back to you by early next week with next steps. Thanks again for your time today - it was really great talking with you!"

Make it sound genuine and human, like how you'd actually end a real interview.`;

  const result = await model.generateContent(closingPrompt);
  const response = await result.response.text();
  
  return {
    message: response,
    progress: 100,
    completed: true
  };
}

function calculateProgress(context) {
  const questionProgress = (context.currentQuestionIndex / context.questions.length) * 80;
  const phaseProgress = context.interviewPhase === 'closing' ? 15 : 5;
  return Math.min(95, questionProgress + phaseProgress);
}

async function saveConversationTurn(scriptId, sessionId, userMessage, aiResponse, phase) {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS conversation_turns (
        id SERIAL PRIMARY KEY,
        script_id INTEGER REFERENCES interview_scripts(id) ON DELETE CASCADE,
        session_id VARCHAR(255) NOT NULL,
        user_message TEXT,
        ai_response TEXT,
        phase VARCHAR(50),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await query(
      `INSERT INTO conversation_turns 
       (script_id, session_id, user_message, ai_response, phase, timestamp) 
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [scriptId, sessionId, userMessage, aiResponse, phase]
    );
  } catch (error) {
    console.error('Error saving conversation turn:', error);
  }
}

async function endConversationalInterview(scriptId, sessionId) {
  try {
    const context = conversationSessions.get(sessionId);
    if (context) {
      // Clean up session
      conversationSessions.delete(sessionId);
      
      // Save final session data
      await query(`
        CREATE TABLE IF NOT EXISTS interview_sessions (
          id SERIAL PRIMARY KEY,
          script_id INTEGER REFERENCES interview_scripts(id) ON DELETE CASCADE,
          session_id VARCHAR(255) NOT NULL,
          completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          total_questions INTEGER,
          questions_answered INTEGER,
          conversation_data JSONB
        )
      `);
      
      await query(
        `INSERT INTO interview_sessions 
         (script_id, session_id, total_questions, questions_answered, conversation_data) 
         VALUES ($1, $2, $3, $4, $5)`,
        [scriptId, sessionId, context.questions.length, context.currentQuestionIndex, JSON.stringify(context.conversationHistory)]
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Interview session ended successfully'
    });
  } catch (error) {
    console.error('Error ending interview:', error);
    return NextResponse.json({ error: 'Failed to end interview' }, { status: 500 });
  }
}
