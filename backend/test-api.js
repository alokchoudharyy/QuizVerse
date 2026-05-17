import axios from 'axios';

async function testTriviaAPI() {
  // Category 9 = General Knowledge, Medium Difficulty
  const url = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple';
  
  console.log("🚀 Testing OpenTriviaDB Connection...");
  console.log(`📡 Hitting URL: ${url}\n`);

  try {
    const response = await axios.get(url);
    
    console.log("✅ Response Status Code:", response.status);
    console.log("📊 Response Data Code (0 means Success):", response.data.response_code);
    
    if (response.data.response_code === 0) {
      console.log("\n🔥 Success! Questions fetched successfully.");
      console.log("📝 Sample First Question:");
      console.log("-----------------------------------------");
      console.log("Question:", response.data.results[0].question);
      console.log("Correct Answer:", response.data.results[0].correct_answer);
    } else {
      console.log("\n❌ OpenTriviaDB sent an error code:", response.data.response_code);
      console.log("Tip: Code 5 means Rate Limited (Too many requests).");
    }
  } catch (error) {
    console.error("\n❌ API Fetch failed completely!");
    console.error("Error Message:", error.message);
  }
}

testTriviaAPI();