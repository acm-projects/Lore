from flask import Flask, request, jsonify
import boto3
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Initialize Amazon Bedrock AI
bedrock = boto3.client(service_name="bedrock-runtime")

@app.route('/generate', methods=['POST'])
def generate_story():
    data = request.json
    prompt = data.get("prompt", "")
    current_story = data.get("current_story", "")
    round_number = data.get("round", 1)  # Default to round 1

    if round_number == 1:
        instruction = f"Provide only three paragraphs to start the story using this prompt:\n{prompt}\n After the three paragraphs I do not want any further output and end with a new line and ..."
    else:
        instruction = f"Using the following prompt:{prompt}\n Generate 3 short paragraphs to continue the following story:\n\n{current_story}\n\nContinue the story by adding the three short paragraphs and do not generate further after 3 paragraphs and end with a new line and ..."

    # AI Generation Configuration
    payload = {
        "prompt": instruction,
        "temperature": 0.9
    }

    body = json.dumps(payload)
    model_id = "meta.llama3-3-70b-instruct-v1:0"

    try:
        response = bedrock.invoke_model(
            body=body,
            modelId=model_id,
            accept="application/json",
            contentType="application/json",
        )
        response_body = json.loads(response.get("body").read())
        story_text = response_body.get("generation", response_body.get("output", "Error generating response"))

    except Exception as e:
        story_text = f"Error: {str(e)}"

    return jsonify({"story": story_text})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
