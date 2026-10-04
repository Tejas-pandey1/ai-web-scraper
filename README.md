# 🌐 AI-Powered Web Scraper (Groq API)

A lightweight, ultra-fast Python web application that scraps semantic HTML from websites and leverages Groq's `qwen/qwen3.8-27b` model to extract clean, structured JSON data based on natural language prompts.

## ✨ Features
- **Token Optimization:** Automatically strips unnecessary components (scripts, styles, SVGs) to dramatically cut down LLM prompt context overhead.
- **Native JSON Extraction:** Leverages production-tier Qwen architecture on Groq to output reliable, structured JSON structures.
- **Streamlit Web UI:** A beautiful, localized frontend to immediately query pages and download structured outputs.

## 🚀 Setup
1. Install dependencies: `pip install -r requirements.txt`
2. Set your key: `export GROQ_API_KEY="your-key-here"`
3. Launch app: `streamlit run app.py`
