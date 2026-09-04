import os

DATASET_DIR = "../dataset"

print("\n==============================")
print("CROP DISEASE DATASET")
print("==============================\n")

total_images = 0

classes = os.listdir(DATASET_DIR)

for class_name in classes:

    class_path = os.path.join(
        DATASET_DIR,
        class_name
    )

    if not os.path.isdir(class_path):
        continue

    images = [
        file for file in os.listdir(class_path)
        if file.lower().endswith(
            (".jpg", ".jpeg", ".png", ".bmp", ".webp")
        )
    ]

    print(
        f"{class_name}: {len(images)} images"
    )

    total_images += len(images)


print("\n==============================")
print("TOTAL CLASSES:", len(classes))
print("TOTAL IMAGES:", total_images)
print("==============================")