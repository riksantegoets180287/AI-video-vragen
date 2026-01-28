
export interface AIHeuristicResult {
  warning: boolean;
  reason?: string;
}

export const checkAIUsage = (
  answer: string, 
  prompt: string, 
  modelAnswer: string, 
  similarityScore: number,
  pasteDetected: boolean,
  typingSpeedBursts: boolean
): AIHeuristicResult => {
  let signals = 0;

  // Signal 1: Paste detected
  if (pasteDetected) signals += 2;

  // Signal 2: Extreme length relative to prompt
  if (answer.length > 1200 && answer.length > prompt.length * 10) signals++;

  // Signal 3: Very high similarity but large word count (potential paraphrase)
  if (similarityScore > 0.95 && answer.length > 300) signals++;

  // Signal 4: Unnatural typing speed
  if (typingSpeedBursts) signals++;

  const warning = signals >= 2;
  
  return {
    warning,
    reason: warning 
      ? "Meerdere ongebruikelijke patronen gedetecteerd (bijv. plakken of extreem snelle invoer)."
      : "Geen duidelijke signalen van AI-gebruik gedetecteerd."
  };
};
