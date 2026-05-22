export const formatString = (inputString: string): string => {
  // Trim leading and trailing spaces
  const trimmedString = inputString.trim();
  // Replace multiple spaces with a single space
  const stringWithSingleSpaces = trimmedString.replace(/\s+/g, " ");
  // Replace spaces between words with '-'
  const stringWithHyphens = stringWithSingleSpaces.replace(/\s/g, "-");
  return stringWithHyphens;
};
