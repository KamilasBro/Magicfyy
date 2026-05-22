export const getMatchClass = (guess: string[], random: string[]) => {
  if (
    guess.length === random.length &&
    guess.every((c) => random.includes(c))
  ) {
    return "correct";
  }
  if (guess.some((c) => random.includes(c))) {
    return "partial";
  }

  return "";
};
