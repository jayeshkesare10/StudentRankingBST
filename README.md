# Student Ranking System Using BST — Frontend

A college Data Structures project frontend for a **Student Ranking System Using a Binary Search Tree (BST)**. This web application provides a responsive dashboard, live interactive BST visualizer, student records directory, and class merit leaderboard designed to interface seamlessly with a separate **C++ HTTP backend**.

---

## 🌟 Key Highlights & Design

- **Theme & Aesthetics**: Professional Royal Blue, Cyan, White, and Deep Navy palette (`#050B16` to `#091322`) with glassmorphism, glowing accents, and crisp typography (`Plus Jakarta Sans` & `JetBrains Mono`).
- **Separation of Concerns**: **Zero BST algorithms in JavaScript**. The C++ backend executes all tree insertions, deletions, in-order traversals, and search operations. The frontend strictly visualizes the tree structure supplied by the backend.
- **Fail-Safe Backend Integration**:
  - When the C++ backend is offline, the interface explicitly alerts: **"C++ Backend Server Not Reachable"**. It **never silently uses mock data**.
  - Includes an optional, clearly labeled **Demo / Preview Mode** toggle for evaluating the UI without spinning up the C++ server.
- **Interactive BST Visualizer**:
  - Draws dynamic SVG nodes and directional connector branches (`L (< Key)` and `R (> Key)`).
  - Search node highlighting with animated pulse rings.
  - Interactive node clicking with an inspector drawer and quick delete action.
  - Zoom In, Zoom Out, and Reset View controls.
- **Honor Roll Podium & Leaderboard**:
  - Top 3 Podium (1st Gold, 2nd Silver, 3rd Bronze) with crowns and pedestals.
  - Explains how **Reverse In-Order Traversal** (`Right -> Root -> Left`) produces a descending ranking in linear `O(N)` time.
- **Student Records Directory**:
  - Filter by grade tier (Distinction $\ge$ 75%, First Class 60–74%, Pass 40–59%, At Risk < 40%).
  - Live search by Roll Number or Name.
  - Column sorting and pagination.
- **Delete Confirmation Dialog**:
  - Explains the 3 BST deletion cases (Leaf node, 1 child, and 2 children with in-order successor replacement).
- **Educational Guide**:
  - Comprehensive modal detailing BST properties, average vs. worst-case time complexities ($O(\log N)$ vs $O(N)$), and space complexity.
- **Configurable API Settings**:
  - Change or test your `API_BASE_URL` directly within the UI without rebuilding code.

---

## 🛠️ Technology Stack

- **Core**: React 19, Vite 6
- **Styling**: Vanilla CSS with Design System Tokens (Dark Navy Glassmorphism)
- **Icons**: Custom zero-dependency SVG Icons (`src/components/Icons.jsx`)
- **Deployment Target**: Vercel (Configured with `vercel.json` SPA rewrites)

---

## 📁 Project Architecture

```
DS project/
├── cpp-backend-reference/       # C++ BST reference code and HTTP server guide
│   ├── server.cpp               # Runnable C++ BST engine with JSON output
│   └── README.md                # C++ httplib setup and CORS instructions
├── public/
│   └── favicon.svg              # Custom binary tree favicon
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Header with status pill & mode toggles
│   │   ├── StatCards.jsx        # 4 high-level metrics cards
│   │   ├── BSTVisualizer.jsx    # Interactive SVG tree visualizer
│   │   ├── StudentTable.jsx     # Searchable & sortable student directory
│   │   ├── Leaderboard.jsx      # Top 3 podium & honor roll standings
│   │   ├── SearchBar.jsx        # Quick search with locate-in-tree action
│   │   ├── AddStudentModal.jsx  # Validated student insertion form
│   │   ├── DeleteModal.jsx      # 3-case deletion confirmation dialog
│   │   ├── ApiSettingsModal.jsx # Live backend URL switcher & ping tester
│   │   ├── BSTTheoryModal.jsx   # BST properties & time complexity guide
│   │   ├── Toast.jsx            # Notification toast system
│   │   └── Icons.jsx            # Handcrafted SVG icons
│   ├── data/
│   │   └── mockData.js          # In-memory simulator for Preview Mode ONLY
│   ├── services/
│   │   └── api.js               # Centralized HTTP API client for C++ backend
│   ├── App.jsx                  # Main coordinator and view tabs
│   ├── App.css                  # Component layout and responsive styling
│   ├── index.css                # Global design system & theme tokens
│   └── main.jsx                 # React root mount
├── .env.example                 # Environment variables template
├── package.json                 # Project dependencies & build scripts
├── vercel.json                  # Vercel deployment configuration
├── vite.config.js               # Vite build settings
└── README.md                    # Project documentation
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (comes with Node.js)

### 2. Installation
Open your terminal in this project folder and run:
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Tip for testing without a backend**: When you open the application, if your C++ server isn't running yet, click **"Turn On Demo Mode"** or toggle **"Demo Mode"** in the top navigation bar. This enables an in-memory preview mode where you can test adding, deleting, and visualizing BST nodes immediately!

---

## 🌐 How to Deploy to Vercel (Public Website Link)

This project is pre-configured for one-click deployment on [Vercel](https://vercel.com).

### Method A: Deploy via GitHub (Recommended & Easiest)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Student Ranking System Using BST"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in (or sign up with GitHub).
   - Click **"Add New..."** &rarr; **"Project"**.
   - Select your GitHub repository.

3. **Configure Build Settings**:
   - Vercel will automatically detect **Vite**:
     - **Framework Preset**: `Vite`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

4. **Set Environment Variable (Optional for Production)**:
   - Under **Environment Variables**, add:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: Your public C++ backend URL (e.g. `https://my-cpp-bst.onrender.com`).
     *(If your C++ backend is not deployed online yet, leave this blank. Evaluators can still use the built-in Demo Mode or enter an ngrok/cloud URL directly in the in-app **API Config** modal!)*

5. **Deploy**:
   - Click **"Deploy"**.
   - Within ~30 seconds, Vercel will generate your live public HTTPS link (e.g., `https://student-ranking-bst.vercel.app`)!

---

### Method B: Deploy via Vercel CLI (From Terminal)

1. Install the Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Login to your Vercel account:
   ```bash
   vercel login
   ```

3. Deploy the project:
   ```bash
   vercel
   ```
   Follow the simple prompts (select default settings).

4. Deploy to production:
   ```bash
   vercel --prod
   ```
   The terminal will print your permanent public HTTPS URL!

---

## 🔗 C++ Backend REST API Contract

The frontend connects to the C++ backend using the following JSON endpoints:

| Method | Endpoint | Description | Expected Payload / Response |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck | `{"status": "online"}` |
| `GET` | `/api/students` | List all students (in-order) | `{"students": [{"rollNo": 101, "name": "...", "marks": 95, "rank": 1}]}` |
| `POST` | `/api/students` | Insert student into BST | Body: `{"rollNo": 108, "name": "...", "marks": 89}`<br>Response: `{"success": true, "student": {...}}` |
| `GET` | `/api/students/search?q=...` | Search BST by Roll or Name | `{"results": [...]}` |
| `DELETE` | `/api/students/:rollNo` | Delete node from BST | Response: `{"success": true, "rollNo": 101}` |
| `GET` | `/api/leaderboard` | Descending ranking list | `{"leaderboard": [...]}` |
| `GET` | `/api/bst/tree` | Hierarchical BST JSON | `{"root": {"rollNo": 101, "marks": 95, "left": null, "right": null}, "totalNodes": 1, "treeHeight": 1}` |

> See the `cpp-backend-reference/` directory for full C++ server code using `cpp-httplib`!

---

## 🧪 Validating the Production Build Locally

To test the exact production build before deploying:
```bash
npm run build
npm run preview
```
This runs Vite's local preview server on `http://localhost:4173` using the compiled `dist/` bundle.
