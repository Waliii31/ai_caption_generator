# app/routes.py
from fastapi import APIRouter, UploadFile, File
from app.caption_generator import generate_caption_from_image

router = APIRouter()

@router.post("/generate-caption")
async def generate_caption(file: UploadFile = File(...)):
    image_bytes = await file.read()
    caption = generate_caption_from_image(image_bytes)
    return {"caption": caption}
