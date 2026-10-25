"""
KrishiVision AI / FarmAI — Dataset Extractor
============================================
Extracts real crop disease images from the downloaded Hugging Face / PlantVillage parquet file
and formats them into standard train/val folders and real sample test images.
"""

import os
import io
import json
import random
from pathlib import Path
import pyarrow.parquet as pq
from PIL import Image

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
TRAIN_DIR = DATA_DIR / "train"
VAL_DIR = DATA_DIR / "val"
SAMPLES_DIR = BASE_DIR / "sample_test_images"

# Known paths where the user or browser might have placed the parquet file
CANDIDATE_PATHS = [
    Path(os.path.expanduser(r"~\Downloads\test-00000-of-00001.parquet.crdownload")),
    Path(os.path.expanduser(r"~\Downloads\test-00000-of-00001.parquet")),
    DATA_DIR / "test-00000-of-00001.parquet",
    BASE_DIR / "test-00000-of-00001.parquet",
]

# Mapping HF label strings to standard KrishiVision class names
def normalize_class_name(raw_name: str) -> str:
    name = raw_name.strip()
    # Normalize Pepper
    name = name.replace("Pepper__bell", "Pepper,_bell")
    # Normalize Tomato double/single underscores
    if name.startswith("Tomato_") and not name.startswith("Tomato___"):
        name = name.replace("Tomato__", "Tomato___")
        name = name.replace("Tomato_", "Tomato___")
    # Fix YellowLeaf curl virus casing
    name = name.replace("Tomato___Tomato_YellowLeaf__Curl_Virus", "Tomato___Tomato_Yellow_Leaf_Curl_Virus")
    return name

def find_parquet_file():
    for p in CANDIDATE_PATHS:
        if p.exists() and p.stat().st_size > 10 * 1024 * 1024:
            return p
    # Search whole downloads folder
    downloads = Path(os.path.expanduser(r"~\Downloads"))
    if downloads.exists():
        for f in downloads.glob("*parquet*"):
            if f.is_file() and f.stat().st_size > 10 * 1024 * 1024:
                return f
    return None

def extract_dataset(val_split: float = 0.20):
    parquet_path = find_parquet_file()
    if not parquet_path:
        raise FileNotFoundError(
            "Could not locate the parquet dataset file. Please verify it is in Downloads or data/ folder."
        )

    print(f"Found dataset at: {parquet_path} ({parquet_path.stat().st_size / (1024*1024):.1f} MB)")
    print("Reading parquet table...")
    table = pq.read_table(str(parquet_path))

    # Read class names metadata
    meta = pq.read_metadata(str(parquet_path))
    hf_meta = json.loads(meta.metadata.get(b'huggingface', b'{}').decode('utf-8'))
    raw_class_names = hf_meta.get('info', {}).get('features', {}).get('label', {}).get('names', [])

    if not raw_class_names:
        raise ValueError("Could not find label names in parquet metadata.")

    normalized_classes = [normalize_class_name(c) for c in raw_class_names]
    print(f"Detected {len(normalized_classes)} disease classes across {table.num_rows} images.")

    # Create destination directories
    TRAIN_DIR.mkdir(parents=True, exist_ok=True)
    VAL_DIR.mkdir(parents=True, exist_ok=True)
    SAMPLES_DIR.mkdir(parents=True, exist_ok=True)

    for cls in normalized_classes:
        (TRAIN_DIR / cls).mkdir(parents=True, exist_ok=True)
        (VAL_DIR / cls).mkdir(parents=True, exist_ok=True)

    num_rows = table.num_rows
    col_image = table['image']
    col_label = table['label']

    saved_samples_per_class = {}
    train_count = 0
    val_count = 0

    print(f"Extracting and partitioning {num_rows} images (80% train / 20% validation)...")

    random.seed(42)

    for i in range(num_rows):
        label_idx = col_label[i].as_py()
        cls_name = normalized_classes[label_idx]
        img_bytes = col_image[i]['bytes'].as_py()

        # Decide train or val
        is_val = random.random() < val_split
        target_folder = (VAL_DIR if is_val else TRAIN_DIR) / cls_name
        
        file_name = f"img_{i:05d}.jpg"
        out_path = target_folder / file_name

        with open(out_path, "wb") as f:
            f.write(img_bytes)

        if is_val:
            val_count += 1
        else:
            train_count += 1

        # Also save 1 clean sample per class for immediate UI testing
        if cls_name not in saved_samples_per_class:
            sample_out = SAMPLES_DIR / f"real_{cls_name}.jpg"
            with open(sample_out, "wb") as f:
                f.write(img_bytes)
            saved_samples_per_class[cls_name] = True

        if (i + 1) % 500 == 0 or (i + 1) == num_rows:
            print(f"  Processed {i + 1}/{num_rows} images...")

    print("\nDataset extraction complete!")
    print(f"  • Training set images:   {train_count}")
    print(f"  • Validation set images: {val_count}")
    print(f"  • Total classes:         {len(normalized_classes)}")
    print(f"  • Train folder:          {TRAIN_DIR}")
    print(f"  • Val folder:            {VAL_DIR}")
    print(f"  • Real UI sample images: {SAMPLES_DIR}")

    # Save class list as json for the backend / trainer
    classes_json = DATA_DIR / "classes.json"
    with open(classes_json, "w") as f:
        json.dump(normalized_classes, f, indent=2)
    print(f"Saved class index mapping to: {classes_json}")

if __name__ == "__main__":
    extract_dataset()
