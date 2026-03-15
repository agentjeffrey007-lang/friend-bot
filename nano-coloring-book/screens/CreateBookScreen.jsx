import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { generateContextualQuestions, synthesizePrompt } from '../utils/promptEngine';
import { generateImage } from '../utils/nanoBananaAPI';

export default function CreateBookScreen({ navigation }) {
  const [step, setStep] = useState('menu'); // menu, input, questions, chat, generating
  const [userInput, setUserInput] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const handleCreateBook = async () => {
    if (!userInput.trim()) return;
    setLoading(true);

    // Generate contextual questions
    const qs = await generateContextualQuestions(userInput);
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

  const handleGenerateBook = async () => {
    if (!chatMessage.trim() && Object.keys(answers).length === 0) return;

    setLoading(true);
    setStep('generating');

    // Synthesize final prompt from answers + chat
    const finalPrompt = await synthesizePrompt(userInput, answers, chatMessage);

    // Generate 10 images via Nano Banana
    const generatedImages = await generateImage(finalPrompt, 10);
    setImages(generatedImages);

    setLoading(false);
    navigation.navigate('Preview', { images, prompt: finalPrompt });
  };

  if (step === 'menu') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create Your Coloring Book</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setStep('input')}
        >
          <Text style={styles.buttonText}>✨ Create Book</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'input') {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>What would you like to color?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Turtles, Space adventure, My dog..."
          value={userInput}
          onChangeText={setUserInput}
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          style={[styles.button, { opacity: userInput.trim() ? 1 : 0.5 }]}
          onPress={handleCreateBook}
          disabled={!userInput.trim()}
        >
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'questions') {
    const question = questions[currentQuestionIndex];
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>{question.text}</Text>
        <ScrollView style={styles.optionsContainer}>
          {question.options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.optionButton}
              onPress={() => handleAnswerQuestion(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkipToChat}>
          <Text style={styles.skipText}>Skip to Chat</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (step === 'chat' || step === 'generating') {
    return (
      <View style={styles.container}>
        <Text style={styles.subtitle}>Final Touches</Text>
        <Text style={styles.description}>
          Any final details? (Optional)
        </Text>
        <TextInput
          style={[styles.input, { minHeight: 100 }]}
          placeholder="e.g., Add more backgrounds, make it magical, etc."
          value={chatMessage}
          onChangeText={setChatMessage}
          placeholderTextColor="#999"
          multiline
        />
        <TouchableOpacity
          style={[styles.button, { opacity: loading ? 0.5 : 1 }]}
          onPress={handleGenerateBook}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating...' : '🎨 Generate Book'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#FF6B9D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B9D',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  skipButton: {
    padding: 10,
    alignItems: 'center',
  },
  skipText: {
    color: '#FF6B9D',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
