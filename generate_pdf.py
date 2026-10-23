import sys
import os
from fpdf import FPDF

def clean_text(text):
    return (
        text.replace("—", " - ")
            .replace("–", "-")
            .replace("“", "\"")
            .replace("”", "\"")
            .replace("‘", "'")
            .replace("’", "'")
            .replace("•", "*")
            .replace("→", "->")
            .replace("←", "<-")
            .replace("≤", "<=")
            .replace("≥", ">=")
            .encode("latin-1", "replace")
            .decode("latin-1")
    )

class PDFReport(FPDF):
    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "B", 8)
            self.set_text_color(100, 116, 139) # slate gray
            self.cell(0, 6, clean_text("Student Ranking System Using BST - C++ Backend Code & Documentation"), border=0, align="L")
            self.cell(0, 6, "Data Structures Project", border=0, align="R", new_x="LMARGIN", new_y="NEXT")
            self.set_draw_color(226, 232, 240)
            self.line(10, 14, 200, 14)
            self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(148, 163, 184)
        self.set_draw_color(226, 232, 240)
        self.line(10, self.get_y() - 2, 200, self.get_y() - 2)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")

def generate_pdf():
    pdf = PDFReport(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.set_margins(12, 16, 12)

    # -------------------------------------------------------------
    # PAGE 1: TITLE & EXECUTIVE SUMMARY
    # -------------------------------------------------------------
    pdf.add_page()
    
    # Title Banner Box
    pdf.set_fill_color(9, 25, 50) # Deep Navy
    pdf.rect(12, 16, 186, 38, style="F")
    
    pdf.set_xy(16, 20)
    pdf.set_font("Helvetica", "B", 18)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(178, 8, "Student Ranking System Using BST", align="L", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_x(16)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(56, 189, 248) # Sky blue
    pdf.cell(178, 6, "Complete C++ Backend Architecture & Source Code", align="L", new_x="LMARGIN", new_y="NEXT")

    pdf.set_x(16)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(203, 213, 225) # Slate 300
    pdf.cell(178, 5, "Data Structures College Project  |  C++14/C++17  |  Winsock REST API", align="L", new_x="LMARGIN", new_y="NEXT")

    pdf.set_y(58)
    pdf.set_text_color(15, 23, 42)

    # Section 1: Project Overview
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(30, 58, 138) # Royal blue
    pdf.cell(0, 7, "1. Project Overview & Architecture", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("Helvetica", "", 9.5)
    pdf.set_text_color(51, 65, 85)
    overview_text = (
        "This document contains the complete, production-ready C++ backend for the 'Student Ranking System Using BST' "
        "college Data Structures project. The backend is designed as an autonomous high-performance HTTP REST server "
        "that executes all Binary Search Tree algorithms in memory and connects to the modern React + Vite frontend."
    )
    pdf.multi_cell(0, 5, clean_text(overview_text))
    pdf.ln(3)

    # Key Characteristics
    features = [
        ("Binary Search Tree Core: ", "Organizes student records (roll number, name, marks) keyed by marks."),
        ("O(log N) Search & Insert: ", "Binary search logic ensures average-case logarithmic operations."),
        ("Three-Case Deletion: ", "Implements standard BST deletion for leaf, single-child, and two-children nodes with In-order Successor."),
        ("O(N) Leaderboard Generation: ", "Reverse In-Order Traversal (Right -> Root -> Left) generates ranked standings in descending order without external sorting."),
        ("Dynamic Tree Serialization: ", "Recursively serializes the pointer hierarchy into JSON for the frontend SVG tree visualizer."),
        ("Built-in Winsock HTTP Engine: ", "Standalone HTTP REST server running on port 8080 with full CORS support.")
    ]

    for title, desc in features:
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(37, 99, 235)
        pdf.cell(50, 5, "  * " + clean_text(title))
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(51, 65, 85)
        pdf.multi_cell(0, 5, clean_text(desc))
        pdf.ln(1)

    pdf.ln(3)

    # Section 2: Complexity Analysis Table
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(30, 58, 138)
    pdf.cell(0, 7, "2. BST Time & Space Complexity Matrix", new_x="LMARGIN", new_y="NEXT")
    
    # Table Header
    pdf.set_fill_color(241, 245, 249)
    pdf.set_draw_color(203, 213, 225)
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(48, 6, "Operation", border=1, fill=True)
    pdf.cell(42, 6, "Average Time", border=1, fill=True)
    pdf.cell(46, 6, "Worst Case (Skewed)", border=1, fill=True)
    pdf.cell(50, 6, "Space Complexity", border=1, fill=True, new_x="LMARGIN", new_y="NEXT")

    rows = [
        ("Search Student (by Roll/Marks)", "O(log N)", "O(N)", "O(1) auxiliary"),
        ("Insert Student Node", "O(log N)", "O(N)", "O(H) recursion stack"),
        ("Delete Student Node", "O(log N)", "O(N)", "O(H) recursion stack"),
        ("Leaderboard (Reverse In-Order)", "O(N)", "O(N)", "O(N) output buffer"),
        ("Tree JSON Serialization", "O(N)", "O(N)", "O(N) JSON payload"),
    ]

    pdf.set_font("Courier", "", 8.5)
    pdf.set_text_color(51, 65, 85)
    for op, avg, worst, space in rows:
        pdf.cell(48, 5.5, f" {op}", border=1)
        pdf.cell(42, 5.5, f" {avg}", border=1)
        pdf.cell(46, 5.5, f" {worst}", border=1)
        pdf.cell(50, 5.5, f" {space}", border=1, new_x="LMARGIN", new_y="NEXT")

    pdf.ln(4)

    # Section 3: REST API Endpoints Table
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(30, 58, 138)
    pdf.cell(0, 7, "3. C++ HTTP API Endpoint Specification", new_x="LMARGIN", new_y="NEXT")

    pdf.set_fill_color(241, 245, 249)
    pdf.set_font("Helvetica", "B", 8.5)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(20, 6, "Method", border=1, fill=True)
    pdf.cell(55, 6, "Endpoint Route", border=1, fill=True)
    pdf.cell(111, 6, "Description & BST Action", border=1, fill=True, new_x="LMARGIN", new_y="NEXT")

    api_endpoints = [
        ("GET", "/api/health", "Healthcheck and engine status confirmation"),
        ("GET", "/api/students", "Retrieves in-order student list from BST"),
        ("GET", "/api/leaderboard", "Reverse in-order traversal returning rankings sorted by marks"),
        ("GET", "/api/bst/tree", "Hierarchical recursive JSON tree structure for SVG visualizer"),
        ("GET", "/api/stats", "Computes total nodes, class average, topper, and tree height"),
        ("GET", "/api/students/search?q=...", "Searches BST by roll number or name substring"),
        ("POST", "/api/students", "Inserts a new student node into the BST ordered by marks"),
        ("DELETE", "/api/students/:rollNo", "Deletes student node and restructures BST pointers"),
    ]

    for meth, ep, desc in api_endpoints:
        pdf.set_font("Helvetica", "B", 8)
        if meth == "GET":
            pdf.set_text_color(37, 99, 235)
        elif meth == "POST":
            pdf.set_text_color(16, 185, 129)
        elif meth == "DELETE":
            pdf.set_text_color(239, 68, 68)
        pdf.cell(20, 5.2, f" {meth}", border=1)

        pdf.set_font("Courier", "", 8)
        pdf.set_text_color(30, 41, 59)
        pdf.cell(55, 5.2, f" {ep}", border=1)

        pdf.set_font("Helvetica", "", 8)
        pdf.set_text_color(71, 85, 105)
        pdf.cell(111, 5.2, f" {desc}", border=1, new_x="LMARGIN", new_y="NEXT")

    # -------------------------------------------------------------
    # PAGE 2+: FULL C++ SOURCE CODE
    # -------------------------------------------------------------
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 13)
    pdf.set_text_color(30, 58, 138)
    pdf.cell(0, 7, "4. Complete C++ Backend Source Code (backend/server.cpp)", new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_font("Helvetica", "I", 8.5)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(0, 5, "Compiled with: g++ -O2 -std=c++14 backend/server.cpp -lws2_32 -o backend/server.exe", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    # Read backend/server.cpp
    source_path = os.path.join(os.path.dirname(__file__), "backend", "server.cpp")
    with open(source_path, "r", encoding="utf-8") as f:
        code_lines = f.readlines()

    pdf.set_font("Courier", "", 7.2)
    line_height = 3.6

    for idx, line in enumerate(code_lines, 1):
        line_clean = clean_text(line.rstrip("\r\n"))
        # Line number
        pdf.set_text_color(148, 163, 184) # light line number
        pdf.cell(10, line_height, f"{idx:3d} ", border=0, align="R")
        
        # Syntax coloring based on content
        trimmed = line_clean.strip()
        if trimmed.startswith("//") or trimmed.startswith("/*") or trimmed.startswith("*"):
            pdf.set_text_color(100, 116, 139) # gray comment
        elif trimmed.startswith("#include") or trimmed.startswith("#define") or trimmed.startswith("#pragma"):
            pdf.set_text_color(147, 51, 234) # purple preprocessor
        elif any(trimmed.startswith(kw) for kw in ["struct ", "class ", "public:", "private:", "return", "if", "else", "while", "for", "const", "bool ", "void ", "int ", "double "]):
            pdf.set_text_color(37, 99, 235) # blue keyword
        elif '"' in line_clean:
            pdf.set_text_color(13, 148, 136) # teal strings
        else:
            pdf.set_text_color(15, 23, 42) # dark code text

        pdf.cell(0, line_height, line_clean, border=0, new_x="LMARGIN", new_y="NEXT")

    output_pdf_path = os.path.join(os.path.dirname(__file__), "Student_Ranking_System_BST_Backend_Code.pdf")
    pdf.output(output_pdf_path)
    print(f"SUCCESS: PDF generated at: {output_pdf_path}")

if __name__ == "__main__":
    generate_pdf()
