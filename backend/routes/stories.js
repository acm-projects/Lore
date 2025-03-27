import express from "express";
import { addStoryToDB } from "../DB/storiesDB.js";

const router = express.Router();

router.post("/add_story", async (req, res) => {
  console.log("📩 Received request at /stories/add_story:", req.body);

  const { StoryID, Story, Users, Creator, GameStarted, Prompts, Votes, TotalVotes, Winner, WinningPrompts, StoryHistory, Round, ContinueCount, ContinuePressedBy, PlayerWins } = req.body;

  if (!StoryID || !Story) {
    return res.status(400).json({ error: "Missing required fields: StoryID or Story" });
  }

  try {
    await addStoryToDB({
      StoryID,
      story,
      users,
      creator,
      gameStarted,
      prompts,
      votes,
      totalVotes,
      winner,
      winningPrompts,
      storyHistory,
      round,
      continueCount,
      continuePressedBy,
      playerWins,
    });

    res.status(200).json({ message: "Story added to DynamoDB successfully!" });
  } catch (error) {
    console.error("❌ Error adding story:", error);
    res.status(500).json({ error: "Failed to add story to DynamoDB" });
  }
});

router.get("/test", (req, res) => {
  console.log("✅ /stories/test route was hit!");
  res.send("Stories route works!");
});

export default router;
