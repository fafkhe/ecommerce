const generateRandomDigit = () => {
  return Math.floor(Math.random() * 9) + 1;
};

export default (number) => {
  let result = "";
  for (let i = 0; i < number; i++) {
    result += String(generateRandomDigit());
  }
  return result;
};
