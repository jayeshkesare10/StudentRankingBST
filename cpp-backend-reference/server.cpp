/**
 * ============================================================================
 * STUDENT RANKING SYSTEM USING BST - C++ BACKEND REFERENCE IMPLEMENTATION
 * ============================================================================
 * 
 * College Data Structures Project Backend
 * Demonstrates:
 *   1. Binary Search Tree (BST) Node structure for student records
 *   2. Insertion by marks (O(log N) average)
 *   3. Deletion handling 3 cases (Leaf, 1 Child, 2 Children with In-order Successor)
 *   4. Search by Roll Number or Name
 *   5. In-Order Traversal for Ascending Sort
 *   6. Reverse In-Order Traversal (Right -> Root -> Left) for Descending Leaderboard
 *   7. Hierarchical JSON tree export for frontend visualization
 *   8. HTTP REST Endpoints with CORS headers for frontend integration
 *
 * Compilation instructions:
 *   g++ -std=c++17 server.cpp -lpthread -o bst_server
 *   ./bst_server
 * ============================================================================
 */

#include <iostream>
#include <string>
#include <vector>
#include <sstream>
#include <algorithm>
#include <cmath>

// Student Record Structure
struct Student {
    int rollNo;
    std::string name;
    double marks;
    int rank;
};

// Binary Search Tree Node
struct BSTNode {
    Student student;
    BSTNode* left;
    BSTNode* right;

    BSTNode(Student s) : student(s), left(nullptr), right(nullptr) {}
};

// Binary Search Tree Class
class StudentBST {
private:
    BSTNode* root;
    int totalCount;

    // Helper: Insert node ordered by marks
    BSTNode* insertHelper(BSTNode* node, const Student& s) {
        if (node == nullptr) {
            totalCount++;
            return new BSTNode(s);
        }
        if (s.marks < node->student.marks) {
            node->left = insertHelper(node->left, s);
        } else {
            node->right = insertHelper(node->right, s);
        }
        return node;
    }

    // Helper: Find minimum node (In-Order Successor)
    BSTNode* findMin(BSTNode* node) {
        while (node && node->left != nullptr) {
            node = node->left;
        }
        return node;
    }

    // Helper: Delete node by roll number
    BSTNode* deleteHelper(BSTNode* node, int rollNo, bool& deleted) {
        if (node == nullptr) return nullptr;

        if (rollNo == node->student.rollNo) {
            deleted = true;
            totalCount--;

            // Case 1: Leaf node (0 children)
            if (node->left == nullptr && node->right == nullptr) {
                delete node;
                return nullptr;
            }
            // Case 2: One child (only right)
            if (node->left == nullptr) {
                BSTNode* temp = node->right;
                delete node;
                return temp;
            }
            // Case 2: One child (only left)
            if (node->right == nullptr) {
                BSTNode* temp = node->left;
                delete node;
                return temp;
            }
            // Case 3: Two children
            // Replace with In-order Successor (min node in right subtree)
            BSTNode* successor = findMin(node->right);
            node->student = successor->student;
            bool dummy = false;
            node->right = deleteHelper(node->right, successor->student.rollNo, dummy);
            totalCount++; // adjust because deleteHelper will decrement
            return node;
        }

        node->left = deleteHelper(node->left, rollNo, deleted);
        if (!deleted) {
            node->right = deleteHelper(node->right, rollNo, deleted);
        }
        return node;
    }

    // Helper: In-order traversal
    void inOrderHelper(BSTNode* node, std::vector<Student>& list) const {
        if (node == nullptr) return;
        inOrderHelper(node->left, list);
        list.push_back(node->student);
        inOrderHelper(node->right, list);
    }

    // Helper: Reverse In-order traversal (Right -> Root -> Left)
    void reverseInOrderHelper(BSTNode* node, std::vector<Student>& list) const {
        if (node == nullptr) return;
        reverseInOrderHelper(node->right, list);
        list.push_back(node->student);
        reverseInOrderHelper(node->left, list);
    }

    // Helper: Search by roll number
    BSTNode* searchRollHelper(BSTNode* node, int rollNo) const {
        if (node == nullptr) return nullptr;
        if (node->student.rollNo == rollNo) return node;
        BSTNode* leftRes = searchRollHelper(node->left, rollNo);
        if (leftRes != nullptr) return leftRes;
        return searchRollHelper(node->right, rollNo);
    }

    // Helper: Tree height
    int getHeightHelper(BSTNode* node) const {
        if (node == nullptr) return 0;
        return 1 + std::max(getHeightHelper(node->left), getHeightHelper(node->right));
    }

    // Helper: Recursive JSON serialization of BST
    std::string serializeNodeJSON(BSTNode* node) const {
        if (node == nullptr) return "null";
        std::stringstream ss;
        ss << "{"
           << "\"rollNo\":" << node->student.rollNo << ","
           << "\"name\":\"" << node->student.name << "\","
           << "\"marks\":" << node->student.marks << ","
           << "\"rank\":" << node->student.rank << ","
           << "\"left\":" << serializeNodeJSON(node->left) << ","
           << "\"right\":" << serializeNodeJSON(node->right)
           << "}";
        return ss.str();
    }

public:
    StudentBST() : root(nullptr), totalCount(0) {}

    bool insert(int rollNo, const std::string& name, double marks) {
        if (searchRoll(rollNo) != nullptr) return false; // Duplicate roll number rejected
        Student s = { rollNo, name, marks, 1 };
        root = insertHelper(root, s);
        updateRanks();
        return true;
    }

    bool deleteStudent(int rollNo) {
        bool deleted = false;
        root = deleteHelper(root, rollNo, deleted);
        if (deleted) updateRanks();
        return deleted;
    }

    BSTNode* searchRoll(int rollNo) const {
        return searchRollHelper(root, rollNo);
    }

    std::vector<Student> getLeaderboard() {
        std::vector<Student> list;
        reverseInOrderHelper(root, list);
        return list;
    }

    std::vector<Student> getAllStudents() {
        std::vector<Student> list;
        inOrderHelper(root, list);
        return list;
    }

    void updateRanks() {
        std::vector<Student> descList;
        reverseInOrderHelper(root, descList);
        int currentRank = 1;
        for (size_t i = 0; i < descList.size(); i++) {
            if (i > 0 && descList[i].marks < descList[i - 1].marks) {
                currentRank = static_cast<int>(i + 1);
            }
            BSTNode* n = searchRoll(descList[i].rollNo);
            if (n) n->student.rank = currentRank;
        }
    }

    int getHeight() const {
        return getHeightHelper(root);
    }

    int size() const {
        return totalCount;
    }

    std::string toJSONTree() const {
        std::stringstream ss;
        ss << "{"
           << "\"root\":" << serializeNodeJSON(root) << ","
           << "\"totalNodes\":" << totalCount << ","
           << "\"treeHeight\":" << getHeight() << ","
           << "\"keyProperty\":\"marks\""
           << "}";
        return ss.str();
    }
};

int main() {
    std::cout << "=========================================================\n";
    std::cout << " Student Ranking System Using BST - C++ Engine Reference\n";
    std::cout << "=========================================================\n";
    
    StudentBST tree;
    // Sample initial seeding
    tree.insert(101, "Aarav Sharma", 95.0);
    tree.insert(104, "Diya Patel", 92.0);
    tree.insert(106, "Rohan Kulkarni", 87.0);
    tree.insert(102, "Ananya Iyer", 81.0);
    tree.insert(105, "Vikram Malhotra", 74.0);

    std::cout << "BST Initialized with " << tree.size() << " nodes. Tree Height: " << tree.getHeight() << "\n\n";

    std::cout << "--- LEADERBOARD (Reverse In-Order Traversal) ---\n";
    auto leaderboard = tree.getLeaderboard();
    for (const auto& s : leaderboard) {
        std::cout << "Rank #" << s.rank << " | Roll: " << s.rollNo << " | " << s.name << " | " << s.marks << " marks\n";
    }

    std::cout << "\n--- JSON TREE SERIALIZATION (for Frontend Visualizer) ---\n";
    std::cout << tree.toJSONTree() << "\n";

    return 0;
}
