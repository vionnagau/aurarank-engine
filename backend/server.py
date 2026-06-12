from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import torch
from model import AuraTwoTowerRanker
from dataset import AuraSearchDataset

# initializes the high-performance fastapi microservice
app = FastAPI(title="AuraRank Production API")

# configures cross-origin resource sharing (cors) for the next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# loads the core engine components into operational memory
dataset = AuraSearchDataset()
model = AuraTwoTowerRanker(vocab_size=10, catalog_size=10)

# explicitly casts the model to evaluation mode to disable training behaviors
model.eval()

@app.get("/rank")
async def execute_ranking(query_token_id: int = Query(..., description="the parsed numerical dictionary index token")):
    # simulates a production catalog of available content tags
    catalog_ids = torch.tensor([1, 2, 3, 4], dtype=torch.long)
    catalog_names = {1: "entertainment", 2: "tech", 3: "finance", 4: "animals"}
    
    # isolates the query processing to prevent unnecessary network graph execution
    query_tensor = torch.tensor([query_token_id], dtype=torch.long)
    
    # disables gradient tracking to maximize inference speed and save memory
    with torch.no_grad():
        # extracts dense vectors using the isolated network pathways
        q_emb = model.get_query_embedding(query_tensor)
        v_emb = model.get_video_embedding(catalog_ids)
        
        # calculates cosine alignments across the entire catalog matrix instantly
        similarities = torch.nn.functional.cosine_similarity(q_emb, v_emb)
    
    # formats the similarity matrix into structured python dictionaries
    results = []
    for i, score in enumerate(similarities.tolist()):
        results.append({
            "candidate": catalog_names[catalog_ids[i].item()],
            "relevance": round(score, 4)
        })
        
    # sorts the final payload by descending relevance metric (highest score first)
    results.sort(key=lambda x: x["relevance"], reverse=True)
    
    # serves the clean json payload back to the requesting client interface
    return {
        "status": "success",
        "ranked_results": results
    }