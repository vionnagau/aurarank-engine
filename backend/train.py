import torch
import torch.optim as optim
import numpy as np
from dataset import AuraSearchDataset
from model import AuraTwoTowerRanker

def calculate_ndcg(relevance_scores, k=3):
    # calculates normalized discounted cumulative gain
    dcg = 0.0
    for i, rel in enumerate(relevance_scores[:k]):
        dcg += rel / np.log2(i + 2)
    
    # assumes ideal scenario where best items are sorted perfectly
    ideal_scores = sorted(relevance_scores, reverse=True)
    idcg = 0.0
    for i, rel in enumerate(ideal_scores[:k]):
        idcg += rel / np.log2(i + 2)
        
    if idcg == 0:
        return 0.0
    return dcg / idcg

def calculate_mrr(ranks):
    # calculates mean reciprocal rank for the first relevant item
    for i, rank in enumerate(ranks):
        if rank > 0:
            return 1.0 / (i + 1)
    return 0.0

def train_engine():
    # initializes dataset and model architectures
    dataset = AuraSearchDataset()
    model = AuraTwoTowerRanker(vocab_size=10, catalog_size=10)
    
    # configures the optimization engine to update neural weights
    optimizer = optim.Adam(model.parameters(), lr=0.01)
    
    # processes training over multiple passes (epochs)
    epochs = 15
    margin = 0.5
    
    print("initiating aurarank training sequence...\n")
    
    for epoch in range(epochs):
        # generates a new batch of simulated search data
        q, p, n = dataset.generate_batch(size=10)
        
        # resets gradients from the previous loop
        optimizer.zero_grad()
        
        # extracts dense vectors from the two-tower model
        q_emb, p_emb, n_emb = model(q, p, n)
        
        # calculates cosine similarity for positive and negative pairs
        sim_pos = torch.nn.functional.cosine_similarity(q_emb, p_emb)
        sim_neg = torch.nn.functional.cosine_similarity(q_emb, n_emb)
        
        # enforces pairwise ranking constraint via triplet margin loss
        loss_values = torch.relu(margin - sim_pos + sim_neg)
        loss = loss_values.mean()
        
        # triggers backpropagation to calculate mathematical gradients
        loss.backward()
        
        # updates neural network weights based on gradients
        optimizer.step()
        
        if epoch % 3 == 0:
            print(f"epoch {epoch} | training loss: {loss.item():.4f}")

if __name__ == "__main__":
    train_engine()
    
    # executes metric verification to ensure algorithms function correctly
    print("\nNDCG Verification Check:", calculate_ndcg([3, 2, 0], k=3))
    print("MRR Verification Check:", calculate_mrr([0, 1, 0]))