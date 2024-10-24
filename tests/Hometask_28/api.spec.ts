import { test, expect, APIRequestContext } from "@playwright/test";

const BASE_URL = "https://qauto.forstudy.space/api";
let authCookie = '';

test.describe('Qauto API Tests with Authorization', () => {
  let request: APIRequestContext;

  // Authenticate the user before each test and store the auth cookie
  test.beforeEach(async ({ request: apiRequest }) => {
    // Send the POST request to authenticate the user
    const response = await apiRequest.post(`${BASE_URL}/auth/signin`, {
      data: {
        email: 'anna.denysenko@gmail.com',
        password: 'Hillel2024',
        remember: false,
      },
    });

    // Assert that the response status is 200 (OK)
    expect(response.status()).toBe(200);

    // Extract the "set-cookie" header from the response
    const setCookieHeader = response.headers()['set-cookie'];
    
    // Ensure that "set-cookie" header exists and extract the cookie value
    if (setCookieHeader) {
      authCookie = setCookieHeader[0].split(';')[0]; // Extract cookie value
      console.log(`Auth Cookie: ${authCookie}`);
    } else {
      throw new Error('Authentication failed. No set-cookie header found.');
    }

    // Store the request context for further use
    request = apiRequest;
  });

  // Positive Scenario: Create a new car with authorization
  test("Create a new car successfully (Positive scenario)", async () => {
    // Define the car data
    const carData = {
      brand: "Toyota",
      model: "Corolla",
      year: 2022,
      color: "Blue",
      price: 25000,
    };

    // Make a POST request to create a new car with authorization
    const response = await request.post(`${BASE_URL}/cars`, {
      data: carData,
      headers: {
        cookie: authCookie, // Pass the auth cookie in the request headers
      },
    });

    // Assert the response status is 201 (Created)
    expect(response.status()).toBe(201);

    // Optionally, you can check the response body
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("id"); // Ensure the response has an 'id' property
    expect(responseBody.brand).toBe(carData.brand);
    expect(responseBody.model).toBe(carData.model);
  });

  // Negative Scenario 1: Missing Required Fields
  test("Fail to create a car when required fields are missing (Negative scenario 1)", async () => {
    // Define incomplete car data (missing required fields like model, year, price)
    const incompleteCarData = {
      brand: "Honda",
    };

    // Make a POST request to create a new car with missing fields and authorization
    const response = await request.post(`${BASE_URL}/cars`, {
      data: incompleteCarData,
      headers: {
        cookie: authCookie, // Pass the auth cookie in the request headers
      },
    });

    // Assert the response status is 400 (Bad Request)
    expect(response.status()).toBe(400);

    // Optionally, check the response body for error messages
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("error");
    expect(responseBody.error).toContain("Required fields are missing");
  });

  // Negative Scenario 2: Invalid Data Types
  test("Fail to create a car with invalid data types (Negative scenario 2)", async () => {
    // Define car data with incorrect data types
    const invalidCarData = {
      brand: "Ford",
      model: "Focus",
      year: "InvalidYear", // Year should be a number, but here it's a string
      color: "Red",
      price: "InvalidPrice", // Price should be a number
    };

    // Make a POST request to create a new car with invalid data types and authorization
    const response = await request.post(`${BASE_URL}/cars`, {
      data: invalidCarData,
      headers: {
        cookie: authCookie, // Pass the auth cookie in the request headers
      },
    });

    // Assert the response status is 400 (Bad Request)
    expect(response.status()).toBe(400);

    // Optionally, check the response body for validation error messages
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty("error");
    expect(responseBody.error).toContain("Invalid data type");
  });
});
