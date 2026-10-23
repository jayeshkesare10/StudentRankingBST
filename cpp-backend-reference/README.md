# C++ Backend Guide for Student Ranking System Using BST

This folder provides a complete reference implementation and integration guide for your C++ Binary Search Tree backend.

## 1. Core BST Algorithm Responsibilities
The C++ backend is responsible for all Data Structures operations:
- **`insert(rollNo, name, marks)`**: Inserts a new node into the BST ordered by `marks` (or roll number). Average time complexity: `O(log N)`.
- **`delete(rollNo)`**: Handles all 3 deletion cases:
  1. *Leaf Node*: Delete directly and nullify parent pointer.
  2. *Single Child*: Parent points directly to child.
  3. *Two Children*: Replace node with **In-order Successor** (minimum node in right subtree).
- **`search(query)`**: Binary search traversal in `O(log N)`.
- **`leaderboard`**: Reverse In-Order Traversal (`Right -> Root -> Left`) produces descending ranks in `O(N)` without extra sorting.
- **`toJSONTree()`**: Recursively serializes the current BST structure (`root`, `left`, `right`) so the React frontend can draw SVG nodes and connecting edges.

---

## 2. Setting Up an HTTP API in C++
To connect this frontend to your C++ code, you can use any C++ HTTP library. The most popular and easiest for college projects is **`cpp-httplib`** (a single header file `httplib.h`):

### Download `httplib.h`
```bash
# In your C++ project folder:
curl -o httplib.h https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h
```

### Minimal C++ HTTP Server with CORS
```cpp
#define CPPHTTPLIB_OPENSSL_SUPPORT // optional
#include "httplib.h"
#include <iostream>

int main() {
    httplib::Server svr;

    // Enable CORS for frontend requests
    svr.set_default_headers({
        {"Access-Control-Allow-Origin", "*"},
        {"Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS"},
        {"Access-Control-Allow-Headers", "Content-Type"}
    });

    // 1. Healthcheck
    svr.Get("/api/health", [](const httplib::Request&, httplib::Response& res) {
        res.set_content("{\"status\":\"online\"}", "application/json");
    });

    // 2. Get all students
    svr.Get("/api/students", [](const httplib::Request&, httplib::Response& res) {
        // Return your BST in-order students
        res.set_content("{\"students\":[]}", "application/json");
    });

    // 3. Get leaderboard
    svr.Get("/api/leaderboard", [](const httplib::Request&, httplib::Response& res) {
        // Return your reverse in-order leaderboard
        res.set_content("{\"leaderboard\":[]}", "application/json");
    });

    // 4. Get BST Tree structure
    svr.Get("/api/bst/tree", [](const httplib::Request&, httplib::Response& res) {
        // Return tree JSON matching the visualizer format:
        // {"root": {"rollNo":101, "name":"...", "marks":95, "left":null, "right":null}, "totalNodes":1, "treeHeight":1}
        res.set_content("{\"root\":null,\"totalNodes\":0,\"treeHeight\":0}", "application/json");
    });

    std::cout << "C++ BST Server listening at http://localhost:8080\n";
    svr.listen("0.0.0.0", 8080);
    return 0;
}
```

### Compile & Run
```bash
g++ -std=c++17 server.cpp -lpthread -o bst_server
./bst_server
```

---

## 3. Alternative: Deploying C++ Backend for Free
If you want to host your C++ backend online alongside your Vercel frontend:
1. Wrap your C++ server in a minimal Dockerfile.
2. Deploy to **Render.com**, **Railway.app**, or **Fly.io** (free tiers available).
3. Copy the resulting HTTPS URL (e.g. `https://my-cpp-bst.onrender.com`).
4. Paste it into the frontend's **API Config** modal or set `VITE_API_BASE_URL` on Vercel!
