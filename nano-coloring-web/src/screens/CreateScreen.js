import React, { useState } from 'react';
import axios from 'axios';

const GEMINI_API_KEY = 'AIzaSyDRuyRAs2JOJJYOp-oo5nZKRfKCXOZ5gbk';

export default function CreateScreen({ onCreateBook, onCancel }) {
  const [step, setStep] = useState('input'); // input, questions, chat, generating
  const [userInput, setUserInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const questionTemplates = {
    animals: [
      { text: 'Where should the animals be?', options: ['Natural habitat', 'Fantasy world', 'Doing an activity'] },
      { text: 'How many animals?', options: ['Just one', 'A family', 'A whole group'] },
      { text: 'What mood?', options: ['Playful & cute', 'Adventurous', 'Calm & peaceful'] },
    ],
    space: [
      { text: 'What space elements?', options: ['Planets', 'Stars & galaxies', 'Spaceships'] },
      { text: 'Realistic or fantasy?', options: ['Realistic', 'Fantasy', 'Mix'] },
    ],
    default: [
      { text: 'What setting?', options: ['Indoor', 'Outdoor', 'Fantasy world'] },
      { text: 'Complexity?', options: ['Simple', 'Medium', 'Highly detailed'] },
    ],
  };

  const generateContextualQuestions = (input) => {
    const lower = input.toLowerCase();
    let category = 'default';

    if (
      lower.includes('animal') ||
      lower.includes('dog') ||
      lower.includes('cat') ||
      lower.includes('turtle')
    ) {
      category = 'animals';
    } else if (lower.includes('space') || lower.includes('planet')) {
      category = 'space';
    }

    return questionTemplates[category];
  };

  const handleCreateBook = async () => {
    if (!userInput.trim()) return;
    setLoading(true);

    const qs = generateContextualQuestions(userInput);
    setQuestions(qs);
    setCurrentQuestionIndex(0);
    setStep('questions');
    setLoading(false);
  };

  const handleAnswerQuestion = (answer) => {
    const newAnswers = { ...answers, [currentQuestionIndex]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStep('chat');
    }
  };

  const handleSkipToChat = () => {
    setStep('chat');
  };

  const generateImages = async (prompt) => {
    try {
      setLoading(true);
      const imagePrompts = [
        `${prompt} - variation 1, black and white line art`,
        `${prompt} - variation 2, black and white line art`,
        `${prompt} - variation 3, black and white line art`,
        `${prompt} - variation 4, black and white line art`,
        `${prompt} - variation 5, black and white line art`,
        `${prompt} - variation 6, black and white line art`,
        `${prompt} - variation 7, black and white line art`,
        `${prompt} - variation 8, black and white line art`,
        `${prompt} - variation 9, black and white line art`,
        `${prompt} - variation 10, black and white line art`,
      ];

      const images = [];

      for (let i = 0; i < imagePrompts.length; i++) {
        // Use placeholder images for now (Gemini API requires specific setup)
        images.push(
          `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Crect fill='%23fff' width='512' height='512'/%3E%3Crect x='40' y='40' width='432' height='432' fill='none' stroke='%23000' stroke-width='2'/%3E%3Ctext x='256' y='220' font-size='20' text-anchor='middle' font-weight='bold' fill='%23333'%3E${prompt}%3C/text%3E%3Ctext x='256' y='250' font-size='14' text-anchor='middle' fill='%23666'%3EPage ${i + 1}%3C/text%3E%3Ctext x='256' y='280' font-size='12' text-anchor='middle' fill='%23999'%3E(Gemini Generated)%3C/text%3E%3C/svg%3E`
        );
      }

      onCreateBook(images, prompt);
    } catch (error) {
      console.error('Error generating images:', error);
      alert('Error generating images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBook = async () => {
    const finalPrompt = `${userInput}. ${Object.values(answers).join('. ')}. ${chatMessage}. Style: Clean black and white line art for coloring books, suitable for children.`;
    await generateImages(finalPrompt);
  };

  if (step === 'input') {
    return (
      <div className="screen">
        <div className="screen-header">
          <h2 className="screen-title">Create Your Book</h2>
          <button className="back-btn" onClick={onCancel}>← Back</button>
        </div>

        <div className="input-group">
          <label className="input-label">What would you like to color?</label>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="e.g., Turtles, Space adventure, My dog..."
            onKeyPress={(e) => e.key === 'Enter' && handleCreateBook()}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleCreateBook}
          disabled={!userInput.trim() || loading}
        >
          {loading ? 'Loading...' : 'Next'}
        </button>
      </div>
    );
  }

  if (step === 'questions') {
    const question = questions[currentQuestionIndex];
    return (
      <div className="screen">
        <div className="screen-header">
          <h2 className="screen-title">{question.text}</h2>
          <button className="back-btn" onClick={onCancel}>← Back</button>
        </div>

        <div className="options-container">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              className="option-btn"
              onClick={() => handleAnswerQuestion(option)}
            >
              {option}
            </button>
          ))}
        </div>

        <button className="btn btn-secondary" onClick={handleSkipToChat} style={{ marginTop: 'auto' }}>
          Skip to Chat
        </button>
      </div>
    );
  }

  if (step === 'chat') {
    return (
      <div className="screen">
        <div className="screen-header">
          <h2 className="screen-title">Final Touches</h2>
          <button className="back-btn" onClick={onCancel}>← Back</button>
        </div>

        <div className="input-group">
          <label className="input-label">Any final details? (Optional)</label>
          <textarea
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="e.g., Add more backgrounds, make it magical, etc."
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleGenerateBook}
          disabled={loading}
        >
          {loading ? '🎨 Creating...' : '🎨 Generate Book'}
        </button>
      </div>
    );
  }

  return null;
}
