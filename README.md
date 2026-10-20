# THE LAST CLUE — Procedurally Generated Mystery Investigation Game

**THE LAST CLUE** is an interactive, DSA-focused mystery investigation game where every new case is procedurally generated using fundamental Data Structures and Algorithms without relying on AI/LLMs.

---

## 🎯 Project Purpose

The primary objective of this project is to demonstrate the power of pure **Data Structures and Algorithms** in procedural content generation (PCG). Players take on the role of a detective, investigating procedural mystery cases where clues, suspects, motives, locations, evidence, and events are connected in a complex relationship graph.

---

## ⚡ Core DSA Requirements & Architecture Rules

1. **No AI / LLMs**: Case generation and solvability checking are 100% algorithmic.
2. **Manual DSA Implementations**: Core data structures and graph algorithms (Graph via Adjacency List, BFS, DFS, Backtracking, HashMap, Set) must be implemented from scratch without using third-party graph/DSA libraries.
3. **Decoupled Architecture**: The backend DSA engine operates completely independent of Express routes, database schemas, or React components, ensuring high modularity and testability.
4. **Visualization Libraries**: UI visualization libraries (such as React Flow) are restricted strictly to visual rendering in the frontend.

---

## 🛠️ Tech Stack

- **Frontend**: React, JavaScript (ES6+), HTML5, CSS3, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose - Phase 4+)
- **Visualization**: React Flow (Phase 5+)
- **Tools**: VS Code, Git, GitHub

---

## 📂 Project Folder Structure

```text
THE_LAST_CLUE_/
│
├── frontend/                 # React Single Page Application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Modular UI components
│   │   ├── pages/            # Main application views/pages
│   │   ├── services/         # API HTTP service layer
│   │   ├── game/             # Client-side game engine & graph visualization hooks
│   │   ├── styles/           # CSS styles
│   │   ├── App.jsx           # Root React component
│   │   └── main.jsx          # Application entry point
│   ├── .env.example          # Sample environment variables template
│   ├── .gitignore
│   ├── package.json          # Frontend dependency manifest
│   └── vite.config.js        # Vite build tool configuration
│
├── backend/                  # Node.js + Express API & DSA Generator Engine
│   ├── src/
│   │   ├── algorithms/       # Custom manual DSA implementations (Graph, BFS, DFS, Backtracking)
│   │   ├── generators/       # Procedural mystery case generation logic
│   │   ├── models/           # MongoDB schemas & data models
│   │   ├── controllers/      # Express API request controllers
│   │   ├── routes/           # Express router definitions (/api/health, etc.)
│   │   ├── services/         # Service layer connecting generators to controllers
│   │   ├── utils/            # Helper functions & custom error handlers
│   │   ├── config/           # Database connection & server environment config
│   │   └── index.js          # Express app entry point & server initialization
│   ├── .env.example          # Sample environment variables template
│   ├── .gitignore
│   └── package.json          # Backend dependency manifest
│
├── .gitignore                # Root gitignore file
└── README.md                 # Project documentation & execution guide
```

---

## 🚀 How to Run the Application

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

---

### 1. Setting Up & Running the Backend

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will launch on `http://localhost:5000`.*
   *Health Check URL: `http://localhost:5000/api/health`*

---

### 2. Setting Up & Running the Frontend

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```
   *The application will open on `http://localhost:5173`.*

---
---

## 🕸️ Graph Data Structure (Phase 2 DSA Engine)

### 1. Why a Graph is Required for This Project
In *THE LAST CLUE*, a mystery is not a simple linear sequence of events; it is a **web of interconnected entities** (suspects, clues, crime scenes, murder weapons, motives, and alibis). A player solves a case by traversing from known evidence through intermediate clues and locations until reaching the culprit. 

A **Graph $G = (V, E)$** is mathematically and structurally the exact abstraction required to model this world:
- Nodes represent the investigation entities.
- Edges represent causal, physical, or social relationships between them.
- Graph traversals (BFS, DFS) allow the engine to verify solvability, calculate shortest deduction paths, and reveal clues dynamically as the player makes inquiries.

---

### 2. Why Adjacency List is Being Used
Graphs are typically implemented using either an **Adjacency Matrix** or an **Adjacency List**. 

In an investigation network:
- The graph is **sparse**: $|E| \ll |V|^2$. Each suspect or clue connects to only a handful of other entities.
- An **Adjacency Matrix** would require $O(|V|^2)$ memory, creating a massive grid of empty cells, and retrieving neighbors would always take $O(|V|)$ time.
- An **Adjacency List** uses only $O(|V| + |E|)$ space, scaling efficiently with game size.
- **Our Implementation Choice**: Instead of an array of neighbors, we use a **nested Map structure** (`Map<nodeId, Map<neighborId, Edge>>`). This provides **$O(1)$ edge existence checks (`hasEdge`)**, **$O(1)$ edge deletions**, and **$O(1)$ duplicate prevention**, while retaining optimal $O(\text{deg}(u))$ traversal speed over neighbors for BFS/DFS.

---

### 3. What Nodes Represent
Each node in the graph represents an investigative entity:
- **`suspect`**: Individuals involved in the case (e.g., Lord Harrington, Gardener Thomas).
- **`clue`**: Informational discovery that points toward someone or somewhere (e.g., Torn Letter).
- **`location`**: Physical crime scenes or areas of interest (e.g., Greenhouse, Wine Cellar).
- **`evidence`**: Tangible physical artifacts (e.g., Bloody Gardening Shears).
- **`motive`**: Underlying reasons for the crime (e.g., Blackmail, Inheritance).
- **`event`**: Timeline occurrences (e.g., Power Outage at 10:00 PM).

Each node stores an identifier, entity type, display label, and an extensible `metadata` object (e.g., alibis, timestamps, discovery states).

---

### 4. What Edges Represent
Edges represent the semantic relationships and connections between entities:
- **`knows`**: Relationship between suspects.
- **`found_at`**: Physical link between a clue/evidence and a location.
- **`connected_to`**: Associative link between crime scene entities.
- **`belongs_to`**: Ownership or attribution to a suspect.
- **`points_to`**: Clue indicating suspicion toward an entity.
- **`witnessed`**: Suspect seeing an event or other suspect.
- **`owns`**: Suspect possessing a piece of evidence.

Edges also support optional metadata (e.g., confidence level, forensic notes).

---

### 5. Why the Graph is Manually Implemented
- **University DSA Authenticity**: University DSA projects evaluate manual algorithmic comprehension. Using libraries like NetworkX or npm packages bypasses fundamental pointer and map manipulation.
- **Tailored Memory Layout**: Custom `Map<string, Map<string, Edge>>` achieves constant-time edge lookups without array scanning overhead.
- **Decoupled Architecture**: Clean separation between pure graph algorithms and game-specific generators.

---

### 6. ASCII Graph Representation of Investigation Chain

```text
       +-------------------------------+
       |    Suspect_A (Lord Harrington)|
       +---------------+---------------+
                       |
                       | [points_to] (Letter mentions Lord Harrington)
                       v
       +---------------+---------------+
       |      Clue_1 (Torn Letter)     |
       +---------------+---------------+
                       |
                       | [found_at] (Discovered in flowerpot)
                       v
       +---------------+---------------+
       |    Location_1 (Greenhouse)    |
       +---------------+---------------+
                       |
                       | [connected_to] (Hidden beneath workbench)
                       v
       +---------------+---------------+
       | Evidence_1 (Gardening Shears) |
       +---------------+---------------+
                       |
                       | [belongs_to] (Engraved with initials T.G.)
                       v
       +---------------+---------------+
       |   Suspect_B (Gardener Thomas) |
       +-------------------------------+
```

Corresponding Adjacency List:
```text
  "Suspect_A"   -> [ "Clue_1" ]
  "Clue_1"      -> [ "Suspect_A", "Location_1" ]
  "Location_1"  -> [ "Clue_1", "Evidence_1" ]
  "Evidence_1"  -> [ "Location_1", "Suspect_B" ]
  "Suspect_B"   -> [ "Evidence_1" ]
```

---

### 7. Time and Space Complexity

| Operation | Adjacency Matrix | Naive Array Adj List | Our Map-based Adj List | Explanation |
|---|---|---|---|---|
| `addNode(id)` | $O(V^2)$ | $O(1)$ | **$O(1)$** | Constant-time Map insertion |
| `removeNode(id)` | $O(V^2)$ | $O(V + E)$ | **$O(\text{deg}(u))$** | Removes incident edges only from immediate neighbors |
| `addEdge(u, v)` | $O(1)$ | $O(\text{deg}(u))$ | **$O(1)$** | Constant-time Map lookup and insertion |
| `removeEdge(u, v)` | $O(1)$ | $O(\text{deg}(u))$ | **$O(1)$** | Constant-time deletion from nested Map |
| `hasNode(id)` | $O(1)$ | $O(1)$ | **$O(1)$** | Direct `nodes.has(id)` check |
| `hasEdge(u, v)` | $O(1)$ | $O(\text{deg}(u))$ | **$O(1)$** | Direct inner Map `.has(v)` check |
| `getNeighbors(u)` | $O(V)$ | $O(\text{deg}(u))$ | **$O(\text{deg}(u))$** | Iterates directly over existing adjacent vertices |
| `getNodes()` | $O(V)$ | $O(V)$ | **$O(V)$** | Collects all nodes in graph |
| `getEdges()` | $O(V^2)$ | $O(E)$ | **$O(E)$** | Collects all unique edges in graph |
| **Space Complexity** | $O(V^2)$ | $O(V + E)$ | **$O(V + E)$** | Optimal space efficiency for sparse graph networks |

---

## 🔍 BFS and DFS Traversal Engine (Phase 3)

The traversal engine operates directly on the custom `Graph` instance via `graph.getNeighbors(nodeId)`.

### 1. Breadth-First Search (BFS)
- **Queue Mechanism**:
  - Operates using a First-In-First-Out (FIFO) queue. Starting at `startNodeId` (distance 0), all direct neighbors are processed (distance 1), followed by their unvisited neighbors (distance 2), radiating outwards in concentric layers.
  - To prevent $O(V)$ array re-indexing overhead from repeated `Array.prototype.shift()`, a pointer index (`head`) is incremented, ensuring true amortized **$O(1)$** dequeue operations.
- **Visited Tracking**:
  - Nodes are added to a `visited` Set immediately upon being **enqueued** (rather than dequeued). This guarantees no vertex is placed onto the queue more than once.
- **Why BFS Gives Shortest Path in an Unweighted Graph**:
  - In an unweighted graph, every edge represents a uniform hop cost of 1.
  - BFS explores vertices in strictly monotonically non-decreasing order of their edge distance from the root:
    $$\text{Layer } 0 \to \text{Layer } 1 \to \text{Layer } 2 \dots \to \text{Layer } k$$
  - Layer $k$ is completely exhausted before any node at distance $k+1$ is reached. Therefore, the very first time the target node is encountered during traversal, the discovered path is mathematically guaranteed to contain the minimum number of edge hops.
- **Time Complexity**: **$O(V + E)$**, where each vertex is enqueued/dequeued once and every incident edge is inspected.
- **Space Complexity**: **$O(V)$**, for the queue, `visited` Set, `distances` map, and `parents` predecessor map.

### 2. Depth-First Search (DFS)
- **Recursion & Call Stack**:
  - Implemented recursively using the runtime call stack. Traversal dives down a single relationship branch until hitting a dead end (no unvisited neighbors), then backtracks to previous decision points.
- **Visited Tracking**:
  - A `visited` Set records every explored node ID upon entry. Because our investigation graph is undirected (bidirectional edges), visited tracking prevents infinite recursive ping-pong loops between adjacent vertices.
- **Time Complexity**: **$O(V + E)$**, visiting every reachable vertex and inspecting every incident edge.
- **Space Complexity**: **$O(V)$**, bounded by the recursion stack depth (at most $V$ in a linear chain) and the `visited` Set.

### 3. Connected Components (`isConnected` & `findConnectedComponents`)
- An investigation network may feature disjoint sub-graphs (e.g., active crime scene vs. an unrelated cold case).
- **`isConnected(graph)`**: Evaluates whether all nodes belong to a single connected component by running a traversal from node 0 and checking if `visited.size === graph.getNodeCount()`.
- **`findConnectedComponents(graph)`**:
  - Loops over all vertices $u \in V$. If $u$ is unvisited in a global Set, it seeds a new component.
  - Executes a traversal discovering all mutually reachable nodes in that cluster, then advances to the next unvisited vertex.
  - **Time Complexity**: **$O(V + E)$** total across all components.
  - **Space Complexity**: **$O(V)$**.

### 4. Cycle Detection in Undirected Graphs (`hasCycle`)
- In an undirected graph, every edge between $u$ and $v$ is stored symmetrically ($u \to v$ and $v \to u$).
- A naive cycle check would immediately mistake the reverse edge back to the predecessor as a cycle.
- **Parent Tracking Algorithm**:
  - During recursive DFS traversal from $u$ to neighbor $v$, we pass $u$ as $v$'s `parent`: `dfs(v, u)`.
  - For every neighbor $w$ of $v$:
    - If $w$ is unvisited $\implies$ recurse `dfs(w, v)`.
    - If $w$ is already visited **AND** $w \neq \text{parent} \implies$ a **back-edge** exists, proving a cycle!
  - Disconnected graphs are supported by running the check across all unvisited components.
- **Time Complexity**: **$O(V + E)$** (terminates immediately upon finding any back-edge; in acyclic undirected graphs $E \le V - 1$, so it completes in $O(V)$).
- **Space Complexity**: **$O(V)$**.

---

### 5. Mystery Game Connection

> [!IMPORTANT]
> BFS and DFS are **traversal and analytical tools** operating on the graph. They do **NOT** determine the culprit or invent narrative facts. The procedural mystery generator (Phase 4) creates the underlying truth using logical constraints and backtracking.

- **BFS in the Investigation Game**:
  - **Evidence Proximity**: Calculates the shortest evidence distance between known clues and unvisited leads.
  - **Dynamic Clue Unlocks**: Reveals nearby clues based on the detective's current position or active inquiries.
  - **Shortest Deduction Paths**: Verifies that the player can logically deduce the culprit within a reasonable number of clue connections.
- **DFS in the Investigation Game**:
  - **Deep Narrative Chains**: Follows a specific line of questioning or thread of evidence to its conclusion.
  - **Cluster Detection**: Identifies disconnected subplots, separate locations, or isolated red herrings.
  - **Cycle & Contradiction Detection**: Detects circular alibis (e.g., Suspect A alibis Suspect B, who alibis Suspect C, who alibis Suspect A) or contradictory timeline loops.

---

## 🧠 Backtracking Engine (Phase 4)

### 1. What Backtracking Is
Backtracking is a systematic algorithmic technique for solving **Constraint Satisfaction Problems (CSPs)**. It incrementally builds candidates for solutions and abandons ("backtracks" from) any candidate as soon as it determines that the candidate cannot possibly lead to a valid complete solution.

```text
Start
├── Candidate A
│   ├── Valid → continue
│   └── Invalid → backtrack
└── Candidate B
    └── Valid solution
```

---

### 2. Why This Project Needs Backtracking
*THE LAST CLUE* strictly forbids AI/LLMs for procedural generation. A coherent mystery cannot be generated through purely random selection, as random generation frequently produces unsolvable contradictions (e.g., a suspect having an alibi in the library while simultaneously wielding a weapon in the conservatory).

The Backtracking Engine provides a **guaranteed, deterministic mathematical solver** that finds a mutually consistent set of narrative facts (culprit, motive, weapon, crime scene, alibis) satisfying all detective-fiction rules.

---

### 3. How Recursive Search Works
The solver (`solveWithBacktracking`) explores a decision tree where each level of recursion corresponds to assigning a value to one variable:
1. **Base Case**: If all variables have been assigned and all constraints hold, return `{ solved: true, assignment }`.
2. **Variable Selection**: An unassigned variable is selected (either sequentially or via the Minimum Remaining Values heuristic).
3. **Candidate Loop**: The solver iterates over the domain of values for that variable.
4. **Recursive Step**: For each value, if the partial assignment is consistent, the solver recurses to depth $+ 1$.

---

### 4. Constraint Checking & Partial Assignment Pruning
Constraints are pure predicate functions: `(assignment, isComplete) => boolean`.
- **Early Pruning**: Rather than waiting until all variables are assigned, constraints are tested on **partial assignments**.
- If assigning `(culprit: "Lord Harrington", motive: "Money")` violates a wealthy-suspect constraint, the solver prunes that branch immediately at Depth 1, skipping the entire exponential subtree of weapons, locations, and evidence combinations underneath it.

---

### 5. The Backtracking / Undo Step
The distinguishing feature of genuine backtracking is the explicit **undo**:
```javascript
assignment[variable] = candidateValue; // Try candidate

if (checkConstraints(assignment, constraints)) {
  const success = backtrack(depth + 1); // Recurse
  if (success) return true;
}

// CONTRADICTION ENCOUNTERED: UNDO / BACKTRACK
delete assignment[variable];
```
This restores the exact previous state before trying the next candidate value, guaranteeing zero state leakage between search branches.

---

### 6. Minimum Remaining Values (MRV) Optimization
When `options.useMRV = true` is enabled, the variable selection step chooses the unassigned variable with the fewest remaining valid candidate values given the current partial assignment ("fail-first" principle). This minimizes the branching factor of the search tree.

---

### 7. Time and Space Complexity
Let $V = |\mathcal{V}|$ be the number of variables, $D = \max |\mathcal{D}|$ be the maximum domain size, and $C = |\mathcal{C}|$ be the number of constraint checks.

| Metric | Complexity | Explanation |
|---|---|---|
| **Worst-Case Time** | **$O(D^V \cdot C)$** | Occurs if no solution exists and constraints cannot prune until full assignments are evaluated. |
| **Pruned Average-Case** | **$\ll O(D^V)$** | Early partial constraint checking cuts off massive exponential subtrees high up in the search. |
| **Space Complexity** | **$O(V)$** | Call stack recursion depth is strictly bounded by $V$, and `assignment` holds at most $V$ entries. |

---

### 8. How It Will Be Used by the Future Mystery Generator
In upcoming phases, the architecture cleanly decouples generation from graph traversal:

```text
[ Backtracking Engine ] ──► Computes consistent mystery truth (Culprit, Motive, Weapon, Alibis)
           │
           ▼
[ Mystery Generator ]   ──► Builds evidence chains, clues, locations & red herrings
           │
           ▼
[ Graph Construction ]  ──► Models the investigation network (Graph.js)
           │
           ▼
[ BFS / DFS Engine ]    ──► Validates solvability, deduction distance & ensures no stranded clues
```

---

## 🕵️ Procedural Mystery Generator (Phase 5)

The Procedural Mystery Generator generates complete, logical, and uniquely solvable detective cases without any reliance on AI, LLMs, or external APIs.

```text
Seed
 ↓
Seeded RNG (Mulberry32)
 ↓
Candidate Selection (Suspects, Locations, Weapons, Clues)
 ↓
Backtracking Constraints (Access, Compatibility, Affiliations)
 ↓
Valid Solution (Culprit, Motive, Weapon, Location)
 ↓
Mystery Graph Construction (Entities, Clue Chains, Red Herrings)
 ↓
BFS/DFS Validation (Solvability, Evidence Distance, Reachability)
 ↓
Valid Procedural Case
```

### 1. Seeded Randomness & Deterministic Reproducibility
- Employs a custom 32-bit PRNG (`SeededRandom.js`) based on the **Mulberry32** algorithm.
- `Seed 12345` will produce the exact same case today, tomorrow, and across any execution environment.
- Different seeds produce distinct, varied case combinations.

### 2. Structured Candidate Data Pools
Static pools in `backend/src/generators/data/` define the building blocks of the mystery:
- **`suspects.js`**: Traits, accessible rooms, potential motives, and weapon proficiencies.
- **`locations.js`**: Environmental settings and compatible weapons.
- **`weapons.js`**: Categories (chemical, physical, asphyxiation, blunt, ballistic) and lethality.
- **`motives.js`**: Narrative drives (inheritance, blackmail, revenge, scandal, debt, jealousy).
- **`clues.js`**: Archetypal physical, chronological, and forensic discoveries with reliability ratings.

### 3. Backtracking Constraint Solver Integration
The generator formulates the crime as a Constraint Satisfaction Problem:
- **Variables**: `['culprit', 'location', 'weapon', 'motive']`.
- **Domains**: Shuffled candidate subsets determined by the seed.
- **Constraints**:
  1. *Location Access*: Culprit must have access to the crime scene location.
  2. *Weapon Compatibility*: Weapon must be usable in the chosen environment.
  3. *Weapon Affiliation*: Culprit must have the skill or opportunity to use the weapon.
  4. *Motive Plausibility*: Culprit's persona must support the motive.
  5. *Uniqueness Guarantee*: No other suspect in the case may satisfy the same (location, weapon, motive) combination.

### 4. Unique-Solution Verification (Two-Pass Backtracking)
To prevent ambiguous mysteries where multiple suspects could fit the evidence:
1. Backtracking finds the primary solution: $S_1 = (\text{culprit}, \text{location}, \text{weapon}, \text{motive})$.
2. A second solver pass is immediately triggered with an exclusion constraint asserting $\text{culprit} \neq S_1.\text{culprit}$ under the exact crime facts.
3. If the second pass returns `solved: false`, the culprit is **mathematically proven to be unique**.

### 5. Graph Construction & Evidence Chains
The generator instantiates our custom `Graph` (`backend/src/algorithms/Graph.js`) to model the investigation network:
- **Nodes**: Suspects, locations, weapons, motives, and clues.
- **Primary Deduction Chain**:
  $$\text{Starting Clue} \xrightarrow{\text{found\_at}} \text{Crime Location} \xrightarrow{\text{connected\_to}} \text{Murder Weapon} \xrightarrow{\text{points\_to}} \text{Intermediate Clue} \xrightarrow{\text{belongs\_to}} \text{Culprit} \xrightarrow{\text{motivated\_by}} \text{Motive}$$

### 6. Red Herrings
- Realistic mysteries require misleading circumstantial evidence.
- Innocent suspects are connected to secondary clues or observed near the scene (`[knows]`, `[witnessed]`, `[points_to]`).
- Crucially, red herring paths terminate without connecting to the murder weapon or murder motive, ensuring they distract without breaking logical solvability.

### 7. Solvability Validation (`CaseValidator.js`)
Every generated case is subjected to algorithmic verification using our custom DSA engines:
- **BFS Shortest Path**: Confirms that a valid path exists from the starting clue to the culprit, with a minimum hop distance enforced by difficulty.
- **DFS Reachability**: Ensures that all critical case entities are reachable in the investigation component without stranded nodes.

### 8. Difficulty Scaling
The generator accepts an optional `difficulty` parameter (`easy`, `medium`, `hard`):

| Level | Suspects | Locations | Clues | Red Herrings | Min BFS Deduction Distance |
|---|---|---|---|---|---|
| **Easy** | 3 | 2 | 3 | 1 | 3 hops |
| **Medium** | 4 | 2 | 4 | 2 | 4 hops |
| **Hard** | 5 | 3 | 6 | 3 | 4–5 hops |

---

## 🌐 REST API Endpoints (Phase 6)

### Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root API overview |
| `GET` | `/api/health` | Health-check endpoint confirming backend operational status |
| `POST` | `/api/cases/generate` | Generates a procedural mystery case safe for frontend gameplay |

---

### Request Pipeline Architecture

```text
Client
  ↓
API Route (caseRoutes.js)
  ↓
Controller (caseController.js)
  ↓
Case Service (caseService.js)
  ↓
MysteryGenerator (MysteryGenerator.js)
  ↓
CaseValidator (CaseValidator.js)
  ↓
Public Case Serializer (caseSerializer.js)
  ↓
JSON Response
```

---

### Generate Case

**`POST /api/cases/generate`**

#### Request Payload
```json
{
  "difficulty": "medium",
  "seed": 12345
}
```

#### Request Parameters
- **`difficulty`** *(string, required)*: Case difficulty level. Case-insensitive. Allowed values: `"easy"`, `"medium"`, `"hard"`.
- **`seed`** *(number, optional)*: Deterministic 31-bit positive integer seed.
  - If supplied: Guarantees 100% deterministic output. Same seed + same difficulty always generates the exact same mystery case.
  - If omitted: A cryptographically secure random seed is generated at the API boundary using Node.js `crypto.randomInt`, then passed into `MysteryGenerator`.

#### Solution Secrecy Enforcement
- Ground truth (`solution.culprit`, `solution.motive`, `solution.weapon`, `solution.location`) is **strictly kept server-side**.
- The serialization layer (`caseSerializer.js`) enforces explicit property whitelisting so secret solution attributes are never returned in player-facing API responses.
- Internal graph node attributes (e.g. `isMurderWeapon`) are automatically stripped before serialization.

#### Graph JSON Serialization
- The internal ES6 `Map` adjacency list is transformed into a clean, JSON-safe structure containing `nodes` and `edges` arrays.
- Graph Edges include `source`, `target`, and `relationship` fields.

#### Example Success Response (HTTP 200)
```json
{
  "success": true,
  "data": {
    "caseId": "CASE-12345-MED",
    "seed": 12345,
    "difficulty": "medium",
    "suspects": [
      {
        "id": "suspect_beatrice_thorne",
        "name": "Beatrice Thorne",
        "role": "Housekeeper of 30 Years",
        "traits": ["loyal", "silent", "knows_all_secrets"]
      }
    ],
    "locations": [
      {
        "id": "location_drawing_room",
        "name": "Drawing Room",
        "description": "An ornate parlor featuring heavy velvet curtains and a crackling fireplace."
      }
    ],
    "weapons": [
      {
        "id": "weapon_arsenic",
        "name": "Arsenic Poison",
        "category": "chemical"
      }
    ],
    "motives": [
      {
        "id": "motive_inheritance",
        "name": "Disputed Will & Inheritance",
        "description": "Financial gain from a contested estate."
      }
    ],
    "clues": [
      {
        "id": "clue_burnt_telegram",
        "name": "Half-Burnt Telegram",
        "category": "documentary",
        "reliability": 0.95
      }
    ],
    "startingClueId": "clue_burnt_telegram",
    "graph": {
      "nodes": [
        {
          "id": "suspect_beatrice_thorne",
          "type": "suspect",
          "label": "Beatrice Thorne",
          "metadata": {
            "role": "Housekeeper of 30 Years",
            "traits": ["loyal", "silent", "knows_all_secrets"]
          }
        },
        {
          "id": "clue_burnt_telegram",
          "type": "clue",
          "label": "Half-Burnt Telegram",
          "metadata": {
            "category": "documentary",
            "reliability": 0.95
          }
        }
      ],
      "edges": [
        {
          "source": "clue_burnt_telegram",
          "target": "location_drawing_room",
          "relationship": "found_at",
          "metadata": {
            "note": "Discovered at the crime scene."
          }
        }
      ]
    },
    "metadata": {
      "clueCount": 4,
      "redHerringCount": 2,
      "suspectCount": 4,
      "isUniqueSolution": true,
      "generatorVersion": "1.0.0"
    }
  }
}
```

#### Example Error Response (HTTP 400)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Invalid difficulty \"impossible\". Allowed values: easy, medium, hard."
  }
}
```

---

## 🗺️ Project Roadmap

- **Phase 1 (Completed)**: Project foundation, full-stack folder structure, Express health endpoint, React integration.
- **Phase 2 (Completed)**: Custom manual Adjacency-List Graph Data Structure (`backend/src/algorithms/Graph.js`).
- **Phase 3 (Completed)**: Traversal Engine (BFS, Shortest Path, DFS, Connectivity, Cycle Detection).
- **Phase 4 (Completed)**: Backtracking Constraint Satisfaction Engine (`backend/src/algorithms/Backtracking.js`).
- **Phase 5 (Completed)**: Procedural Mystery Generator (`backend/src/generators/MysteryGenerator.js`).
- **Phase 6 (Completed)**: Backend Case Generation API (`POST /api/cases/generate`):
  - [x] Service layer (`caseService.js`) with input validation & random seed generation at API boundary
  - [x] Controller layer (`caseController.js`) mapping responses and clean HTTP status codes
  - [x] Express routes (`caseRoutes.js`) mounted on `/api/cases`
  - [x] Solution secrecy enforcement via explicit whitelist serialization (`caseSerializer.js`)
  - [x] Graph JSON serialization (`nodes` and `edges` arrays without internal ES6 `Map` leakage)
  - [x] Full integration test suite with 61/61 passing tests (`npm test`, `npm run test:api`)
  - [x] Verification demo script (`npm run verify:api`)
- **Phase 7 (Completed)**: Frontend Game UI & Investigation Gameplay
  - [x] Atmospheric Detective Noir UI theme with warm ivory typography, dark charcoal canvas, amber & burgundy accents
  - [x] Centralized API service layer (`services/caseApi.js`) handling timeouts, network errors, and input validation
  - [x] Engaging start screen with difficulty selection (`easy`, `medium`, `hard`), seed customization, and randomizer
  - [x] Responsive case header with case metadata, live progress meter, and quick-action navigation
  - [x] Forensic evidence archive (`CluePanel.jsx`) with `startingClueId` lead stamp, examination tracking, and personal notes
  - [x] Suspect dossier inspector (`SuspectPanel.jsx`) with traits, estate access, affiliated weapons, and Person of Interest (POI) tagging
  - [x] Manor room & implement survey (`LocationPanel.jsx`) with zero spoilers regarding true murder weapon or crime scene
  - [x] Interactive Evidence Board (`EvidenceBoard.jsx`) rendering the real procedural graph with canvas zoom/pan and accessible list view
  - [x] Detective notebook & metrics dashboard (`InvestigationJournal.jsx`) calculating honest progress from actual player actions
- **Phase 7 (Completed)**: Frontend Game UI & Investigation Gameplay
  - [x] Atmospheric Detective Noir UI theme with warm ivory typography, dark charcoal canvas, amber & burgundy accents
  - [x] Centralized API service layer (`services/caseApi.js`) handling timeouts, network errors, and input validation
  - [x] Engaging start screen with difficulty selection (`easy`, `medium`, `hard`), seed customization, and randomizer
  - [x] Responsive case header with case metadata, live progress meter, and quick-action navigation
  - [x] Forensic evidence archive (`CluePanel.jsx`) with `startingClueId` lead stamp, examination tracking, and personal notes
  - [x] Suspect dossier inspector (`SuspectPanel.jsx`) with traits, estate access, affiliated weapons, and Person of Interest (POI) tagging
  - [x] Manor room & implement survey (`LocationPanel.jsx`) with zero spoilers regarding true murder weapon or crime scene
  - [x] Interactive Evidence Board (`EvidenceBoard.jsx`) rendering the real procedural graph with canvas zoom/pan and accessible list view
  - [x] Detective notebook & metrics dashboard (`InvestigationJournal.jsx`) calculating honest progress from actual player actions
- **Phase 8 (Completed)**: Server-Side Verdict Validation, Active Case Lifecycle & Final DSA Audit
  - [x] In-memory active case lifecycle store (`ActiveCaseStore.js`) with 60-minute TTL, bounded capacity (1,000 cases), and automatic sweep
  - [x] Authoritative accusation evaluation endpoint (`POST /api/cases/accuse`) validating suspects against server-side ground truth
  - [x] Duplicate-submission prevention and idempotency guard (`CASE_ALREADY_CLOSED`, HTTP 409)
  - [x] Strict zero-solution leakage guarantee across correct, incorrect, and error responses
  - [x] Post-game solution reveal endpoint (`POST /api/cases/reveal`) strictly forbidden on active unsolved cases (HTTP 403)
  - [x] Comprehensive test coverage: 69 backend tests + 7 frontend tests passing without errors or regressions

---

## ⚖️ Phase 8 — Server-Side Verdict Validation & Lifecycle Architecture

### 1. Authoritative Accusation Endpoint Contract

#### Submit Accusation: `POST /api/cases/accuse`
- **Request Body**:
  ```json
  {
    "caseInstanceId": "7f83b1657ff1fc53b92dc18148a1d65b",
    "suspectId": "suspect_beatrice_thorne",
    "rationale": "Matching handwriting on forged bank draft"
  }
  ```
- **Success Response (Correct Accusation — HTTP 200)**:
  ```json
  {
    "success": true,
    "data": {
      "caseInstanceId": "7f83b1657ff1fc53b92dc18148a1d65b",
      "caseId": "CASE-12345-MED",
      "isCorrect": true,
      "status": "solved",
      "feedback": "Case Solved! Indictment confirmed by Scotland Yard. The suspect has confessed under the weight of forensic evidence.",
      "accusedSuspectId": "suspect_beatrice_thorne",
      "attempts": 1
    }
  }
  ```
- **Success Response (Incorrect Accusation — HTTP 200)**:
  ```json
  {
    "success": true,
    "data": {
      "caseInstanceId": "7f83b1657ff1fc53b92dc18148a1d65b",
      "caseId": "CASE-12345-MED",
      "isCorrect": false,
      "status": "closed",
      "feedback": "Indictment Rejected. Forensic evidence does not support the conviction of this suspect. The true culprit remains at large.",
      "accusedSuspectId": "suspect_lord_harrington",
      "attempts": 1
    }
  }
  ```
  *(Note: The true culprit and solution object are strictly excluded from incorrect verdict payloads).*

- **Error Responses**:
  - `HTTP 400 Bad Request`: Missing parameters or suspect does not belong to the case (`INVALID_INPUT`).
  - `HTTP 404 Not Found`: Unknown or expired case session (`CASE_NOT_FOUND`).
  - `HTTP 409 Conflict`: Duplicate submission on an already concluded case (`CASE_ALREADY_CLOSED`).

#### Post-Game Solution Reveal: `POST /api/cases/reveal`
- **Requirement**: Case status must be `'solved'` or `'closed'`. Submitting for an active unsolved case returns `HTTP 403 Forbidden`.
- **Response (HTTP 200)**:
  ```json
  {
    "success": true,
    "data": {
      "caseInstanceId": "7f83b1657ff1fc53b92dc18148a1d65b",
      "caseId": "CASE-12345-MED",
      "unsealedFindings": {
        "perpetrator": "suspect_beatrice_thorne",
        "crimeScene": "location_drawing_room",
        "weaponUsed": "weapon_silk_scarf",
        "motiveDeduction": "motive_inheritance"
      }
    }
  }
  ```

---

## 🔍 DSA & Correctness Audit Findings

1. **Adjacency-List Graph (`Graph.js`)**:
   - Zero library dependencies. Pure adjacency list mapping node IDs to metadata and incident edges.
   - Symmetrical edge addition and deletion verified for undirected investigative networks.
2. **BFS & DFS Engines (`BFS.js`, `DFS.js`)**:
   - Queue-based BFS computes accurate level distances and predecessor trees used by `CaseValidator` to ensure the starting clue has a solvable path to the culprit.
   - Recursive DFS tests graph connectivity and identifies cycles/clusters.
3. **Backtracking CSP Engine (`Backtracking.js`)**:
   - MRV heuristic (Minimum Remaining Values) dynamically prioritizes heavily constrained variables.
   - Forward consistency checks prune contradictory assignments before exploring subtrees.
4. **Uniqueness Verification (`MysteryGenerator.js`)**:
   - Executes a second backtracking pass over `selectedSuspects.filter(s => s.id !== culprit)`.
   - Formally verifies that under the crime facts (`location`, `weapon`, `motive`), no other suspect can satisfy the constraints, guaranteeing mathematical uniqueness.
5. **Mulberry32 PRNG & Seed Reproducibility**:
   - Deterministic 32-bit state updates guarantee that identical seeds yield identical mystery cases across all difficulty levels.
   - Verified across seeds `12345`, `67890`, `4242`, `77777`.

---

## 🧪 Testing Commands

### Backend Tests (69 Passing Tests)
```bash
cd backend
npm test
```

### Frontend Tests (7 Passing Tests & Secrecy Audit)
```bash
cd frontend
npm test
```

### Production Build
```bash
cd frontend
npm run build
```






