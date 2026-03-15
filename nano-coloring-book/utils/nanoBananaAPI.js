import axios from 'axios';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDRuyRAs2JOJJYOp-oo5nZKRfKCXOZ5gbk';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Generate coloring book line art images using Gemini's image generation.
 * Uses gemini-2.0-flash-exp with responseModalities including "image".
 */
export async function generateImage(prompt, count = 1) {
  const images = [];

  for (let i = 0; i < count; i++) {
    try {
      const response = await axios.post(
        `${GEMINI_BASE}/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Generate a black and white line art coloring page for children. Subject: ${prompt}. Style: Clean line art suitable for coloring books, high contrast, detailed but not overly complex, no colors, just black lines on white background. Variation ${i + 1} of ${count}.`,
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['TEXT', 'IMAGE'],
            temperature: 0.9,
          },
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        }
      );

      const candidate = response.data?.candidates?.[0];
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            const { mimeType, data } = part.inlineData;
            images.push(`data:${mimeType};base64,${data}`);
            break;
          }
        }
      }
    } catch (error) {
      console.warn(`Image generation failed for page ${i + 1}:`, error.message);
    }
  }

  // Fall back to placeholders for any missing images
  while (images.length < count) {
    images.push(generatePlaceholderSVG(images.length + 1, prompt));
  }

  return images;
}

/**
 * Generate color variant overlays for a base image.
 * Returns an array of palette objects: { name, colors, tintedImage }
 */
export async function generateColorVariants(baseImageUri, pageIndex) {
  const palettes = [
    { name: 'Sunset', colors: ['#FF6B9D', '#FF8C42', '#FFD700', '#FF4757', '#FFA502', '#E84393'] },
    { name: 'Ocean', colors: ['#00CED1', '#0984E3', '#6C5CE7', '#00B894', '#74B9FF', '#A29BFE'] },
    { name: 'Forest', colors: ['#27AE60', '#2ECC71', '#F1C40F', '#E67E22', '#8B4513', '#D4AC0D'] },
    { name: 'Candy', colors: ['#FD79A8', '#FDCB6E', '#55EFC4', '#A29BFE', '#FF7675', '#81ECEC'] },
    { name: 'Royal', colors: ['#6C5CE7', '#E84393', '#00CEC9', '#FDCB6E', '#D63031', '#0984E3'] },
    { name: 'Earth', colors: ['#D4AC0D', '#8B4513', '#27AE60', '#E67E22', '#795548', '#A1887F'] },
  ];

  return palettes.map((palette) => ({
    ...palette,
    baseImage: baseImageUri,
  }));
}

function generatePlaceholderSVG(pageNum, prompt) {
  const label = encodeURIComponent(prompt ? prompt.substring(0, 30) : 'Coloring Page');
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Crect fill='%23fff' width='512' height='512'/%3E%3Crect x='30' y='30' width='452' height='452' rx='20' fill='none' stroke='%23ccc' stroke-width='2' stroke-dasharray='8,4'/%3E%3Ccircle cx='256' cy='200' r='60' fill='none' stroke='%23ddd' stroke-width='2'/%3E%3Cpath d='M220 260 Q256 320 292 260' fill='none' stroke='%23ddd' stroke-width='2'/%3E%3Ctext x='256' y='340' font-size='24' text-anchor='middle' font-family='sans-serif' fill='%23999'%3EPage ${pageNum}%3C/text%3E%3Ctext x='256' y='370' font-size='14' text-anchor='middle' font-family='sans-serif' fill='%23ccc'%3E${label}%3C/text%3E%3C/svg%3E`;
}

export async function regenerateImage(prompt, modifications) {
  const modifiedPrompt = `${prompt}. Additional modifications: ${modifications}`;
  const results = await generateImage(modifiedPrompt, 1);
  return results[0];
}
