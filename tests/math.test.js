const { fahrenheitToCelsius, celsiusToFahrenheit } = require("../src/math");
test("jabuka", () => {
  expect(fahrenheitToCelsius(32)).toBe(0);
});
test("kruska", () => {
  expect(celsiusToFahrenheit(0)).toBe(32);
});
