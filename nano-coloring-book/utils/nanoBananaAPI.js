import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDRuyRAs2JOJJYOp-oo5nZKRfKCXOZ5gbk';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export async function generateImage(prompt, count = 1) {
  try {
    const images = [];
    
    for (let i = 0; i < count; i++) {
      const response = await axios.post(
        `${GEMINI_BASE}/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Generate a black and white line art coloring page for children. Subject: ${prompt}. 
                  Style: Clean line art suitable for coloring books, high contrast, detailed but not overly complex, no colors, just black lines on white background.
                  Image ${i + 1} of ${count}.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Extract image from response
      if (response.data.candidates && response.data.candidates[0]) {
        const candidate = response.data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts[0].text) {
          const imageUrl = candidate.content.parts[0].text;
          images.push(imageUrl);
        }
      }
    }

    return images.length > 0 ? images : generatePlaceholders(count);
  } catch (error) {
    console.error('Gemini API error:', error);
    return generatePlaceholders(count);
  }
}

function generatePlaceholders(count) {
  // Fallback to placeholder images for development
  return Array(count).fill().map((_, i) => 
    `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Crect fill='%23fff' width='512' height='512'/%3E%3Crect x='50' y='50' width='412' height='412' fill='none' stroke='%23000' stroke-width='2'/%3E%3Ctext x='256' y='240' font-size='28' text-anchor='middle' font-weight='bold' fill='%23333'%3EColoring Page ${i + 1}%3C/text%3E%3Ctext x='256' y='280' font-size='14' text-anchor='middle' fill='%23999'%3E(Gemini API)%3C/text%3E%3C/svg%3E`
  );
}

export async function regenerateImage(prompt, modifications) {
  // For fake color picker - regenerate with modifications
  const modifiedPrompt = `${prompt}. Additional modifications: ${modifications}`;
  return generateImage(modifiedPrompt, 1);
}
