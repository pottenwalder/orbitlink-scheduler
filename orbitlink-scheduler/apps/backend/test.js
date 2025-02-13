const axios = require("axios");

async function testBackend() {
  try {
    console.log("Testing health endpoint...");
    const health = await axios.get("http://localhost:5000/health");
    console.log("Health response:", health.data);

    console.log("\nTesting GET bookings...");
    const bookings = await axios.get("http://localhost:5000/api/bookings");
    console.log("Bookings response:", bookings.data);

    console.log("\nBackend is working correctly!");
  } catch (error) {
    console.error("Error testing backend:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("Could not connect to backend. Is the server running?");
    }
  }
}

testBackend();
