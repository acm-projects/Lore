import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

// AWS DynamoDB Config
const client = new DynamoDBClient({ region: "us-east-2" });
const docClient = DynamoDBDocumentClient.from(client);

export const getPlayerByCognitoSub = async (cognitoSub) => {
  const params = {
    TableName: "Players",
    FilterExpression: "CognitoSub = :cognitoSub",  // Filter by the CognitoSub attribute
    ExpressionAttributeValues: {
      ":cognitoSub": cognitoSub,
    },
  };

  try {
    const result = await docClient.send(new ScanCommand(params));
    if (result.Items && result.Items.length > 0) {
      return result.Items[0];  // Assuming there is only one player with this CognitoSub
    } else {
      console.log("No player found with CognitoSub:", cognitoSub);
      return null;
    }
  } catch (err) {
    console.error("Error querying player by CognitoSub:", err);
    throw new Error("Failed to retrieve player");
  }
};









// Update player bio
export const updatePlayerBio = async (PlayerID, newBio) => {
  const params = {
    TableName: "Players",
    Key: { PlayerID: PlayerID }, // Update using PlayerID
    UpdateExpression: "SET Bio = :bio",
    ExpressionAttributeValues: { ":bio": newBio },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const result = await docClient.send(new UpdateCommand(params));
    console.log("✅ Player Bio updated successfully:", result.Attributes);
    return result.Attributes;
  } catch (error) {
    console.error("❌ Error updating player bio:", error);
    throw error;
  }
};

// Get profile data by CognitoSub
export const getPlayerIDByCognitoSub = async (cognitoSub) => {
  const params = {
    TableName: "Players",
    FilterExpression: "CognitoSub = :cognitoSub",
    ExpressionAttributeValues: {
      ":cognitoSub": cognitoSub,
    },
  };

  try {
    const result = await docClient.send(new ScanCommand(params));

    if (result.Items && result.Items.length > 0) {
      return result.Items[0].PlayerID;  // Return only the PlayerID
    } else {
      console.log("No player found with CognitoSub:", cognitoSub);
      return null;
    }
  } catch (err) {
    console.error("Error querying PlayerID by CognitoSub:", err);
    throw new Error("Failed to retrieve PlayerID");
  }
};

// Get profile data by PlayerID
export const getPlayerByID = async (reqPlayerID) => {
  const params = {
    TableName: "Players",
    Key: { PlayerID: reqPlayerID }, // Query by primary key
  };

  console.log("reqPlayerID");
  console.log("|-------------|");
  console.log(reqPlayerID);
  console.log("|-------------|");
  console.log("reqPlayerID");

  try {
    const result = await docClient.send(new GetCommand(params));

    if (result.Item) {
      console.log("✅ Player retrieved successfully:", result.Item);
      return result.Item; // Return all attributes of the player
    } else {
      console.log("❌ No player found with PlayerID:", reqPlayerID);
      return null;
    }
  } catch (err) {
    console.error("❌ Error retrieving player by PlayerID:", err);
    throw new Error("Failed to retrieve player");
  }
};


