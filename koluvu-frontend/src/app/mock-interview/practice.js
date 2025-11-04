// src/app/main/mock-interview/practice.js

'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Feedback from './feedback';
import styles from '@koluvu/styles/employee/mock-interview/mock-interview.module.css';

export default function InterviewPractice({ config }) {
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(180);
  const [timerActive, setTimerActive] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [videoURL, setVideoURL] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoChunksRef = useRef([]);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Question generators by category and difficulty
  const questionGenerators = useMemo(() => ({
    technical: {
      easy: [
        () => 'Explain what a variable is in programming.',
        () => 'What is the difference between == and === in JavaScript?',
        () => 'How would you center a div using CSS?',
        () => 'What does HTML stand for?',
        () => 'Name three basic data types in programming.',
        () => 'What is a function in programming?',
        () => 'How do you declare a constant in JavaScript?',
        () => 'What is the purpose of a for loop?',
        () => 'Explain what an array is.',
        () => 'What is the box model in CSS?',
      ],
      medium: [
        () => 'Explain the concept of closures in JavaScript.',
        () => 'How would you optimize a slow database query?',
        () => 'Describe the difference between REST and GraphQL.',
        () => 'What is the Virtual DOM in React?',
        () => 'Explain how promises work in JavaScript.',
        () => 'What are the main principles of object-oriented programming?',
        () => 'How would you implement responsive design?',
        () => 'Explain the concept of middleware in Express.js.',
        () => 'What are the differences between SQL and NoSQL databases?',
        () => 'How does authentication differ from authorization?',
      ],
      hard: [
        () => 'Explain the React component lifecycle methods.',
        () => 'How would you implement a debounce function from scratch?',
        () =>
          'Describe how you would scale a web application to handle millions of users.',
        () => 'Explain the concept of memoization and provide an example.',
        () =>
          'How would you optimize frontend performance for a large-scale application?',
        () =>
          'Explain the differences between monolith and microservices architectures.',
        () => 'Describe how you would implement a real-time chat application.',
        () =>
          'Explain the concept of dependency injection in software design.',
        () => 'How would you handle cross-origin resource sharing (CORS) issues?',
        () =>
          'Describe the CAP theorem and its implications for database design.',
      ],
    },
    behavioral: {
      easy: [
        () => 'Tell me about yourself.',
        () => 'Why do you want to work at this company?',
        () => 'What are your strengths?',
        () => 'What are your weaknesses?',
        () => 'Where do you see yourself in 5 years?',
        () => 'Why should we hire you?',
        () => 'What motivates you?',
        () => 'How do you handle stress?',
        () => 'What are you passionate about?',
        () => 'Describe your ideal work environment.',
      ],
      medium: [
        () => 'Tell me about a time you had a conflict with a team member.',
        () => 'Describe a challenging project you worked on.',
        () => 'How do you handle tight deadlines?',
        () =>
          'Tell me about a time you made a mistake and how you handled it.',
        () => 'Describe a time you had to learn something new quickly.',
        () => 'Tell me about a time you had to persuade someone.',
        () => 'Describe a situation where you had to take initiative.',
        () => 'Tell me about a time you failed and what you learned.',
        () => 'Describe a time you had to work with a difficult person.',
        () => 'Tell me about a time you had to adapt to change.',
      ],
      hard: [
        () => 'Tell me about a time you had to make an unpopular decision.',
        () => 'Describe a situation where you had to challenge the status quo.',
        () => 'Tell me about a time you had to manage competing priorities.',
        () => 'Describe a time you had to deliver bad news to your team.',
        () =>
          'Tell me about a time you had to convince your manager to try a new approach.',
        () =>
          'Describe a situation where you had to lead without formal authority.',
        () => 'Tell me about a time you had to recover from a major setback.',
        () => 'Describe a time you had to innovate to solve a problem.',
        () => 'Tell me about a time you had to manage a crisis.',
        () =>
          'Describe a situation where you had to balance short-term and long-term goals.',
      ],
    },
  }), []);

  // Get random questions from a category
  const getRandomQuestions = useCallback(
    (type, difficulty, count) => {
      const availableQuestions = [...questionGenerators[type][difficulty]];
      const selectedQuestions = [];

      // If we need more questions than available, use all available
      if (count >= availableQuestions.length) {
        return availableQuestions.map((q) => q());
      }

      // Select random unique questions
      while (
        selectedQuestions.length < count &&
        availableQuestions.length > 0
      ) {
        const randomIndex = Math.floor(
          Math.random() * availableQuestions.length
        );
        const questionGenerator = availableQuestions.splice(randomIndex, 1)[0];
        selectedQuestions.push(questionGenerator());
      }

      return selectedQuestions;
    },
    [questionGenerators]
  );

  // Shuffle array
  const shuffleArray = useCallback((array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);

  // Generate questions based on configuration
  const generateQuestions = useCallback(
    (config) => {
      const { difficulty, interviewType } = config;
      let questionPool = [];
      let questionCount = 0;

      // Determine number of questions based on difficulty
      switch (difficulty) {
        case 'easy':
          questionCount = 5;
          break;
        case 'medium':
          questionCount = 7;
          break;
        case 'hard':
          questionCount = 10;
          break;
        default:
          questionCount = 5;
      }

      // For mixed interviews, combine technical and behavioral questions
      if (interviewType === 'mixed') {
        const techCount = Math.ceil(questionCount * 0.6);
        const behaviorCount = questionCount - techCount;

        const techQuestions = getRandomQuestions('technical', difficulty, techCount);
        const behaviorQuestions = getRandomQuestions(
          'behavioral',
          difficulty,
          behaviorCount
        );

        questionPool = [...techQuestions, ...behaviorQuestions];
      } else {
        questionPool = getRandomQuestions(interviewType, difficulty, questionCount);
      }

      // Shuffle questions for mixed interviews
      if (interviewType === 'mixed') {
        questionPool = shuffleArray(questionPool);
      }

      return questionPool.map((q) => ({ question: q }));
    },
    [getRandomQuestions, shuffleArray]
  );

  // Load questions based on config
  useEffect(() => {
    const loadedQuestions = generateQuestions(config);
    setQuestions(loadedQuestions);
    setUserAnswers(Array(loadedQuestions.length).fill(''));
    if (loadedQuestions.length > 0) {
      setCurrentQuestion(loadedQuestions[0].question);
    }
    setTimerActive(true);
  }, [config, generateQuestions]);

  // Timer effect
  useEffect(() => {
    if (!timerActive) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleNextQuestion();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timerActive, handleNextQuestion]);

  const startRecording = async () => {
    try {
      const constraints = {
        audio: true,
        video: config.interviewMode === 'voice',
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (config.interviewMode === 'voice' && videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Audio recording
      const audioStream = new MediaStream(stream.getAudioTracks());
      mediaRecorderRef.current = new MediaRecorder(audioStream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);

        if (config.interviewMode === 'voice') {
          const videoBlob = new Blob(videoChunksRef.current, {
            type: 'video/webm',
          });
          const videoUrl = URL.createObjectURL(videoBlob);
          setVideoURL(videoUrl);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing media devices:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Wrap generateFeedback in useCallback to stabilize it
  const generateFeedback = useCallback(async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate realistic feedback based on answers
    const simulatedFeedback = {
      overallScore: calculateOverallScore(),
      strengths: generateStrengths(),
      areasForImprovement: generateAreasForImprovement(),
      questionAnalysis: questions.map((q, i) => ({
        question: q.question,
        score: calculateQuestionScore(q.question),
        feedback: generateQuestionFeedback(q.question),
        suggestions: generateSuggestions(q.question),
      })),
    };
    setFeedback(simulatedFeedback);
  }, [
    calculateOverallScore,
    generateStrengths,
    generateAreasForImprovement,
    calculateQuestionScore,
    generateQuestionFeedback,
    generateSuggestions,
    questions,
  ]);

  const handleNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentQuestion(questions[currentIndex + 1].question);
      setUserAnswer('');
      setAudioURL('');
      setVideoURL('');
      setTimeRemaining(180);
      setTimerActive(true);
    } else {
      generateFeedback();
      setInterviewCompleted(true);
    }
  }, [currentIndex, questions, generateFeedback]);

  // Helper functions for feedback generation
  const calculateOverallScore = useCallback(() => {
    // Base score based on difficulty
    let baseScore = {
      easy: 75,
      medium: 65,
      hard: 55,
    }[config.difficulty];

    // Add random variation
    return Math.min(100, baseScore + Math.floor(Math.random() * 20));
  }, [config.difficulty]);

  const calculateQuestionScore = useCallback(
    (question) => {
      // Score based on question difficulty
      const isTechnical = questionGenerators.technical[config.difficulty].some(
        (gen) => gen().toLowerCase() === question.toLowerCase()
      );

      const isBehavioral = questionGenerators.behavioral[config.difficulty].some(
        (gen) => gen().toLowerCase() === question.toLowerCase()
      );

      let baseScore;
      if (isTechnical) {
        baseScore = {
          easy: 80,
          medium: 70,
          hard: 60,
        }[config.difficulty];
      } else if (isBehavioral) {
        baseScore = {
          easy: 75,
          medium: 65,
          hard: 55,
        }[config.difficulty];
      } else {
        baseScore = 70; // Default for mixed or unknown
      }

      return Math.min(100, baseScore + Math.floor(Math.random() * 15));
    },
    [config.difficulty, questionGenerators.technical, questionGenerators.behavioral]
  );

  const generateStrengths = useCallback(() => {
    const allStrengths = [
      'Clear communication',
      'Strong technical knowledge',
      'Good problem-solving approach',
      'Well-structured answers',
      'Confident delivery',
      'Good use of examples',
      'Demonstrated depth of knowledge',
      'Effective time management',
      'Positive attitude',
      'Good listening skills',
    ];

    return shuffleArray(allStrengths).slice(0, 3);
  }, [shuffleArray]);

  const generateAreasForImprovement = useCallback(() => {
    const allAreas = [
      'Could provide more specific examples',
      'Pacing could be improved',
      'Consider more edge cases',
      'Work on clearer explanations',
      'Could demonstrate more depth in technical areas',
      'Try to be more concise',
      'Work on structuring answers better',
      'Could show more enthusiasm',
      'Consider preparing more behavioral examples',
      'Work on technical terminology',
    ];

    return shuffleArray(allAreas).slice(0, 3);
  }, [shuffleArray]);

  const generateQuestionFeedback = useCallback(
    (question) => {
      const isTechnical = questionGenerators.technical[config.difficulty].some(
        (gen) => gen().toLowerCase() === question.toLowerCase()
      );

      if (isTechnical) {
        const feedbacks = [
          'Good technical understanding but could go deeper.',
          'Solid answer that covers the basics well.',
          'Good start, but consider expanding on implementation details.',
          'Correct approach but could benefit from more examples.',
          'Technically accurate but could be more concise.',
        ];
        return feedbacks[Math.floor(Math.random() * feedbacks.length)];
      } else {
        const feedbacks = [
          'Good example but could provide more context about the situation.',
          'Well-structured answer that follows the STAR method.',
          'Good behavioral response but could show more impact.',
          'Demonstrated the skill but could elaborate more on learnings.',
          'Clear example but could better highlight your role.',
        ];
        return feedbacks[Math.floor(Math.random() * feedbacks.length)];
      }
    },
    [config.difficulty, questionGenerators.technical]
  );

  const generateSuggestions = useCallback(
    (question) => {
      const isTechnical = questionGenerators.technical[config.difficulty].some(
        (gen) => gen().toLowerCase() === question.toLowerCase()
      );

      if (isTechnical) {
        return [
          'Provide more concrete examples from your experience',
          'Explain your thought process more clearly',
          'Consider mentioning alternative solutions',
          'Include relevant technologies or frameworks',
          'Discuss potential edge cases',
        ];
      } else {
        return [
          'Use the STAR method (Situation, Task, Action, Result)',
          'Provide more specific details about the situation',
          'Quantify your achievements if possible',
          'Focus more on your personal contributions',
          'Highlight what you learned from the experience',
        ];
      }
    },
    [config.difficulty, questionGenerators.technical]
  );

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (interviewCompleted) {
    return (
      <Feedback
        feedback={feedback}
        questions={questions}
        audioURLs={questions.map(() => audioURL)}
        userAnswers={userAnswers}
      />
    );
  }

  return (
    <div className={styles['interview-practice']}>
      <div className={styles['interview-header']}>
        <h2>
          {config.desiredCompany ? `${config.desiredCompany} ` : ''}
          {config.jobRole} Mock Interview
        </h2>
        <div className={styles['progress-container']}>
          <div className={styles['progress-bar']}>
            <div
              className={styles['progress-fill']}
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
          <span className={styles['progress-text']}>
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        <div className={styles['timer']}>
          <span>⏱️ Time remaining: {formatTime(timeRemaining)}</span>
        </div>

        <div className={styles['question-container']}>
          <h3>Question:</h3>
          <p>{currentQuestion}</p>
        </div>

        <div className={styles['answer-section']}>
          <h3>Your Answer:</h3>

          {config.interviewMode === 'text' ? (
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className={styles['answer-textarea']}
            />
          ) : (
            <>
              {config.interviewMode === 'voice' && (
                <div className={styles['video-preview']}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={styles['camera-feed']}
                  />
                </div>
              )}
              <div className={styles['recording-controls']}>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`${styles['recording-button']} ${
                    isRecording ? styles['recording-active'] : ''
                  }`}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                {isRecording && (
                  <span className={styles['recording-indicator']}>
                    ● Recording
                  </span>
                )}
              </div>

              {audioURL && (
                <div className={styles['audio-playback']}>
                  <h5>Your Response:</h5>
                  <audio src={audioURL} controls />
                </div>
              )}
            </>
          )}
        </div>

        <div className={styles['navigation-buttons']}>
          <button
            onClick={handleNextQuestion}
            disabled={
              config.interviewMode === 'text' ? !userAnswer.trim() : !audioURL
            }
            className={styles['next-button']}
          >
            {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
          </button>
        </div>
      </div>
    </div>
  );
}