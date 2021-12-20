const fahrenheitToCelsius = (temp) => {
  const a = (temp - 32) / 1.8;
  console.log(a);
  return a;
};
const celsiusToFahrenheit = (temp) => {
  const a = temp * 1.8 + 32;
  console.log(a);
  return a;
};
fahrenheitToCelsius(32);
celsiusToFahrenheit(0);
module.exports = { fahrenheitToCelsius, celsiusToFahrenheit };
