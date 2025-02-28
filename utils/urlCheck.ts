export function isValidURL(url: string) {
  try {
    const urlObject = new URL(url);

    // Additional checks, if necessary.
    return true;
  } catch (error) {
    return false;
  }
}
