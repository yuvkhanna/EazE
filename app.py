from flask import Flask, render_template, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Your Hugging Face API token
HUGGINGFACE_API_KEY = 'your_api_key'  #Hugging Face API Key

@app.route('/')
def home():
    return render_template('index_self.html')

@app.route('/api/search', methods=['POST'])
def search():
    data = request.json
    query = data.get('query')
    if not query:
        return jsonify({"error": "No query provided"}), 400

    # OpenAI API call
    headers = {
        "Authorization": f"Bearer {HUGGINGFACE_API_KEY}",
        "Content-Type": "application/json"
    }

    json_data = {
        "inputs": query,  # User iNPUT
        "options": {
            "wait_for_model": True  
        }
    }

    
    try:
        response = requests.post('https://api.openai.com/v1/chat/completions', headers=headers, json=json_data)
        response.raise_for_status() 
        return jsonify(response.json())

    except requests.exceptions.RequestException as e:
        # Log the error on the server-side and return an error message
        print(f"Error with OpenAI API request: {e}")
        return jsonify({"error": "API request failed"}), 500


if __name__ == '__main__':
    app.run(debug=True)
