"""
Generate realistic sample test leaves for KrishiVision AI testing.
Creates high-resolution leaf images in farmai/sample_test_images/
"""

import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "sample_test_images")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def create_leaf_image(filename, base_rgb, lesions=None, veins_rgb=(130, 200, 30)):
    width, height = 512, 512
    # Background (soft studio gray)
    img = Image.new("RGB", (width, height), (241, 245, 249))
    draw = ImageDraw.Draw(img)

    # Leaf polygon base
    leaf_coords = [
        (256, 40),
        (370, 120),
        (420, 250),
        (380, 380),
        (256, 470),
        (132, 380),
        (92, 250),
        (142, 120)
    ]
    draw.polygon(leaf_coords, fill=base_rgb)

    # Veins
    draw.line([(256, 50), (256, 460)], fill=veins_rgb, width=4)
    for y, dy in [(140, 40), (220, 60), (300, 60), (380, 40)]:
        draw.line([(256, y), (370, y - dy)], fill=veins_rgb, width=2)
        draw.line([(256, y), (142, y - dy)], fill=veins_rgb, width=2)

    # Draw lesions if specified
    if lesions:
        for center, halo_rad, necrotic_rad, halo_color, necrotic_color in lesions:
            # Chlorotic yellow halo
            cx, cy = center
            draw.ellipse(
                [(cx - halo_rad, cy - halo_rad), (cx + halo_rad, cy + halo_rad)],
                fill=halo_color
            )
            # Necrotic brown/black spot
            draw.ellipse(
                [(cx - necrotic_rad, cy - necrotic_rad), (cx + necrotic_rad, cy + necrotic_rad)],
                fill=necrotic_color
            )
            # Target rings
            draw.arc(
                [(cx - necrotic_rad // 2, cy - necrotic_rad // 2), 
                 (cx + necrotic_rad // 2, cy + necrotic_rad // 2)],
                start=0, end=360, fill=halo_color, width=2
            )

    # Smooth blur for organic realism
    img = img.filter(ImageFilter.SMOOTH_MORE)
    save_path = os.path.join(OUTPUT_DIR, filename)
    img.save(save_path, "PNG")
    print(f"Generated sample image: {save_path}")

if __name__ == "__main__":
    # 1. Tomato Early Blight (Concentric necrotic dark spots with yellow halos)
    create_leaf_image(
        "tomato_early_blight_sample.png",
        base_rgb=(75, 120, 25),
        lesions=[
            ((220, 200), 45, 30, (235, 185, 20), (65, 25, 5)),
            ((310, 290), 55, 38, (240, 190, 25), (55, 20, 5)),
            ((190, 340), 35, 22, (220, 180, 20), (70, 30, 10)),
        ]
    )

    # 2. Tomato Late Blight (Water-soaked dark greasy decay)
    create_leaf_image(
        "tomato_late_blight_sample.png",
        base_rgb=(50, 80, 20),
        lesions=[
            ((240, 180), 75, 58, (110, 60, 20), (25, 20, 15)),
            ((320, 320), 85, 68, (100, 55, 15), (20, 15, 10)),
        ]
    )

    # 3. Healthy Tomato Leaf (Vibrant green, no spots)
    create_leaf_image(
        "tomato_healthy_leaf_sample.png",
        base_rgb=(34, 150, 50),
        veins_rgb=(100, 210, 60),
        lesions=None
    )

    # 4. Corn Common Rust (Orange/brown pustules)
    create_leaf_image(
        "corn_common_rust_sample.png",
        base_rgb=(95, 150, 20),
        lesions=[
            ((250, 150), 20, 14, (215, 120, 10), (145, 50, 15)),
            ((230, 220), 22, 16, (220, 125, 15), (150, 55, 15)),
            ((280, 270), 25, 18, (210, 115, 10), (140, 48, 12)),
            ((240, 350), 20, 13, (215, 120, 10), (145, 50, 15)),
        ]
    )
    print(f"\nAll sample test images generated in: {OUTPUT_DIR}")
