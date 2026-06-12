import torch
import torch.nn as nn

class AuraTwoTowerRanker(nn.Module):
    def __init__(self, vocab_size, catalog_size, embed_dim=16):
        # initializes the parent neural network module
        super().__init__()
        
        # lookup tables that convert integer ids into 16-dimensional dense vectors
        self.query_embeddings = nn.Embedding(vocab_size, embed_dim)
        self.video_embeddings = nn.Embedding(catalog_size, embed_dim)
        
        # query processing pathway (multi-layer perceptron)
        self.query_tower = nn.Sequential(
            nn.Linear(embed_dim, 32),
            nn.ReLU(),
            nn.Linear(32, 16)
        )
        
        # video/tag processing pathway (symmetric multi-layer perceptron)
        self.video_tower = nn.Sequential(
            nn.Linear(embed_dim, 32),
            nn.ReLU(),
            nn.Linear(32, 16)
        )

    def forward(self, query_ids, pos_video_ids, neg_video_ids):
        # pushes query tokens through the query embedding and tower layers
        q_emb = self.query_tower(self.query_embeddings(query_ids))
        
        # pushes both positive and negative video tokens through the video layers
        pos_v_emb = self.video_tower(self.video_embeddings(pos_video_ids))
        neg_v_emb = self.video_tower(self.video_embeddings(neg_video_ids))
        
        # returns all three output vectors for pairwise loss calculation
        return q_emb, pos_v_emb, neg_v_emb

    def get_query_embedding(self, query_id):
        # isolates the query pathway for real-time production inference
        return self.query_tower(self.query_embeddings(query_id))

    def get_video_embedding(self, video_id):
        # isolates the video pathway for background catalog indexing
        return self.video_tower(self.video_embeddings(video_id))

# execution block to verify the network structure independently
if __name__ == "__main__":
    # sets up dummy vocabulary sizes matching our dataset logic
    test_vocab_size = 10
    test_catalog_size = 5
    
    # initializes the neural network engine
    model = AuraTwoTowerRanker(test_vocab_size, test_catalog_size)
    
    # creates mock tensor data to simulate a batch of 3 search queries
    mock_queries = torch.tensor([1, 6, 3], dtype=torch.long)
    mock_pos = torch.tensor([1, 4, 2], dtype=torch.long)
    mock_neg = torch.tensor([2, 3, 4], dtype=torch.long)
    
    # runs data through the forward assembly line
    q_out, pos_out, neg_out = model(mock_queries, mock_pos, mock_neg)
    
    print("query tower output shape:", q_out.shape)
    print("positive tower output shape:", pos_out.shape)
    print("negative tower output shape:", neg_out.shape)