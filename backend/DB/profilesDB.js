import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

// AWS DynamoDB Config
const client = new DynamoDBClient({ region: "us-east-2" });
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Get player details by CognitoSub using a GSI (Assuming GSI exists on CognitoSub).
 */
export const getPlayerByCognitoSub = async (cognitoSub) => {
  const params = {
    TableName: "Players",
    IndexName: "CognitoSub-index",  // Ensure you have a GSI for this query
    KeyConditionExpression: "CognitoSub = :cognitoSub",
    ExpressionAttributeValues: { ":cognitoSub": cognitoSub },
  };

  try {
    const result = await docClient.send(new QueryCommand(params));
    console.log(result.Items)
    return result.Items?.[0] || null;
  } catch (err) {
    console.error("Error querying player by CognitoSub:", err);
    throw new Error("Failed to retrieve player");
  }
};

/**
 * Get PlayerID by CognitoSub (Efficient with GSI).
 */
export const getPlayerIDByCognitoSub = async (cognitoSub) => {
  const player = await getPlayerByCognitoSub(cognitoSub);
  return player?.PlayerID || null;
};

/**
 * Get player details by PlayerID.
 */
export const getPlayerByID = async (reqPlayerID) => {
  const params = {
    TableName: "Players",
    Key: { PlayerID: String(reqPlayerID) }, // Ensure PlayerID is a string
  };

  try {
    const result = await docClient.send(new GetCommand(params));
    return result.Item || null;
  } catch (err) {
    console.error("❌ Error retrieving player by PlayerID:", err);
    throw new Error("Failed to retrieve player");
  }
};

/**
 * Update player's Bio.
 */
export const updatePlayerBio = async (PlayerID, newBio) => {
  const params = {
    TableName: "Players",
    Key: { PlayerID: String(PlayerID) },
    UpdateExpression: "SET Bio = :bio",
    ExpressionAttributeValues: { ":bio": newBio },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
  } catch (error) {
    console.error("❌ Error updating player bio:", error);
    throw error;
  }
};

/**
 * Fetches stories a player has participated in.
 */
// Get stories for a player
export const getStoriesForPlayer = async (PlayerID) => {
  try {
    // Step 1: Fetch Player's StoriesParticipated
    const playerParams = {
      TableName: "Players",
      Key: { PlayerID: PlayerID },  // Use PlayerID as partition key
      ProjectionExpression: "StoriesParticipated",
    };

    const playerResult = await docClient.send(new GetCommand(playerParams));

    // Get StoriesParticipated (string set)
    let storyIDs = playerResult.Item?.StoriesParticipated;

    // ✅ Fix: Convert DynamoDB String Set to an array properly
    if (storyIDs && typeof storyIDs === "object" && storyIDs.values) {
      storyIDs = Array.from(storyIDs.values()); // Convert String Set to array
    } else if (!Array.isArray(storyIDs)) {
      storyIDs = []; // Ensure it's an array if undefined
    }

    if (storyIDs.length === 0) {
      console.log(`✅ No stories found for PlayerID: ${PlayerID}`);
      return [];
    }

    console.log(`🔍 Fetching details for ${storyIDs.length} stories...`, storyIDs);

    // Step 2: Fetch story details for each StoryID using QueryCommand
    const storyPromises = storyIDs.map(async (StoryID) => {
      if (!StoryID) return null;

      console.log(`📌 Fetching StoryID:`, StoryID, `(Type: ${typeof StoryID})`);

      const storyParams = {
        TableName: "Stories",
        KeyConditionExpression: "StoryID = :storyID", // Query by StoryID (partition key)
        ExpressionAttributeValues: {
          ":storyID": StoryID, // Bind the value for StoryID
        },
        ProjectionExpression: "StoryID, title, description, DateCreated",
      };

      try {
        const storyResult = await docClient.send(new QueryCommand(storyParams));
        return storyResult.Items.length > 0 ? storyResult.Items[0] : null;
      } catch (error) {
        console.error(`❌ Error fetching story with StoryID: ${StoryID}`, error);
        return null;
      }
    });

    // Wait for all queries to resolve
    const stories = await Promise.all(storyPromises);
    return stories.filter((story) => story !== null); // Filter out null results

  } catch (error) {
    console.error("❌ Error fetching stories for player:", error);
    throw new Error("Failed to retrieve stories for player");
  }
};








// Test with a sample PlayerID
const PlayerID = 9123801402;

getStoriesForPlayer(PlayerID)
  .then(stories => console.log("📖 Stories participated in:", stories))
  .catch(error => console.error("❌ Error:", error));