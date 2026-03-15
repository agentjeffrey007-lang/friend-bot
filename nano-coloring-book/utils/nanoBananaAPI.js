import axios from 'axios';

const NANO_BANANA_API_KEY = process.env.NANO_BANANA_API_KEY || 'YOUR_API_KEY_HERE';
const API_BASE = 'https://api.nanobananastudio.com/v1';

export async function generateImage(prompt, count = 1) {
  try {
    const response = await axios.post(`${API_BASE}/generate`, {
      prompt: prompt,
      model: 'text-to-image-v1',
      num_images: count,
      size: '512x512',
      style: 'line art',
      quality: 'high',
    }, {
      headers: {
        'Authorization': `Bearer ${NANO_BANANA_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    // Return array of image URLs
    return response.data.images || [];
  } catch (error) {
    console.error('Nano Banana API error:', error);
    // Fallback to placeholder images for development
    return Array(count).fill().map((_, i) => 
      `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512'%3E%3Crect fill='%23f0f0f0' width='512' height='512'/%3E%3Ctext x='50%25' y='50%25' font-size='24' text-anchor='middle' dy='.3em' fill='%23999'%3EImage ${i + 1}%3C/text%3E%3C/svg%3E`
    );
  }
}

export async function regenerateImage(prompt, modifications) {
  // For fake color picker - regenerate with modifications
  const modifiedPrompt = `${prompt}. Modifications: ${modifications}`;
  return generateImage(modifiedPrompt, 1);
}
