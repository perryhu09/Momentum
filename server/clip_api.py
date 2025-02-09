import os
from dotenv import load_dotenv #type: ignore
from transformers import CLIPProcessor, CLIPModel #type: ignore
import torch #type: ignore
from PIL import Image #type: ignore
from huggingface_hub import login #type: ignore

load_dotenv()

HUGGING_FACE_ACCESS_TOKEN = os.getenv("HUGGINGFACE_ACCESS_TOKEN")

login(token=HUGGING_FACE_ACCESS_TOKEN)

processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")

PREDEFINED_THEMES = [
    'nature', 'city', 'people', 'food', 'travel', 'fitness', 'art', 'technology', 'pets', 'emotions'
]

def get_closest_theme(image_path): # provide filepath (uploads/)
    print('getting closest theme\n')
    # Open image
    image = Image.open(image_path)

    text_inputs = PREDEFINED_THEMES
    inputs = processor(text=text_inputs, images=image, return_tensors="pt", padding=True)

    # Get closest theme
    outputs = model(**inputs)
    logits_per_image = outputs.logits_per_image
    probs = logits_per_image.softmax(dim=1)

    theme_index = torch.argmax(probs)
    return PREDEFINED_THEMES[theme_index]

# --------- TESTING --------- # 
# image_path = 'uploads/test.jpg'
# theme = get_closest_theme(image_path)
# print(f"The image matches the theme: {theme}\n")