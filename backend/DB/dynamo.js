const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-2", // e.g., "us-east-1"
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Use environment variables
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();