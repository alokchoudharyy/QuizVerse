import { supabaseAdmin } from '../config/supabase.js';

export const getGlobalLeaderboard = async (req, res, next) => {
  try {
    console.log("🏆 Fetching Global Leaderboard Rankings from Profiles...");

    // Profiles table se data uthayenge jahan naya 'name' column query hoga
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id, name, total_score, average_accuracy, total_quizzes_attempted')
      .order('total_score', { ascending: false }) // Highest score top par aayega
      .limit(50); 

    if (error) {
      throw error;
    }

    // Safely mapping data blocks taaki frontend par koi property loop crash na ho
    const sanitizedLeaderboard = (data || []).map(player => {
      let resolvedName = player.name;
      if (!resolvedName || resolvedName.trim() === "" || resolvedName === 'Anonymous') {
        resolvedName = "Active Quizzer";
      }

      return {
        id: player.id,
        name: resolvedName,
        total_score: Math.round(parseFloat(player.total_score || 0)),
        accuracy: parseFloat(player.average_accuracy || 0).toFixed(1),
        quizzes_played: player.total_quizzes_attempted || 0
      };
    });

    return res.status(200).json({
      success: true,
      leaderboard: sanitizedLeaderboard
    });

  } catch (error) {
    console.error("Leaderboard Engine Fatal Error:", error.message);
    next(error);
  }
};