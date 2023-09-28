function sum(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return a + b;
  } else {
    throw new TypeError('Переданные данные не валидны!');
  }
}

module.exports = sum;
