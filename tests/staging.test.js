/* eslint-disable */
const axios = require("axios");

test("POST request to sum two numbers", async () => {
  const a = 5;
  const b = 10;

  const response = await axios.post(
    "https://grq6ksfvy4.execute-api.us-east-1.amazonaws.com/staging/sum",
    { a, b }
  );

  expect(response.status).toBe(200);
  expect(response.data.status).toBe("ok");
  expect(response.data.message).toBe(a + b);
});
