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
    round_number = data.get("round", 1)
    is_final = data.get("final", False)

    # 🧠 Prompt logic for final round vs normal
    if is_final:
        instruction = (
            f"With this story:\n\n{current_story}\n\n"
            f"write a conclusion in three short, numbered paragraphs following this prompt: {prompt}. "
            "End with a new line and ..."
        )
    elif round_number == 1:
        instruction = (
            f"Provide only three short numbered paragraphs to start the story using this prompt:\n{prompt}\n"
            "After the three paragraphs, do not include any further explanation or comments. End with a new line and ..."
        )
    else:
        instruction = (
            f"Using the following prompt: {prompt}, generate 3 short numbered paragraphs to continue the following story:\n\n"
            f"{current_story}\n\n"
            "Only generate 3 short paragraphs. Do not include anything else after. End with a new line and ..."
        )

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


# ✅ NEW: Summarize full story into a paragraph
@app.route('/summarize', methods=['POST'])
def summarize_story():
    data = request.json
    full_story = data.get("story", "")

    if not full_story:
        return jsonify({"error": "No story provided"}), 400

    # Instruction for summarization
    instruction = (
        f"Summarize the following story into one concise paragraph:\n\n{full_story}\n\n"
        "Only give a single paragraph with no introduction or follow-up."
    )

    payload = {
        "prompt": instruction,
        "temperature": 0.5
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
        summary_text = response_body.get("generation", response_body.get("output", "Error generating summary"))

    except Exception as e:
        summary_text = f"Error: {str(e)}"

    return jsonify({"summary": summary_text})


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
