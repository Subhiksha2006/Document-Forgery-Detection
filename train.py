import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torchvision.models import ResNet18_Weights
from torch.utils.data import DataLoader
import os

# ==============================
# CONFIG
# ==============================
DATASET_PATH = "dataset"
MODEL_PATH = "model/model.pth"

BATCH_SIZE = 8
EPOCHS = 3
LR = 0.001

# ==============================
# TRANSFORMS
# ==============================
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# ==============================
# LOAD DATASET
# ==============================
dataset = datasets.ImageFolder(DATASET_PATH, transform=transform)
loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=True)

print("Classes:", dataset.classes)

# ==============================
# LOAD MODEL (NO WARNING VERSION)
# ==============================
model = models.resnet18(weights=ResNet18_Weights.DEFAULT)

# Change final layer
model.fc = nn.Linear(model.fc.in_features, 2)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

# ==============================
# LOSS + OPTIMIZER
# ==============================
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LR)

# ==============================
# TRAINING LOOP
# ==============================
print("\n🚀 Training Started...\n")

for epoch in range(EPOCHS):
    model.train()
    total_loss = 0

    for i, (images, labels) in enumerate(loader):
        images, labels = images.to(device), labels.to(device)

        # Forward
        outputs = model(images)
        loss = criterion(outputs, labels)

        # Backward
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

        # LIVE PROGRESS
        if i % 10 == 0:
            print(f"Epoch [{epoch+1}/{EPOCHS}] Batch [{i}/{len(loader)}] Loss: {loss.item():.4f}")

    print(f"\n✅ Epoch {epoch+1} Completed | Total Loss: {total_loss:.4f}\n")

# ==============================
# SAVE MODEL
# ==============================
os.makedirs("model", exist_ok=True)
torch.save(model.state_dict(), MODEL_PATH)

print("🎯 TRAINING COMPLETE")
print("Model saved at:", MODEL_PATH)