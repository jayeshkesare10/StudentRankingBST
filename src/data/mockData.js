/**
 * MOCK DATA & SIMULATOR FOR PREVIEW MODE ONLY
 * Used strictly when the C++ backend is not connected and the user explicitly
 * enables "Preview Mode" to inspect the frontend interface and visualizer.
 */

export const INITIAL_PREVIEW_STUDENTS = [
  { rollNo: 101, name: "Aarav Sharma", marks: 95, rank: 1 },
  { rollNo: 104, name: "Diya Patel", marks: 92, rank: 2 },
  { rollNo: 106, name: "Rohan Kulkarni", marks: 87, rank: 3 },
  { rollNo: 102, name: "Ananya Iyer", marks: 81, rank: 4 },
  { rollNo: 105, name: "Vikram Malhotra", marks: 74, rank: 5 },
  { rollNo: 103, name: "Sneha Reddy", marks: 68, rank: 6 },
  { rollNo: 107, name: "Kabir Mehta", marks: 59, rank: 7 },
];

/**
 * Builds a balanced or standard BST representation from student records
 * keyed by marks (or roll number) for visual tree demonstration.
 */
export function buildPreviewBSTTree(studentsList) {
  if (!studentsList || studentsList.length === 0) {
    return { root: null, totalNodes: 0, treeHeight: 0 };
  }

  // Node structure matching C++ backend format
  class TreeNode {
    constructor(student) {
      this.rollNo = student.rollNo;
      this.name = student.name;
      this.marks = student.marks;
      this.rank = student.rank;
      this.left = null;
      this.right = null;
    }
  }

  function insert(node, student) {
    if (!node) return new TreeNode(student);
    // Standard BST ordered by marks (or rollNo)
    if (student.marks < node.marks) {
      node.left = insert(node.left, student);
    } else {
      node.right = insert(node.right, student);
    }
    return node;
  }

  // Insert items into BST
  let root = null;
  // Pick a good root if available (median marks)
  const sortedByMarks = [...studentsList].sort((a, b) => a.marks - b.marks);
  
  // Balanced insertion sequence for preview clarity
  function buildBalanced(arr, start, end) {
    if (start > end) return null;
    const mid = Math.floor((start + end) / 2);
    const node = new TreeNode(arr[mid]);
    node.left = buildBalanced(arr, start, mid - 1);
    node.right = buildBalanced(arr, mid + 1, end);
    return node;
  }

  root = buildBalanced(sortedByMarks, 0, sortedByMarks.length - 1);

  function getHeight(node) {
    if (!node) return 0;
    return 1 + Math.max(getHeight(node.left), getHeight(node.right));
  }

  return {
    root,
    totalNodes: studentsList.length,
    treeHeight: getHeight(root),
    keyProperty: "marks"
  };
}

/**
 * In-memory simulated storage for Preview Mode
 */
class PreviewStorage {
  constructor() {
    this.students = [...INITIAL_PREVIEW_STUDENTS];
    this.recalculateRanks();
  }

  recalculateRanks() {
    // Sort by marks descending to assign ranks
    const sorted = [...this.students].sort((a, b) => b.marks - a.marks);
    let currentRank = 1;
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i].marks < sorted[i - 1].marks) {
        currentRank = i + 1;
      }
      sorted[i].rank = currentRank;
    }
    this.students = sorted;
  }

  getStudents() {
    return [...this.students];
  }

  getLeaderboard() {
    return [...this.students].sort((a, b) => b.marks - a.marks);
  }

  search(query) {
    if (!query) return [];
    const q = query.toString().trim().toLowerCase();
    return this.students.filter(
      s => s.rollNo.toString() === q || s.name.toLowerCase().includes(q)
    );
  }

  addStudent({ rollNo, name, marks }) {
    const rNo = parseInt(rollNo, 10);
    const m = parseFloat(marks);

    if (this.students.some(s => s.rollNo === rNo)) {
      throw new Error(`Student with Roll Number ${rNo} already exists in BST.`);
    }

    const newStudent = {
      rollNo: rNo,
      name: name.trim(),
      marks: m,
      rank: 1 // will be recalculated
    };

    this.students.push(newStudent);
    this.recalculateRanks();
    return newStudent;
  }

  deleteStudent(rollNo) {
    const rNo = parseInt(rollNo, 10);
    const initialLen = this.students.length;
    this.students = this.students.filter(s => s.rollNo !== rNo);
    if (this.students.length === initialLen) {
      throw new Error(`Student with Roll No ${rNo} not found in BST.`);
    }
    this.recalculateRanks();
    return { success: true, rollNo: rNo };
  }

  getBSTTree() {
    return buildPreviewBSTTree(this.students);
  }

  getStats() {
    const total = this.students.length;
    if (total === 0) {
      return { totalStudents: 0, averageMarks: 0, topper: null, treeHeight: 0 };
    }
    const sum = this.students.reduce((acc, s) => acc + s.marks, 0);
    const avg = parseFloat((sum / total).toFixed(2));
    const topper = [...this.students].sort((a, b) => b.marks - a.marks)[0];
    const tree = this.getBSTTree();

    return {
      totalStudents: total,
      averageMarks: avg,
      topper,
      treeHeight: tree.treeHeight
    };
  }

  reset() {
    this.students = [...INITIAL_PREVIEW_STUDENTS];
    this.recalculateRanks();
  }
}

export const previewStorage = new PreviewStorage();
