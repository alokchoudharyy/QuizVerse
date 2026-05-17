import axios from 'axios';

const categoryMapping = {
  general: 9,
  films: 11,
  music: 12,
  literature: 10,
  science: 17,
  mathematics: 19,
  programming: 18,
  sports: 21,
  history: 23
};

export const fetchQuestionsStream = async (req, res, next) => {
  try {
    const { category, difficulty, amount } = req.query; 
    
    console.log(`📥 [RECEIVE] Cat: ${category} | Diff: ${difficulty} | Amt: ${amount}`);

    const triviaCategoryId = categoryMapping[category] || 9; 
    
    // String casing safety check (.toLowerCase() lagaya taaki 'Easy' ya 'easy' dono chalein)
    const triviaDifficulty = difficulty ? difficulty.toLowerCase() : 'medium';
    const triviaAmount = parseInt(amount, 10) || 10; 

    let url = `https://opentdb.com/api.php?amount=${triviaAmount}&category=${triviaCategoryId}&difficulty=${triviaDifficulty}&type=multiple`;
    
    console.log("📡 [FETCHING] URL:", url);
    let response = await axios.get(url);
    
    // 🔥 SMART FALLBACK ENGINE:
    // Agar response_code === 1 aaya (yaani us level mein utne sawaal nahi hain)
    if (response.data.response_code === 1) {
      console.log("⚠️ Niche tier alert! Not enough questions. Activating mixed difficulty fallback pool...");
      
      // Automatic difficulty filter hata kar bache hue best questions fetch karega
      const fallbackUrl = `https://opentdb.com/api.php?amount=${triviaAmount}&category=${triviaCategoryId}&type=multiple`;
      response = await axios.get(fallbackUrl);
    }

    // Agar fallback ke baad bhi koi aur technical issue ho (Code 0 ke alawa)
    if (response.data.response_code !== 0) {
      console.error("❌ OpenTriviaDB rejected completely with code:", response.data.response_code);
      return res.status(400).json({ success: false, message: 'Database pool exhausted.' });
    }

    // Success response to Frontend Store
    return res.status(200).json({
      success: true,
      questions: response.data.results
    });

  } catch (error) {
    console.error("💥 [CRASH] fetchQuestionsStream:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};