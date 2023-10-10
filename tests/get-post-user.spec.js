// @ts-check
const { test, expect } = require("@playwright/test");

import config from "../config.js";

const getUrl = config.baseUrl + "/" + config.validUser.username;
const postUrl = config.baseUrl;
const deleteUrl = config.baseUrl + "/" + config.validUser.username;

const getErrorMessage = { code: 1, type: "error", message: "User not found" };

const successCode = 200;
const errorCode = 404;

test.describe("GET/POST user", () => {
  test("GET undefined user", async ({ request }) => {
    const response = await request.fetch(getUrl, {
      method: "GET",
    });

    await expect(response).not.toBeOK();
    expect(response.status()).toEqual(errorCode);

    const responseToJSON = await response.json();
    // expect(responseToJSON).toEqual(getErrorMessage);
    //expect(responseToJSON.message).toEqual("User not found");
    expect(responseToJSON.message).toEqual(getErrorMessage.message);
  });

  test("POST user", async ({ request }) => {
    const response = await request.fetch(postUrl, {
      method: "POST",
      data: JSON.stringify(config.validUser),
      headers: {
        "Content-type": "application/json",
      },
    });

    await expect(response).toBeOK();
    expect(response.status()).toEqual(successCode);

    const responseToJSON = await response.json();
    expect(responseToJSON.message).toEqual(config.validUser.id.toString());
  });

  test("GET user", async ({ request }) => {
    const response = await request.fetch(getUrl, {
      method: "GET",
    });

    await expect(response).toBeOK();
    expect(response.status()).toEqual(successCode);

    const responseToJSON = await response.json();
    expect(responseToJSON).toEqual(config.validUser);
  });

  test.afterAll("DELETE user", async ({ request }) => {
    const response = await request.fetch(deleteUrl, {
      method: "DELETE",
    });

    await expect(response).toBeOK();
    expect(response.status()).toEqual(successCode);

    const responseToJSON = await response.json();
    expect(responseToJSON.message).toEqual(config.validUser.username);
  });
});
