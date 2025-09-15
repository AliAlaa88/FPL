// Simple test script to verify validation middleware
import fetch from "node-fetch";

const BASE_URL = "http://localhost:3001/api";

async function testValidation() {
  console.log("🧪 Testing Joi Validation Middleware\n");

  // Test 1: Valid gameweek request
  try {
    console.log("✅ Test 1: Valid gameweek request");
    const response = await fetch(`${BASE_URL}/gameweeks/1`);
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Invalid gameweek request (non-numeric)
  try {
    console.log("❌ Test 2: Invalid gameweek request (non-numeric)");
    const response = await fetch(`${BASE_URL}/gameweeks/invalid`);
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Invalid team creation request (missing ID)
  try {
    console.log("❌ Test 3: Invalid team creation request (missing ID)");
    const response = await fetch(`${BASE_URL}/teams`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 4: Invalid fixture creation (missing fixtures array)
  try {
    console.log("❌ Test 4: Invalid fixture creation (missing fixtures array)");
    const response = await fetch(`${BASE_URL}/fixtures/1`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  console.log("\n🎉 Validation tests completed!");
}

// Run tests
testValidation().catch(console.error);
