import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def generate_meeting_minutes(transcript):

    prompt = f"""
You are an enterprise AI meeting assistant.

Analyze this meeting transcript.

Generate:

1. Meeting Summary

2. Key Decisions

3. Action Items

4. Risks

5. Next Steps

Transcript:

{transcript}

Return the answer in clean markdown.
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text