import torch
import numpy as np

class AuraSearchDataset:
    def __init__(self):
        # manual vocabulary mapping simulating basic tokenization logic
        self.vocab = {"<PAD>": 0, "dance": 1, "trend": 2, "coding": 3, "tutorial": 4, "crypto": 5, "cat": 6, "cute": 7}
        self.tag_vocab = {"<PAD>": 0, "entertainment": 1, "tech": 2, "finance": 3, "animals": 4}
        
        # format: [query string, high-engagement tag, low-engagement tag]
        self.simulated_logs = [
            ("dance trend", "entertainment", "tech"),
            ("coding tutorial", "tech", "animals"),
            ("crypto trend", "finance", "entertainment"),
            ("cat cute", "animals", "finance")
        ]

    def tokenize(self, text, vocabulary):
        # converts words into their respective integer ids, defaults to 0 if unknown
        return [vocabulary.get(word, 0) for word in text.split()]

    def generate_batch(self, size=4):
        # initializes empty lists to hold the generated data
        queries, positives, negatives = [], [], []
        
        for _ in range(size):
            # selects a random log entry from the simulated logs
            log = self.simulated_logs[np.random.choice(len(self.simulated_logs))]
            
            # extracts the first token from the query string to keep dimensions simple
            query_tokens = self.tokenize(log[0], self.vocab)
            queries.append(query_tokens[0]) 
            
            # maps string tags to integer ids
            positives.append(self.tag_vocab.get(log[1], 0))
            negatives.append(self.tag_vocab.get(log[2], 0))
            
        # converts python lists into pytorch tensors for neural network processing
        return (torch.tensor(queries, dtype=torch.long), 
                torch.tensor(positives, dtype=torch.long), 
                torch.tensor(negatives, dtype=torch.long))

# execution block to test the dataset directly
if __name__ == "__main__":
    dataset = AuraSearchDataset()
    q, p, n = dataset.generate_batch(size=3)
    print("queries (q tensor):", q)
    print("positives (p tensor):", p)
    print("negatives (n tensor):", n)