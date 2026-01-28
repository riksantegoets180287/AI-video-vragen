
export interface SimilarityResult {
  score: number;
  matchedWords: string[];
}

const normalize = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
};

const getTokens = (text: string): string[] => {
  return normalize(text).split(/\s+/).filter(t => t.length > 2);
};

export const calculateSimilarity = (studentAnswer: string, modelAnswer: string): SimilarityResult => {
  const studentTokens = getTokens(studentAnswer);
  const modelTokens = getTokens(modelAnswer);

  if (studentTokens.length === 0 || modelTokens.length === 0) {
    return { score: 0, matchedWords: [] };
  }

  // Jaccard Similarity
  const studentSet = new Set(studentTokens);
  const modelSet = new Set(modelTokens);
  
  const intersection = new Set([...studentSet].filter(x => modelSet.has(x)));
  const union = new Set([...studentSet, ...modelSet]);
  const jaccardScore = intersection.size / union.size;

  // Cosine-ish logic (simplified TF-IDF/Vector overlap)
  const allUniqueTokens = Array.from(union);
  const vector1 = allUniqueTokens.map(t => studentSet.has(t) ? 1 : 0);
  const vector2 = allUniqueTokens.map(t => modelSet.has(t) ? 1 : 0);
  
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;
  for (let i = 0; i < allUniqueTokens.length; i++) {
    dotProduct += vector1[i] * vector2[i];
    mag1 += vector1[i] * vector1[i];
    mag2 += vector2[i] * vector2[i];
  }
  
  const cosineScore = dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
  
  // Combine scores
  const finalScore = (jaccardScore * 0.4) + (cosineScore * 0.6);
  const matchedWords = Array.from(intersection).slice(0, 8);

  return {
    score: Math.min(1, finalScore),
    matchedWords
  };
};
