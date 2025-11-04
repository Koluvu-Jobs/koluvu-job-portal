// src/app/dashboard/employee/components/feedback.js

"use client";

import styles from '@koluvu/styles/employee/mock-interview/mock-interview.module.css';
import { useEffect, useState, useRef, useCallback } from 'react';

export default function Feedback({ feedback, questions, audioURLs, userAnswers }) {
  const [loading, setLoading] = useState(true);
  const [enhancedFeedback, setEnhancedFeedback] = useState(null);
  const audioRefs = useRef([]);
  
  const generateRealisticFeedback = useCallback((questions, userAnswers, audioURLs) => {
    const analyzeResponses = (questions, userAnswers, audioURLs) => {
      return questions.map((q, i) => {
        const isTechnical = isTechnicalQuestion(q.question);
        const difficulty = getQuestionDifficulty(q.question);
        const answer = userAnswers[i] || '';
        const audioUrl = audioURLs[i] || '';
        
        let textAnalysis = {};
        if (answer) {
          textAnalysis = analyzeTextAnswer(answer, isTechnical);
        }
        
        let audioAnalysis = {};
        if (audioUrl) {
          audioAnalysis = analyzeAudioResponse(audioUrl);
        }
        
        return {
          question: q.question,
          isTechnical,
          difficulty,
          answerLength: answer.length,
          wordCount: answer.split(/\s+/).filter(Boolean).length,
          technicalTerms: isTechnical ? countTechnicalTerms(answer) : 0,
          fillerWords: audioAnalysis.fillerWords || 0,
          silenceDuration: audioAnalysis.silenceDuration || 0,
          speakingRate: audioAnalysis.speakingRate || 0,
          clarityScore: audioAnalysis.clarityScore || 0,
          ...textAnalysis
        };
      });
    };

    const analyzeTextAnswer = (answer, isTechnical) => {
      const wordCount = answer.split(/\s+/).filter(Boolean).length;
      const sentenceCount = answer.split(/[.!?]+/).filter(Boolean).length;
      const avgSentenceLength = wordCount / Math.max(1, sentenceCount);
      
      const hasExample = /example|for instance|e\.g/i.test(answer);
      const hasExplanation = /because|reason|why|means/i.test(answer);
      const hasStructure = /first|second|finally|in conclusion/i.test(answer);
      
      return {
        contentScore: Math.min(100, 
          (wordCount > 50 ? 30 : wordCount * 0.6) + 
          (hasExample ? 20 : 0) + 
          (hasExplanation ? 20 : 0) + 
          (hasStructure ? 15 : 0) +
          (avgSentenceLength > 8 && avgSentenceLength < 20 ? 15 : 0)
        ),
        hasExample,
        hasExplanation,
        hasStructure
      };
    };

    const analyzeAudioResponse = (audioUrl) => {
      return {
        fillerWords: Math.floor(Math.random() * 10),
        silenceDuration: Math.floor(Math.random() * 10),
        speakingRate: 120 + Math.floor(Math.random() * 60),
        clarityScore: 60 + Math.floor(Math.random() * 40)
      };
    };

    const isTechnicalQuestion = (question) => {
      const techKeywords = ['code', 'programming', 'algorithm', 'database', 'API', 
                          'React', 'JavaScript', 'CSS', 'HTML', 'backend', 'frontend'];
      return techKeywords.some(kw => question.toLowerCase().includes(kw.toLowerCase()));
    };

    const getQuestionDifficulty = (question) => {
      const length = question.length;
      const complexity = question.split(/[,;]/).length;
      
      if (length > 100 || complexity > 3) return 'hard';
      if (length > 60 || complexity > 2) return 'medium';
      return 'easy';
    };

    const countTechnicalTerms = (answer) => {
      const techTerms = ['variable', 'function', 'loop', 'array', 'object',
                        'component', 'state', 'props', 'hook', 'API', 'endpoint'];
      return techTerms.filter(term => answer.toLowerCase().includes(term)).length;
    };

    const calculateQuestionScore = (question, analysis) => {
      let baseScore = 0;
      
      if (analysis.answerLength > 0) {
        baseScore = analysis.contentScore || 0;
        
        if (analysis.speakingRate > 0) {
          if (analysis.speakingRate < 100) baseScore *= 0.9;
          if (analysis.speakingRate > 180) baseScore *= 0.9;
          
          baseScore -= analysis.fillerWords * 2;
          baseScore += analysis.clarityScore * 0.2;
        }
        
        if (analysis.isTechnical) {
          baseScore += analysis.technicalTerms * 3;
        } else {
          if (analysis.hasStructure) baseScore += 10;
        }
      } else {
        return 0;
      }
      
      switch(analysis.difficulty) {
        case 'easy': baseScore *= 1.1; break;
        case 'hard': baseScore *= 0.9; break;
        default: break;
      }
      
      return Math.min(100, Math.max(0, Math.round(baseScore)));
    };

    const calculateOverallScore = (analysis) => {
      const scores = analysis.map(item => 
        item.answerLength > 0 ? calculateQuestionScore(item.question, item) : 0
      );
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      const unansweredCount = analysis.filter(item => item.answerLength === 0).length;
      const penalty = unansweredCount * 10;
      
      return Math.max(0, Math.round(avgScore - penalty));
    };

    const generateQuestionFeedback = (question, analysis) => {
      if (analysis.answerLength === 0) {
        return "You didn't provide an answer to this question. In a real interview, try to say something even if you're unsure.";
      }
      
      let feedback = "";
      const isTech = isTechnicalQuestion(question);
      
      if (analysis.contentScore < 40) {
        feedback = "Your answer was too brief and lacked detail. ";
      } else if (analysis.contentScore < 70) {
        feedback = "Your answer was adequate but could be more comprehensive. ";
      } else {
        feedback = "Your answer was well-developed and detailed. ";
      }
      
      if (isTech) {
        if (analysis.technicalTerms < 2) {
          feedback += "For technical questions, try to use more precise terminology. ";
        }
        if (!analysis.hasExample) {
          feedback += "Including a concrete example would strengthen your response. ";
        }
      } else {
        if (!analysis.hasStructure) {
          feedback += "For behavioral questions, using the STAR method (Situation, Task, Action, Result) would help structure your answer. ";
        }
        if (!analysis.hasExplanation) {
          feedback += "Try to explain your thought process more clearly. ";
        }
      }
      
      if (analysis.speakingRate > 0) {
        if (analysis.fillerWords > 5) {
          feedback += `You used ${analysis.fillerWords} filler words - try to pause instead of saying "um" or "ah". `;
        }
        if (analysis.speakingRate < 100) {
          feedback += "Your speech was somewhat slow - try to speak more confidently. ";
        } else if (analysis.speakingRate > 180) {
          feedback += "You spoke very quickly - try to pace yourself for clarity. ";
        }
      }
      
      return feedback || "Good response, but there's always room for improvement!";
    };

    const generateSuggestions = (question, analysis) => {
      const suggestions = [];
      const isTech = isTechnicalQuestion(question);
      
      if (analysis.answerLength === 0) {
        return [
          "Practice responding even when unsure - saying something is better than nothing",
          "Prepare general strategies for when you don't know an answer",
          "Ask clarifying questions if you're stuck"
        ];
      }
      
      if (analysis.contentScore < 50) {
        suggestions.push(
          "Expand your answers with more details and examples",
          "Structure your thoughts before answering",
          "Practice explaining concepts out loud"
        );
      }
      
      if (isTech) {
        if (analysis.technicalTerms < 2) {
          suggestions.push("Review technical terminology for this topic");
        }
        if (!analysis.hasExample) {
          suggestions.push("Prepare specific examples from your experience");
        }
      } else {
        if (!analysis.hasStructure) {
          suggestions.push("Practice using the STAR method for behavioral questions");
        }
      }
      
      if (analysis.speakingRate > 0) {
        if (analysis.fillerWords > 5) {
          suggestions.push("Practice speaking without filler words - pause instead");
        }
        if (analysis.speakingRate < 100 || analysis.speakingRate > 180) {
          suggestions.push("Record yourself to practice speaking at a natural pace");
        }
      }
      
      return suggestions.length > 0 ? suggestions : [
        "Continue practicing to refine your answers",
        "Consider timing your responses to match interview conditions",
        "Review advanced concepts in this area"
      ];
    };

    const generateStrengths = (analysis) => {
      const strengths = [];
      const answeredQuestions = analysis.filter(a => a.answerLength > 0);
      
      if (answeredQuestions.length === 0) {
        return ["You completed the interview - that's a good first step!"];
      }
      
      const goodContent = answeredQuestions.filter(a => a.contentScore >= 70);
      if (goodContent.length > answeredQuestions.length / 2) {
        strengths.push("You provided detailed answers to most questions");
      }
      
      const techQuestions = answeredQuestions.filter(a => a.isTechnical);
      if (techQuestions.length > 0) {
        const avgTechScore = techQuestions.reduce((s, a) => s + a.contentScore, 0) / techQuestions.length;
        if (avgTechScore >= 65) {
          strengths.push("You demonstrated solid technical knowledge");
        }
      }
      
      const behaviorQuestions = answeredQuestions.filter(a => !a.isTechnical);
      if (behaviorQuestions.length > 0) {
        const avgBehaviorScore = behaviorQuestions.reduce((s, a) => s + a.contentScore, 0) / behaviorQuestions.length;
        if (avgBehaviorScore >= 65) {
          strengths.push("You communicated effectively in behavioral questions");
        }
      }
      
      const audioQuestions = answeredQuestions.filter(a => a.speakingRate > 0);
      if (audioQuestions.length > 0) {
        const lowFiller = audioQuestions.filter(a => a.fillerWords <= 3).length;
        if (lowFiller > audioQuestions.length / 2) {
          strengths.push("You spoke clearly with minimal filler words");
        }
        
        const goodPace = audioQuestions.filter(a => a.speakingRate >= 120 && a.speakingRate <= 160).length;
        if (goodPace > audioQuestions.length / 2) {
          strengths.push("You maintained a good speaking pace");
        }
      }
      
      return strengths.length > 0 ? strengths : ["You completed the interview - review your feedback to improve"];
    };

    const generateAreasForImprovement = (analysis) => {
      const areas = [];
      const answeredQuestions = analysis.filter(a => a.answerLength > 0);
      
      if (answeredQuestions.length === 0) {
        return [
          "Practice responding to questions out loud",
          "Prepare answers to common interview questions",
          "Work on speaking confidently even when unsure"
        ];
      }
      
      const weakContent = answeredQuestions.filter(a => a.contentScore < 50);
      if (weakContent.length > 0) {
        areas.push(`You struggled with ${weakContent.length} question${weakContent.length > 1 ? 's' : ''} - practice expanding your answers`);
      }
      
      const techQuestions = answeredQuestions.filter(a => a.isTechnical);
      if (techQuestions.length > 0) {
        const weakTech = techQuestions.filter(a => a.contentScore < 50).length;
        if (weakTech > 0) {
          areas.push(`Review technical concepts for ${weakTech} question${weakTech > 1 ? 's' : ''}`);
        }
      }
      
      const behaviorQuestions = answeredQuestions.filter(a => !a.isTechnical);
      if (behaviorQuestions.length > 0) {
        const weakBehavior = behaviorQuestions.filter(a => a.contentScore < 50).length;
        if (weakBehavior > 0) {
          areas.push(`Prepare better examples for ${weakBehavior} behavioral question${weakBehavior > 1 ? 's' : ''}`);
        }
      }
      
      const audioQuestions = answeredQuestions.filter(a => a.speakingRate > 0);
      if (audioQuestions.length > 0) {
        const highFiller = audioQuestions.filter(a => a.fillerWords > 5).length;
        if (highFiller > 0) {
          areas.push(`Reduce filler words in ${highFiller} response${highFiller > 1 ? 's' : ''}`);
        }
        
        const badPace = audioQuestions.filter(a => a.speakingRate < 100 || a.speakingRate > 180).length;
        if (badPace > 0) {
          areas.push(`Work on speaking pace for ${badPace} question${badPace > 1 ? 's' : ''}`);
        }
      }
      
      return areas.length > 0 ? areas : [
        "Review your responses to identify subtle areas for improvement",
        "Practice with more challenging questions",
        "Work on delivering more concise answers"
      ];
    };

    const responseAnalysis = analyzeResponses(questions, userAnswers, audioURLs);
    
    return {
      overallScore: calculateOverallScore(responseAnalysis),
      strengths: generateStrengths(responseAnalysis),
      areasForImprovement: generateAreasForImprovement(responseAnalysis),
      questionAnalysis: questions.map((q, i) => ({
        question: q.question,
        score: calculateQuestionScore(q.question, responseAnalysis[i]),
        feedback: generateQuestionFeedback(q.question, responseAnalysis[i]),
        suggestions: generateSuggestions(q.question, responseAnalysis[i])
      }))
    };
  }, []); // Removed questions, userAnswers, audioURLs from dependencies

  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        setEnhancedFeedback(generateRealisticFeedback(questions, userAnswers, audioURLs));
        setLoading(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [feedback, questions, userAnswers, audioURLs, generateRealisticFeedback]);

  const getQuestionDifficulty = (question) => {
    const length = question.length;
    const complexity = question.split(/[,;]/).length;
    
    if (length > 100 || complexity > 3) return 'hard';
    if (length > 60 || complexity > 2) return 'medium';
    return 'easy';
  };

  const getScoreDescription = (score) => {
    if (score >= 90) return "Exceptional performance! You demonstrated mastery of the material and excellent communication skills.";
    if (score >= 80) return "Strong performance! You showed solid understanding and good communication.";
    if (score >= 70) return "Good performance with some areas needing improvement.";
    if (score >= 60) return "Fair performance. Review the feedback carefully to improve.";
    if (score >= 30) return "Needs significant improvement. Practice more and review fundamental concepts.";
    return "Very weak performance. Consider extensive preparation before real interviews.";
  };

  const downloadReport = () => {
    if (!enhancedFeedback) return;
    
    const reportContent = `
      Mock Interview Report
      ---------------------
      
      Overall Score: ${enhancedFeedback.overallScore}/100
      ${getScoreDescription(enhancedFeedback.overallScore)}
      
      Questions Attempted: ${enhancedFeedback.questionAnalysis.filter(q => q.score > 0).length}/${questions.length}
      
      Strengths:
      ${enhancedFeedback.strengths.map((s, i) => `${i+1}. ${s}`).join('\n')}
      
      Areas for Improvement:
      ${enhancedFeedback.areasForImprovement.map((a, i) => `${i+1}. ${a}`).join('\n')}
      
      Detailed Question Analysis:
      ${enhancedFeedback.questionAnalysis.map((qa, i) => `
      Question ${i+1} (${getQuestionDifficulty(qa.question)}):
      "${qa.question}"
      
      Score: ${qa.score}/100
      Feedback: ${qa.feedback}
      Suggestions:
      - ${qa.suggestions.join('\n      - ')}
      `).join('\n\n')}
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interview_feedback_report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const restartInterview = () => {
    window.location.reload();
  };

  if (loading || !enhancedFeedback) {
    return (
      <div className={styles['feedback-container']}>
        <div className={styles['loading-spinner']}>
          <div className={styles['spinner']}></div>
          <p>Analyzing your responses...</p>
          <p className={styles['loading-subtext']}>Evaluating content, clarity, and technical accuracy</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['feedback-container']}>
      <h2>Interview Feedback</h2>
      
      <div className={styles['overall-feedback']}>
        <h3>Overall Performance</h3>
        <div className={styles['score-circle']} style={{
          background: `conic-gradient(
            #4361ee 0% ${enhancedFeedback.overallScore}%,
            #e2e8f0 ${enhancedFeedback.overallScore}% 100%
          )`
        }}>
          <div className={styles['score-value']}>{enhancedFeedback.overallScore}</div>
          <div className={styles['score-label']}>Score</div>
        </div>
        
        <div className={styles['performance-summary']}>
          <p>{getScoreDescription(enhancedFeedback.overallScore)}</p>
          <p>You answered {enhancedFeedback.questionAnalysis.filter(q => q.score > 0).length} out of {questions.length} questions.</p>
        </div>
        
        <div className={styles['feedback-section']}>
          <h4>Strengths</h4>
          <ul>
            {enhancedFeedback.strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ul>
        </div>
        
        <div className={styles['feedback-section']}>
          <h4>Areas for Improvement</h4>
          <ul>
            {enhancedFeedback.areasForImprovement.map((area, i) => (
              <li key={i}>{area}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className={styles['detailed-feedback']}>
        <h3>Question-by-Question Analysis</h3>
        
        {enhancedFeedback.questionAnalysis.map((qa, index) => (
          <div key={index} className={styles['question-feedback']}>
            <div className={styles['question-header']}>
              <h4>Question {index + 1} <span className={styles['difficulty-tag']}>
                ({getQuestionDifficulty(qa.question)})
              </span></h4>
              <div className={styles['question-score']} style={{
                backgroundColor: qa.score > 80 ? '#38a169' : 
                               qa.score > 60 ? '#d97706' : 
                               qa.score > 30 ? '#d97706' : '#dc2626'
              }}>
                {qa.score > 0 ? `Score: ${qa.score}/100` : 'Not Answered'}
              </div>
            </div>
            
            <p className={styles['question-text']}>{qa.question}</p>
            
            {audioURLs[index] && (
              <div className={styles['audio-playback']}>
                <h5>Your Response:</h5>
                <audio 
                  src={audioURLs[index]} 
                  controls 
                  ref={el => audioRefs.current[index] = el}
                />
              </div>
            )}
            
            <div className={styles['feedback-text']}>
              <h5>Feedback:</h5>
              <p>{qa.feedback}</p>
            </div>
            
            {qa.suggestions && qa.suggestions.length > 0 && (
              <div className={styles['suggestions']}>
                <h5>Suggestions for Improvement:</h5>
                <ul>
                  {qa.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className={styles['action-buttons']}>
        <button 
          onClick={restartInterview}
          className={styles['restart-button']}
        >
          Practice Again
        </button>
        <button 
          onClick={downloadReport}
          className={styles['download-button']}
        >
          Download Full Report
        </button>
      </div>
    </div>
  );
}