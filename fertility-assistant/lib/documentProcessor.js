export function retrieveRelevantChunks(query, chunks, topK = 3) {
  const queryWords = query.toLowerCase().split(/\s+/);
  
  const scored = chunks.map(chunk => {
    const chunkLower = chunk.toLowerCase();
    const score = queryWords.reduce((acc, word) => {
      const count = (chunkLower.match(new RegExp(word, 'g')) || []).length;
      return acc + count;
    }, 0);
    return { chunk, score };
  });
  
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(item => item.chunk);
}