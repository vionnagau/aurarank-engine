import os
import google.generativeai as genai
from pydantic import BaseModel
from dotenv import load_dotenv

# Load the API key from your new .env file
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize the model
model = genai.GenerativeModel('gemini-2.5-flash')

# Define the exact JSON structure we want Gemini to return
class RankingJustification(BaseModel):
    confidence_score: int
    primary_reason: str
    semantic_overlap: str

def generate_agentic_justification(query: str, retrieved_candidate: str, vector_score: float) -> str:
    """
    Acts as an AI Search Agent to justify the vector similarity score.
    """
    prompt = f"""
    You are an AI Search Ranking Engineer.
    A vector database matched the query '{query}' to the candidate '{retrieved_candidate}' 
    with a vector similarity score of {vector_score}.
    
    Provide a strict, analytical justification for why this match makes sense.
    """
    
    # Force the model to return structured JSON
    response = model.generate_content(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json",
            response_schema=RankingJustification,
            temperature=0.1, # Keep it strictly analytical
        ),
    )
    
    return response.text