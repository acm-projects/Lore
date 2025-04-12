import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

// AWS DynamoDB Config
const client = new DynamoDBClient({ region: "us-east-2" });
const docClient = DynamoDBDocumentClient.from(client);

export const addStoryToDB = async (storyData) => {
  const params = {
    TableName: "Stories",
    Item: {
      StoryID: String(storyData.StoryID),
      DateCreated: new Date().toISOString(),
      story: storyData.story || "",
      users: storyData.users || [],
      creator: storyData.creator || "",
      gameStarted: storyData.gameStarted || false,
      prompts: storyData.prompts || {},
      votes: storyData.votes || {},
      totalVotes: storyData.totalVotes || 0,
      winner: storyData.winner || null,
      winningPrompts: storyData.winningPrompts || [],
      storyHistory: storyData.storyHistory || [],
      round: storyData.tound || 0,
      continueCount: storyData.continueCount || 0,
      continuePressedBy: storyData.continuePressedBy || [],
      playerWins: storyData.playerWins || {},
    },
  };

  try {
    // Using the correct method from the AWS SDK v3
    await docClient.send(new PutCommand(params));
    console.log("Story added successfully to Stories Table.");
  } catch (err) {
    console.error("Error adding story:", err);
  }
};
