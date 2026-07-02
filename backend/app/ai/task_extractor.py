import os
import json
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def extract_tasks(transcript):

    prompt = f"""
You are an enterprise AI assistant.

Analyze this meeting transcript.

Extract ONLY the action items.

Return ONLY valid JSON.

Format:

[
  {{
    "title":"...",
    "description":"...",
    "assigned_to":"...",
    "priority":"High"
  }}
]

Transcript:

{transcript}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    text = response.text.strip()

    # Remove markdown if Gemini wraps JSON in ```json
    text = text.replace("```json", "").replace("```", "").strip()

    return json.loads(text)