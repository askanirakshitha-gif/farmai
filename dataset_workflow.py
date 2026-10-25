"""
KrishiVision AI / FarmAI — Dataset Acquisition, Validation & Preparation Workflow
==================================================================================
This utility guides you through acquiring, validating, and formatting the benchmark
PlantVillage and supplementary crop disease datasets for KrishiVision AI.
"""

import os
import sys
import argparse
from pathlib import Path

# The 38 canonical PlantVillage classes supported by KrishiVision AI
PLANTVILLAGE_38_CLASSES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

DATASET_SOURCES = {
    "PlantVillage (Curated 87K Augmented & Raw splits)": {
        "description": "Most widely used version, organized into train/valid splits for all 38 classes.",
        "kaggle_slug": "vipoooool/new-plant-diseases-dataset",
        "kaggle_cmd": "kaggle datasets download -d vipoooool/new-plant-diseases-dataset --unzip -p ./data/plantvillage_87k",
        "web_url": "https://www.kaggle.com/datasets/vipoooool/new-plant-diseases-dataset",
        "size": "~2.7 GB"
    },
    "PlantVillage (Original Raw 54,305 Images)": {
        "description": "Original raw color images from Penn State University / EPFL PlantVillage project.",
        "kaggle_slug": "emmarex/plantdisease",
        "kaggle_cmd": "kaggle datasets download -d emmarex/plantdisease --unzip -p ./data/plantvillage_raw",
        "web_url": "https://www.kaggle.com/datasets/emmarex/plantdisease",
        "size": "~827 MB"
    },
    "Rice Leaf Diseases (Brown Spot, Blight, Smut)": {
        "description": "Supplementary cereal disease dataset matching KrishiVision's Rice pathology guide.",
        "kaggle_slug": "vbookshelf/rice-leaf-diseases",
        "kaggle_cmd": "kaggle datasets download -d vbookshelf/rice-leaf-diseases --unzip -p ./data/rice_leaf",
        "web_url": "https://www.kaggle.com/datasets/vbookshelf/rice-leaf-diseases",
        "size": "~37 MB"
    },
    "PlantDoc (In-Situ Field Real World Imagery)": {
        "description": "Images taken in natural field conditions with complex backgrounds to test real-world robustness.",
        "kaggle_slug": "dhiraj97/plant-doc-dataset",
        "kaggle_cmd": "kaggle datasets download -d dhiraj97/plant-doc-dataset --unzip -p ./data/plantdoc",
        "web_url": "https://www.kaggle.com/datasets/dhiraj97/plant-doc-dataset",
        "size": "~1.1 GB"
    }
}


def print_workflow_guide():
    print("=" * 80)
    print("  KRISHIVISION AI / FARMAI — DATASET ACQUISITION & PREPARATION WORKFLOW")
    print("=" * 80)
    print("\n[Step 1] Select and Obtain the Required Datasets:")
    print("-" * 80)
    
    for idx, (name, meta) in enumerate(DATASET_SOURCES.items(), 1):
        print(f"\n{idx}. {name}")
        print(f"   Size:        {meta['size']}")
        print(f"   Description: {meta['description']}")
        print(f"   Web Browser: {meta['web_url']}")
        print(f"   Terminal CLI: {meta['kaggle_cmd']}")

    print("\n" + "-" * 80)
    print("[Step 2] Automated Download Options in Python:")
    print("-" * 80)
    print("""
Option A: Using kagglehub (Recommended, handles auth & cache automatically)
--------------------------------------------------------------------------
pip install kagglehub

import kagglehub
# Downloads the 87k image split dataset:
path = kagglehub.dataset_download("vipoooool/new-plant-diseases-dataset")
print("Dataset downloaded to cache path:", path)


Option B: Using Kaggle CLI
--------------------------------------------------------------------------
1. Go to https://www.kaggle.com/settings -> Click 'Create New Token' -> downloads kaggle.json
2. Move kaggle.json to: %USERPROFILE%\\.kaggle\\kaggle.json (on Windows)
3. Run:
   kaggle datasets download -d vipoooool/new-plant-diseases-dataset --unzip -p ./data/plantvillage_87k


Option C: Using Hugging Face Datasets
--------------------------------------------------------------------------
pip install datasets
from datasets import load_dataset
ds = load_dataset("keremberke/plant-disease-classification")
""")

    print("-" * 80)
    print("[Step 3] Standard Directory Layout for Model Training:")
    print("-" * 80)
    print("""
data/
  ├── train/
  │   ├── Apple___Apple_scab/
  │   ├── Tomato___Early_blight/
  │   └── ... (all 38 class directories)
  ├── valid/
  │   ├── Apple___Apple_scab/
  │   └── ...
  └── test/
      ├── Apple___Apple_scab/
      └── ...
""")

    print("-" * 80)
    print("[Step 4] Validate Your Downloaded Dataset:")
    print("-" * 80)
    print("Run this script with --validate to check folder structure and class balance:")
    print("  python dataset_workflow.py --validate C:\\path\\to\\dataset_folder\n")
    print("=" * 80)


def validate_dataset_folder(folder_path: str):
    path = Path(folder_path)
    if not path.exists():
        print(f"Error: Path does not exist: {path}")
        return

    print(f"\nScanning and validating dataset at: {path}\n" + "-" * 60)
    
    # Check direct subfolders
    subdirs = [p for p in path.iterdir() if p.is_dir()]
    subnames = [p.name for p in subdirs]

    # Check if there is an outer folder like 'New Plant Diseases Dataset(Augmented)'
    if len(subdirs) <= 3 and any(n.lower() in ["train", "valid", "test", "dataset"] for n in subnames):
        print("Detected partitioned dataset structure (train/valid/test).")
        for p in subdirs:
            validate_subset(p)
        return

    validate_subset(path)


def validate_subset(path: Path):
    subdirs = [p for p in path.iterdir() if p.is_dir()]
    total_images = 0
    matched_classes = 0
    missing_classes = []

    valid_exts = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

    for expected in PLANTVILLAGE_38_CLASSES:
        # Match case-insensitively or with normalized underscores
        found = False
        for s in subdirs:
            if s.name.lower() == expected.lower() or s.name.replace(" ", "_").lower() == expected.replace(" ", "_").lower():
                found = True
                img_count = sum(1 for f in s.iterdir() if f.is_file() and f.suffix.lower() in valid_exts)
                total_images += img_count
                break
        if found:
            matched_classes += 1
        else:
            missing_classes.append(expected)

    print(f"\nSubset: '{path.name}'")
    print(f"  • Total subdirectories found: {len(subdirs)}")
    print(f"  • Matched PlantVillage classes: {matched_classes} / {len(PLANTVILLAGE_38_CLASSES)}")
    print(f"  • Total verified leaf images: {total_images:,}")

    if missing_classes and matched_classes > 0:
        print(f"  • Note: {len(missing_classes)} classes not found in this folder (e.g. {missing_classes[:3]}...)")
    elif matched_classes == len(PLANTVILLAGE_38_CLASSES):
        print("  ✓ Full 38-class PlantVillage compatibility confirmed!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="KrishiVision AI Dataset Workflow Helper")
    parser.add_argument("--guide", action="store_true", help="Display complete dataset workflow guide")
    parser.add_argument("--validate", type=str, help="Validate an existing dataset directory")
    parser.add_argument("--list-classes", action="store_true", help="List all 38 supported crop disease classes")

    args = parser.parse_args()

    if args.list_classes:
        print(f"\nKrishiVision AI — 38 Supported PlantVillage Classes:\n" + "=" * 50)
        for i, c in enumerate(PLANTVILLAGE_38_CLASSES, 1):
            print(f"{i:2d}. {c}")
        print("=" * 50)
    elif args.validate:
        validate_dataset_folder(args.validate)
    else:
        print_workflow_guide()
