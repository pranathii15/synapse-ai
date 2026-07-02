import os
from dotenv import load_dotenv
from google import genai
from app.services.chat_history_service import save_chat

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def ask_gemini(context, question, feature="AI Assistant"):

    prompt = f"""
You are SynapseAI, an intelligent enterprise AI assistant.

You have access to the user's uploaded documents as well as your own general knowledge.

Follow these instructions carefully:

1. First, analyze the provided document context.

2. If the answer is found in the document:
   - Answer primarily using the uploaded document.
   - Clearly mention that the answer is based on the uploaded document.
   - If useful, provide additional explanation using your general knowledge to help the user understand better.
   - Do NOT repeat the same information twice.

3. If the answer is NOT found in the document:
   - Clearly state that the uploaded document does not contain the requested information.
   - Then answer the question using your general knowledge.
   - Clearly mention that the following explanation is based on general AI knowledge.

4. Keep the response professional, well-structured, and easy to read.

Format your response like this:

📄 From Uploaded Document
<Only include this section if relevant information exists in the document.>

🧠 Additional AI Explanation
<Include this only if it adds useful information.>

OR

📄 From Uploaded Document
The uploaded document does not contain information about this topic.

🧠 General AI Knowledge
<Answer the question using your knowledge.>

Document Context:
{context}

User Question:
{question}
"""

    for _ in range(3):

        try:

            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )

            answer = response.text

            # Automatically save every AI interaction
            save_chat(
                feature=feature,
                question=feature,
                answer=answer
            )

            return answer

        except Exception:
            time.sleep(2)

    return "AI service is temporarily unavailable. Please try again later."