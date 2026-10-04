import os
import streamlit as st
import requests
from bs4 import BeautifulSoup
from groq import Groq

# Set up Streamlit Web Page UI
st.set_page_config(page_title="AI Web Scraper", page_icon="🌐", layout="centered")
st.title("🌐 AI-Powered Web Scraper")
st.write("Extract structured JSON data from any website using Groq AI.")

# Initialize Groq client
if "GROQ_API_KEY" in os.environ:
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
else:
    st.warning("Please set your GROQ_API_KEY environment variable to run the scraper.")
    client = None

# UI Inputs
target_url = st.text_input("Enter Website URL:", placeholder="https://example.com")
extraction_prompt = st.text_area("What do you want to extract?", value="Extract all item names and their prices.")

if st.button("Start Scraping", type="primary") and client:
    if not target_url:
        st.error("Please provide a valid URL.")
    else:
        with st.spinner("Scraping website and parsing HTML structure..."):
            try:
                headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
                response = requests.get(target_url, headers=headers, timeout=10)
                
                if response.status_code != 200:
                    st.error(f"Failed to fetch page. Status code: {response.status_code}")
                else:
                    # Clean the HTML to save Groq tokens
                    soup = BeautifulSoup(response.text, 'html.parser')
                    for element in soup(["script", "style", "svg", "path", "footer", "nav", "header"]):
                        element.extract()
                    
                    cleaned_html = soup.prettify()[:6000]

                    # Send to Groq
                    st.spinner("Groq AI is extracting data...")
                    completion = client.chat.completions.create(
                        model="qwen/qwen3.8-27b",
                        messages=[
                            {
                                "role": "system",
                                "content": "You are a precise data extraction bot. Analyze the HTML. Return ONLY a valid JSON array of objects based on the user request. Do not include markdown blocks or chatter."
                            },
                            {
                                "role": "user",
                                "content": f"Request: {extraction_prompt}\n\nHTML Data:\n\n{cleaned_html}"
                            }
                        ],
                        temperature=0.1,
                    )

                    # Display the results on the web interface
                    st.success("Extraction Complete!")
                    st.json(completion.choices[0].message.content)
                    
            except Exception as e:
                st.error(f"An error occurred: {str(e)}")