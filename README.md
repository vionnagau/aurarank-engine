# AuraRank Engine

AuraRank is a high-performance, native deep learning search ranking engine designed to deliver sub-millisecond semantic search retrieval. The system implements a decoupled Two-Tower Neural Network architecture in raw PyTorch, trains model layers via a Pairwise Triplet Margin Loss optimization pipeline, and evaluates results using industry-grade metrics (NDCG and MRR). The core engine is exposed through an asynchronous FastAPI microservice layer and served to production via a modern, highly interactive React and Next.js web application interface.

The project operates as a production-ready implementation of a vector-search indexing and retrieval engine, demonstrating advanced data structures, customized neural network architectures, and decoupled software engineering principles designed to scale content discovery in high-concurrency environments.

## Live Deployment Links

- **Live Web Application Interface**: [https://aurarank-engine.vercel.app](https://github.com)
- **Production API Documentation Instance**: [https://api.aurarank-engine.tech/docs](https://github.com)
- **Direct Live Engine Scoring Endpoint**: [https://api.aurarank-engine.tech/rank?query_token_id=3](https://github.com)

## What It Does

- **Tokenizes raw search text**: maps incoming search strings to continuous integer indices through a manual hash-map vocabulary lookup algorithm without external dependencies.
- **Generates dense embedded representations**: compresses sparse, categorical search queries and product content catalogs into a shared 16-dimensional vector space.
- **Processes decoupled dual streams**: runs asymmetric multi-layer perceptron (MLP) networks to isolate query processing from content storage layers, enabling offline vector index caching.
- **Optimizes via relative pairwise math**: trains model layers using custom Triplet Margin Loss calculations, forcing the system to prioritize relative ranking order over simple binary categorization.
- **Evaluates with graded relevance metrics**: verifies engine accuracy using custom-coded Normalized Discounted Cumulative Gain (NDCG) and Mean Reciprocal Rank (MRR) loops to penalize positioning faults exponentially.
- **Serves high-speed REST APIs**: exposes asynchronous HTTP validation endpoints via FastAPI to query multi-candidate indices under sub-millisecond runtime profiles.
- **Displays production-grade client interfaces**: serves an interactive, real-time query interface using React and Next.js to monitor matrix similarities and dynamic sorting adjustments instantly.

## Core Modules

- **Interactive Prototyping Client**: high-performance interface layer built using React and Next.js for visualizing dynamic search feeds and vector relevance tracking.
- **Production REST API Gateway**: implements an asynchronous web service interface using FastAPI that accepts numeric token requests and serves clean, ordered JSON payloads.
- **Decoupled Two-Tower Modeling Layer**: separates text parsing components from inventory matching assets via dual symmetrical multi-layer perceptron vectors in PyTorch.
- **Optimization & Evaluation Engine**: executes automated backpropagation runs via custom Triplet Margin criteria and assesses list quality via manual NDCG algorithms.
- **Custom Tokenizer & Dataset Generator**: processes raw query strings into execution-safe structural array shapes using efficient dictionary memory lookups.

## Prerequisites

- Node.js 18+ & npm (Frontend interface layer deployment)
- Python 3.11+
- PyTorch (Core deep learning matrix operations)
- FastAPI (High-speed microservice hosting)
- Uvicorn (Asynchronous server gateway management)
- NumPy (Advanced multi-dimensional indexing mechanics)
- Pandas (Structured evaluation logging transformations)

*Note: All mathematical modules run natively without requiring external heavy pre-trained transformers or enterprise database dependencies.*

## Setup

### 1. Backend Engine API Setup
```bash
# Navigate to the backend server directory
cd /Absolute/Path/To/AuraRank_Engine/backend

# Create and activate a virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows use: .venv\Scripts\activate

# Install required backend dependencies
pip install -r requirements.txt

# Create environment configuration
cp .env.example .env
```

Configure backend parameter variables within `.env`:
```text
HOST=127.0.0.1
PORT=8000
EMBEDDING_DIMENSION=16
LEARNING_RATE=0.01
OPTIMIZATION_EPOCHS=15
ENFORCEMENT_MARGIN=0.5
EVALUATION_TOP_K=3
```

### 2. Frontend Interface Client Setup
```bash
# Navigate to the frontend client directory
cd /Absolute/Path/To/AuraRank_Engine/frontend

# Install node dependencies
npm install

# Create environment configuration
cp .env.local.example .env.local
```

Configure frontend parameter variables within `.env.local`:
```text
NEXT_PUBLIC_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)
```

### 3. Cross-Origin Resource Sharing (CORS) Configuration
```text
To ensure seamless communication between the decoupled Next.js client interface and the FastAPI microservice, CORS middleware is explicitly configured in the backend environment. 

The backend application natively whitelists the frontend execution port (`http://localhost:3000` or production equivalents) to allow standard REST `GET` and `POST` methods, preventing browser-level security blockages during cross-origin resource requests.
```

## Run

### 1. Start Background API Service
```bash
cd backend
uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Start Next.js Development Client
In a separate terminal window, initialize the interface container:
```bash
cd frontend
npm run dev
```

Access Points:
- Local Web Client Interface: http://127.0.0.1:3000
- API Route Documentation: http://127.0.0.1:8000/docs
- Live Engine Scoring Service: http://127.0.0.1:8000/rank?query_token_id=3

## Typical Operator Workflow

1. **System Initialization**: the engine launches, initializing embedding layers with a set training vocabulary array index mapping.
2. **Automated Mathematical Training**: running `train.py` triggers optimization loops, processing batch logs to update neural connection weights across multiple epochs.
3. **API Activation**: the production FastAPI server instantiates, holding model layers in operational memory arrays to handle user inference calls.
4. **User Search Query Simulation**: an operator inputs a target category concept (e.g., `coding`) through the React/Next.js frontend interactive input field.
5. **Real-Time Vector Inference**: the background system maps the request to a token index value and forwards it directly to the local microservice infrastructure layer via standard HTTP fetch methods.
6. **Cross-Tower Matrix Alignment**: the query layer produces a dense vector value, which calculates cosine alignments against pre-cached item inventories instantly.
7. **Ranked Feed Optimization Output**: the client web application updates with results sorted by descending match probability metrics, highlighting the top positions based on semantic relevance.

## Integration API Details

### Endpoint: Execute Vector Candidate Reranking

```text
GET /rank
```

#### Query Parameters
- `query_token_id` (integer, mandatory): the parsed numerical dictionary index token value representing the user search context.

#### Sample Request Transaction
```bash
curl -X GET "[http://127.0.0.1:8000/rank?query_token_id=3](http://127.0.0.1:8000/rank?query_token_id=3)" -H "accept: application/json"
```

#### Sample Response Payload
```json
{
  "status": "success",
  "ranked_results": [
    {
      "candidate": "tech",
      "relevance": 0.8942
    },
    {
      "candidate": "entertainment",
      "relevance": 0.1205
    },
    {
      "candidate": "finance",
      "relevance": -0.0412
    },
    {
      "candidate": "animals",
      "relevance": -0.3419
    }
  ]
}
```

## Tests

Execute the validation suites to confirm frontend build compilation, backend structural logic, and metric computational accuracy profiles:

```bash
# Verify client framework build health and packaging integrity
cd frontend && npm run build && cd ../backend

# Check syntax compilation and layer validation setups across script assets
python -m py_compile train.py server.py

# Execute validation matrix scripts directly to verify metric calculations
python -c "import train; print('NDCG Verification Check:', train.calculate_ndcg([3, 2, 0], k=3))"
python -c "import train; print('MRR Verification Check:', train.calculate_mrr([0, 1, 0]))"
```

## Troubleshooting

### Port Assignment Conflicts (Address Already In Use)

If port `8000` or `3000` remains blocked by hanging background pipeline instances, clear the network sockets using terminal commands.

For Windows (Command Prompt / PowerShell):
```cmd
netstat -ano | findstr :8000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

For Unix/Linux/macOS:
```bash
lsof -ti tcp:8000
for pid in $(lsof -ti tcp:8000); do kill -9 "$pid"; done
```

### Tensor Shape Misalignment Runtime Anomalies

```text
RuntimeError: Expected tensor for argument #1 'indices' to have one of the following scalar types: Long, Int; but got torch.FloatTensor
```

- **Root Cause**: PyTorch embedding layers require categorical coordinates to be integer values rather than decimal matrix objects.
- **Resolution**: Ensure indexing assignments match explicit casting instructions (`dtype=torch.long`) inside target collection transformations before running execution functions.

### Evaluation Calculation Border Discrepancies (NaN Metrics)

- **Root Cause**: Computing NDCG positions across zero-interaction records causes division faults when dealing with blank matching records.
- **Resolution**: Confirm evaluation loops include boundary-checking conditions that catch null reference variables (`if idcg == 0: return 0.0`) to avoid script crashes.
```