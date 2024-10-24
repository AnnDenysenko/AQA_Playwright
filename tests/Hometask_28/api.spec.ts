import { test, expect, APIRequestContext } from "@playwright/test";

const BASE_URL = "https://qauto.forstudy.space/api";
let authCookie = "";

test.describe("Qauto API Tests with Authorization", () => {
  let request: APIRequestContext;

  test.beforeEach(async ({ request: apiRequest }) => {
    const response = await apiRequest.post(`${BASE_URL}/auth/signin`, {
      data: {
        email: "anna.denysenko@gmail.com",
        password: "Hillel2024",
        remember: false,
      },
    });

    expect(response.status()).toBe(200);

    // Extracting the "set-cookie" header from the response
    const setCookieHeader = response.headers()["set-cookie"];
    // console.log(setCookieHeader);

    // Ensuring that "set-cookie" header exists and extract the cookie value
    if (setCookieHeader) {
      authCookie = setCookieHeader.split(";")[0];
      console.log(`Auth Cookie: ${authCookie}`);
    } else {
      throw new Error("Authentication failed. No set-cookie header found.");
    }

    // Storing the request context for further use
    request = apiRequest;
  });

  test("Create a new car successfully (Positive scenario)", async () => {
    const carData = {
      carBrandId: 1,
      carModelId: 3,
      mileage: 15500,
    };

    const response = await request.post(`${BASE_URL}/cars`, {
      data: carData,
      headers: {
        "Content-Type": "application/json",
        Cookie: authCookie,
      },
    });

    console.log(JSON.stringify(response.body()));

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody.data.brand).toBe("Audi");

    expect(responseBody.data).toHaveProperty("id");

    // Storing the car ID for future use
    const carId = responseBody.data.id;
    console.log(`Car ID: ${carId}`);
  });

  test("Fail to create a car when required fields are missing (Negative scenario 1)", async () => {
    // Defining incomplete car data (missing required fields)
    const incompleteCarData = {
      carBrandId: 3,
    };

    const response = await request.post(`${BASE_URL}/cars`, {
      data: incompleteCarData,
      headers: {
        cookie: authCookie,
      },
    });

    expect(response.status()).toBe(400);
  });

  test("Fail to create a car with invalid data types (Negative scenario 2)", async () => {
    // Define car data with incorrect data types
    const invalidCarData = {
      carBrandId: "Ford",
      carModelId: "Focus",
      mileage: "Number",
      brand: "Ford", // All values should be a number
    };

    const response = await request.post(`${BASE_URL}/cars`, {
      data: invalidCarData,
      headers: {
        cookie: authCookie,
      },
    });

    expect(response.status()).toBe(400);
  });
});
