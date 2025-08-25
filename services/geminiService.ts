
/**
 * Break timer messages
 */

const BREAK_MESSAGES = [
  "Remember to stretch and hydrate. You're doing great!",
  "Take a deep breath and enjoy this moment of calm.",
  "Rest your eyes and give your mind a moment to recharge.",
  "Time to reset - you've earned this break!",
  "Step away from the screen and refresh your focus.",
  "Your productivity will thank you for this break.",
  "Taking breaks improves your overall performance.",
  "A short break now means better focus later."
];

export const getBreakQuote = async (): Promise<string> => {
  // Return a random message from the array
  const randomIndex = Math.floor(Math.random() * BREAK_MESSAGES.length);
  return BREAK_MESSAGES[randomIndex];
};
