# 📊 Student Grades Analytics

A simple and powerful academic performance tracker designed to help teachers monitor student grades and generate helpful AI-powered insights.

---

## 🧠 Overview

*Student Grades Analytics* is a lightweight web app that allows educators to input student grades and receive automatic insights powered by AI. These insights can help identify:

✅ Class average performance
⚠️ Students at risk of failing
📚 Subjects needing review


It’s a practical tool for improving classroom transparency and promoting academic success with minimal setup.

---

## 🗃️ Database Schema

Our system uses a simple and intuitive structure:

### students
| Field | Type     | Description          |
|-------|----------|----------------------|
| id    | integer  | Primary key          |
| name  | text     | Student full name    |
| section | text   | Student's section    |

### subjects
| Field        | Type    | Description        |
|--------------|---------|--------------------|
| id           | integer | Primary key        |
| subject_name | text    | Name of the subject|

### grades
| Field       | Type    | Description                          |
|-------------|---------|--------------------------------------|
| id          | integer | Primary key                          |
| student_id  | foreign key → students(id) | Student reference |
| subject_id  | foreign key → subjects(id) | Subject reference |
| grade       | number  | Grade achieved in the subject        |

---

## 🤖 Why It Works

This project is great for educational environments because:

- The database design is *clean and minimal*, making data entry and maintenance simple.
- AI summaries are *clear and actionable*, e.g.:

  > “📉 Math has the lowest class average.”
  
  > “🚨 3 students are at risk of failing in English.”

---

## 🛠️ Tech Stack

- *Frontend*: Svelte + Tailwind (or your framework of choice)
- *Backend*: Node.js / Bun + SQLite or PostgreSQL
- *AI Integration*: [Ollama](https://ollama.com/) (or LLM of choice for generating insights)

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/student-grades-analytics.git
cd student-grades-analytics

# Install dependencies
npm install

# Run the development server
npm run dev
