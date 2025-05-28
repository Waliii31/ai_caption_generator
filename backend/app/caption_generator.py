from PIL import Image
import io
from transformers import BlipProcessor, BlipForConditionalGeneration
import httpx
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Load BLIP model
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# OpenRouter API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

def generate_caption_from_image(image_bytes: bytes) -> str:
    # Step 1: Generate raw caption using BLIP
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    output = model.generate(**inputs)
    raw_caption = processor.decode(output[0], skip_special_tokens=True)

    # Step 2: Generate catchy caption using OpenRouter (GPT-3.5 or other)
    prompt = f"""Convert this boring image description into a catchy and engaging Instagram-style caption:
Description: "{raw_caption}"
Catchy Caption:"""

    try:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "https://yourapp.com",  # optional, you can leave as is
            "Content-Type": "application/json"
        }

        payload = {
            "model": "openai/gpt-3.5-turbo",  # or try "mistralai/mistral-7b-instruct"
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.9,
            "max_tokens": 60
        }

        response = httpx.post(OPENROUTER_API_URL, headers=headers, json=payload)
        response.raise_for_status()

        data = response.json()
        catchy_caption = data["choices"][0]["message"]["content"].strip()
        return catchy_caption

    except Exception as e:
        print("⚠️ OpenRouter failed. Returning raw caption:", e)
        return raw_caption
