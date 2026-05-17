import os
import shutil

# ✅ CORRECT PATH
BASE = r"C:\Users\subhi\OneDrive\Desktop\Trustchain\findit2"

TRAIN_DIR = os.path.join(BASE, "train")
LABELS = os.path.join(BASE, "train.txt")

REAL_DIR = "dataset/real"
FAKE_DIR = "dataset/fake"

os.makedirs(REAL_DIR, exist_ok=True)
os.makedirs(FAKE_DIR, exist_ok=True)

real = 0
fake = 0
skipped = 0

with open(LABELS, "r", encoding="utf-8") as f:
    lines = f.readlines()

# skip header
lines = lines[1:]

for line in lines:
    line = line.strip()
    if not line:
        continue

    parts = line.split(",", 4)

    if len(parts) < 4:
        skipped += 1
        continue

    filename = parts[0]
    forged = parts[3]

    img_path = os.path.join(TRAIN_DIR, filename)

    if not os.path.exists(img_path):
        print("❌ NOT FOUND:", img_path)
        skipped += 1
        continue

    if forged == "1":
        shutil.copy(img_path, os.path.join(FAKE_DIR, filename))
        fake += 1
    else:
        shutil.copy(img_path, os.path.join(REAL_DIR, filename))
        real += 1

print("\n✅ Dataset Prepared!")
print("Real:", real)
print("Fake:", fake)
print("Skipped:", skipped)