import os
import json
import numpy as np
import tensorflow as tf

from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.utils.class_weight import compute_class_weight


# ==========================================
# SETTINGS
# ==========================================

IMAGE_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 15

DATASET_DIR = "../dataset"
MODEL_DIR = "../model"

os.makedirs(MODEL_DIR, exist_ok=True)


# ==========================================
# DATA AUGMENTATION
# ==========================================

train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,

    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,

    zoom_range=0.2,
    shear_range=0.2,

    horizontal_flip=True,

    validation_split=0.2
)


# ==========================================
# TRAINING DATA
# ==========================================

train_data = train_datagen.flow_from_directory(
    DATASET_DIR,

    target_size=(IMAGE_SIZE, IMAGE_SIZE),

    batch_size=BATCH_SIZE,

    class_mode="categorical",

    subset="training",

    shuffle=True,

    seed=42
)


# ==========================================
# VALIDATION DATA
# ==========================================

validation_data = train_datagen.flow_from_directory(
    DATASET_DIR,

    target_size=(IMAGE_SIZE, IMAGE_SIZE),

    batch_size=BATCH_SIZE,

    class_mode="categorical",

    subset="validation",

    shuffle=False,

    seed=42
)


# ==========================================
# CLASS INFORMATION
# ==========================================

class_indices = train_data.class_indices

num_classes = len(class_indices)

print("\n======================================")
print("CLASS INFORMATION")
print("======================================")

for class_name, index in class_indices.items():
    print(index, "->", class_name)


# ==========================================
# CLASS WEIGHTS
# ==========================================

class_labels = train_data.classes

class_weights_array = compute_class_weight(
    class_weight="balanced",

    classes=np.unique(class_labels),

    y=class_labels
)

class_weights = {
    i: float(weight)
    for i, weight in enumerate(class_weights_array)
}


print("\n======================================")
print("CLASS WEIGHTS")
print("======================================")

print(class_weights)


# ==========================================
# CNN MODEL
# ==========================================

model = models.Sequential([

    layers.Input(
        shape=(IMAGE_SIZE, IMAGE_SIZE, 3)
    ),


    # --------------------------------------
    # BLOCK 1
    # --------------------------------------

    layers.Conv2D(
        32,
        (3, 3),
        activation="relu"
    ),

    layers.MaxPooling2D(
        (2, 2)
    ),


    # --------------------------------------
    # BLOCK 2
    # --------------------------------------

    layers.Conv2D(
        64,
        (3, 3),
        activation="relu"
    ),

    layers.MaxPooling2D(
        (2, 2)
    ),


    # --------------------------------------
    # BLOCK 3
    # --------------------------------------

    layers.Conv2D(
        128,
        (3, 3),
        activation="relu"
    ),

    layers.MaxPooling2D(
        (2, 2)
    ),


    # --------------------------------------
    # BLOCK 4
    # --------------------------------------

    layers.Conv2D(
        256,
        (3, 3),
        activation="relu"
    ),

    layers.MaxPooling2D(
        (2, 2)
    ),


    # --------------------------------------
    # CLASSIFICATION
    # --------------------------------------

    layers.Flatten(),

    layers.Dense(
        256,
        activation="relu"
    ),

    layers.Dropout(
        0.5
    ),

    layers.Dense(
        num_classes,
        activation="softmax"
    )
])


# ==========================================
# COMPILE MODEL
# ==========================================

model.compile(

    optimizer="adam",

    loss="categorical_crossentropy",

    metrics=["accuracy"]
)


# ==========================================
# MODEL SUMMARY
# ==========================================

print("\n======================================")
print("MODEL SUMMARY")
print("======================================")

model.summary()


# ==========================================
# CALLBACKS
# ==========================================

callbacks = [

    tf.keras.callbacks.EarlyStopping(
        monitor="val_accuracy",
        patience=3,
        restore_best_weights=True
    ),

    tf.keras.callbacks.ModelCheckpoint(
        "../model/crop_disease_model.keras",

        monitor="val_accuracy",

        save_best_only=True
    )
]


# ==========================================
# TRAIN MODEL
# ==========================================

print("\n======================================")
print("TRAINING STARTED")
print("======================================")

history = model.fit(

    train_data,

    validation_data=validation_data,

    epochs=EPOCHS,

    class_weight=class_weights,

    callbacks=callbacks
)


# ==========================================
# SAVE FINAL MODEL
# ==========================================

model.save(
    "../model/crop_disease_model.keras"
)


# ==========================================
# SAVE CLASS NAMES
# ==========================================

class_names = [
    name
    for name, index in sorted(
        class_indices.items(),
        key=lambda x: x[1]
    )
]


with open(
    "../model/class_names.json",
    "w"
) as file:

    json.dump(
        class_names,
        file,
        indent=4
    )


# ==========================================
# SAVE TRAINING HISTORY
# ==========================================

history_data = {

    "accuracy": [
        float(x)
        for x in history.history["accuracy"]
    ],

    "val_accuracy": [
        float(x)
        for x in history.history["val_accuracy"]
    ],

    "loss": [
        float(x)
        for x in history.history["loss"]
    ],

    "val_loss": [
        float(x)
        for x in history.history["val_loss"]
    ]
}


with open(
    "../model/training_history.json",
    "w"
) as file:

    json.dump(
        history_data,
        file,
        indent=4
    )


# ==========================================
# FINAL RESULT
# ==========================================

print("\n======================================")
print("TRAINING COMPLETED")
print("======================================")

print("Total classes:", num_classes)

print("Classes:", class_names)

print(
    "\nModel saved at:"
)

print(
    "../model/crop_disease_model.keras"
)

print(
    "\nClass names saved at:"
)

print(
    "../model/class_names.json"
)