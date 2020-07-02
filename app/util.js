exports.roundToDigits = (number, n) => {
  number = parseFloat(number);
  number = number.toFixed(n);
  return parseFloat(number);
};
