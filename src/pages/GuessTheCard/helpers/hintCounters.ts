//Hints Render

export const canShow = (n: number, guessesLength: number) => guessesLength >= n;
export const hintLeft = (n: number, guessesLength: number) => n - guessesLength;
