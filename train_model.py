"""
KrishiVision AI / FarmAI — Deep Learning Model Training Pipeline
================================================================
Trains MobileNetV3-Large on foliar crop disease datasets using Keras 3 & TensorFlow.
Saves model weights, class indices, and training performance history for the backend API.
"""

import os
import sys
import json
import time
import argparse
from pathlib import Path

# Silence verbose TF warnings
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

import numpy as np
import keras
from keras import layers

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
TRAIN_DIR = DATA_DIR / "train"
VAL_DIR = DATA_DIR / "val"
MODELS_DIR = BASE_DIR / "backend" / "models"

IMAGE_SIZE = (224, 224)
BATCH_SIZE = 32

def build_model(num_classes: int):
    # Data Augmentation pipeline
    data_augmentation = keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.1),
        layers.RandomZoom(0.1),
        layers.RandomContrast(0.1),
    ], name="data_augmentation")

    # MobileNetV3Large backbone with pre-trained ImageNet weights
    base_model = keras.applications.MobileNetV3Large(
        input_shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3),
        include_top=False,
        weights="imagenet"
    )
    base_model.trainable = False  # Freeze for initial head training

    inputs = keras.Input(shape=(IMAGE_SIZE[0], IMAGE_SIZE[1], 3), name="input_image")
    x = data_augmentation(inputs)
    x = keras.applications.mobilenet_v3.preprocess_input(x)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D(name="global_avg_pool")(x)
    x = layers.BatchNormalization()(x)
    x = layers.Dense(256, activation="relu", name="dense_features")(x)
    x = layers.Dropout(0.3, name="head_dropout")(x)
    outputs = layers.Dense(num_classes, activation="softmax", name="predictions")(x)

    model = keras.Model(inputs=inputs, outputs=outputs, name="KrishiVision_MobileNetV3")
    return model, base_model

def train(epochs: int = 4, fine_tune_epochs: int = 2, learning_rate: float = 1e-3):
    start_time = time.time()
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    print("=" * 75)
    print(" KRISHIVISION AI — CROP DISEASE MODEL TRAINING PIPELINE")
    print("=" * 75)

    if not TRAIN_DIR.exists() or not any(TRAIN_DIR.iterdir()):
        print(f"Error: Training directory not found or empty at {TRAIN_DIR}")
        print("Please run 'python extract_dataset.py' first.")
        sys.exit(1)

    print(f"\n[1/5] Loading datasets from disk (Batch Size: {BATCH_SIZE}, Image Size: {IMAGE_SIZE})...")
    train_ds = keras.utils.image_dataset_from_directory(
        TRAIN_DIR,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=True,
        seed=42
    )

    val_ds = keras.utils.image_dataset_from_directory(
        VAL_DIR,
        image_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        shuffle=False,
        seed=42
    )

    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"  • Found {len(class_names)} disease classes")
    print(f"  • Classes: {class_names}")

    # Save class indices
    classes_file = MODELS_DIR / "classes.json"
    with open(classes_file, "w") as f:
        json.dump(class_names, f, indent=2)
    print(f"  • Class labels saved to: {classes_file}")

    # Optimize data streaming
    AUTOTUNE = keras.backend.get_autotune() if hasattr(keras.backend, "get_autotune") else -1
    train_ds = train_ds.prefetch(buffer_size=1)
    val_ds = val_ds.prefetch(buffer_size=1)

    print(f"\n[2/5] Building MobileNetV3-Large neural architecture...")
    model, base_model = build_model(num_classes)
    model.summary()

    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=learning_rate),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )

    checkpoint_path = MODELS_DIR / "crop_mobilenetv3.keras"
    callbacks = [
        keras.callbacks.ModelCheckpoint(
            filepath=str(checkpoint_path),
            monitor="val_accuracy",
            mode="max",
            save_best_only=True,
            verbose=1
        ),
        keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=3,
            restore_best_weights=True
        )
    ]

    print(f"\n[3/5] Phase 1: Training Classification Head ({epochs} Epochs)...")
    history_phase1 = model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs,
        callbacks=callbacks
    )

    total_history = {
        "train_loss": [float(x) for x in history_phase1.history.get("loss", [])],
        "train_acc": [float(x) for x in history_phase1.history.get("accuracy", [])],
        "val_loss": [float(x) for x in history_phase1.history.get("val_loss", [])],
        "val_acc": [float(x) for x in history_phase1.history.get("val_accuracy", [])],
    }

    if fine_tune_epochs > 0:
        print(f"\n[4/5] Phase 2: Fine-Tuning Top Backbone Layers ({fine_tune_epochs} Epochs)...")
        # Unfreeze top 25 layers of MobileNetV3
        base_model.trainable = True
        for layer in base_model.layers[:-25]:
            layer.trainable = False

        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=learning_rate * 0.1),
            loss="sparse_categorical_crossentropy",
            metrics=["accuracy"]
        )

        history_phase2 = model.fit(
            train_ds,
            validation_data=val_ds,
            epochs=fine_tune_epochs,
            callbacks=callbacks
        )

        total_history["train_loss"].extend([float(x) for x in history_phase2.history.get("loss", [])])
        total_history["train_acc"].extend([float(x) for x in history_phase2.history.get("accuracy", [])])
        total_history["val_loss"].extend([float(x) for x in history_phase2.history.get("val_loss", [])])
        total_history["val_acc"].extend([float(x) for x in history_phase2.history.get("val_accuracy", [])])

    print("\n[5/5] Evaluating final model on validation partition...")
    eval_results = model.evaluate(val_ds, verbose=0)
    val_loss, val_acc = eval_results[0], eval_results[1]

    # Save final model if not already saved by checkpoint
    if not checkpoint_path.exists():
        model.save(checkpoint_path)

    # Save metrics JSON
    metrics_summary = {
        "model_architecture": "MobileNetV3-Large + Squeeze-and-Excitation",
        "num_classes": num_classes,
        "classes": class_names,
        "final_val_accuracy": round(float(val_acc) * 100, 2),
        "final_val_loss": round(float(val_loss), 4),
        "total_training_time_seconds": round(time.time() - start_time, 1),
        "training_history": total_history,
        "model_path": str(checkpoint_path)
    }

    metrics_file = MODELS_DIR / "training_metrics.json"
    with open(metrics_file, "w") as f:
        json.dump(metrics_summary, f, indent=2)

    elapsed = time.time() - start_time
    print("\n" + "=" * 75)
    print(f" TRAINING SUCCESSFUL! Completed in {elapsed/60:.1f} minutes")
    print(f"  • Final Validation Accuracy: {val_acc * 100:.2f}%")
    print(f"  • Final Validation Loss:     {val_loss:.4f}")
    print(f"  • Trained Model Saved to:    {checkpoint_path}")
    print(f"  • Evaluation Metrics:        {metrics_file}")
    print("=" * 75)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="KrishiVision AI Model Trainer")
    parser.add_argument("--epochs", type=int, default=3, help="Epochs for classification head training")
    parser.add_argument("--fine-tune", type=int, default=1, help="Epochs for backbone fine-tuning")
    parser.add_argument("--lr", type=float, default=1e-3, help="Initial learning rate")
    args = parser.parse_args()

    train(epochs=args.epochs, fine_tune_epochs=args.fine_tune, learning_rate=args.lr)
