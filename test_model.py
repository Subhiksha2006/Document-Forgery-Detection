import torch
import torch.nn as nn
from torchvision import transforms, models
from torchvision.models import ResNet18_Weights
from PIL import Image

# =====================
# CONFIG
# =====================
MODEL_PATH = "model/model.pth"
IMAGE_PATH = "uploads/certificate.jpg"  # change this

# =====================
# TRANSFORM
# =====================
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# =====================
# LOAD MODEL
# =====================
model = models.resnet18(weights=ResNet18_Weights.DEFAULT)
model.fc = nn.Linear(model.fc.in_features, 2)

model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu"))
model.eval()

classes = ['fake', 'real']

# =====================
# LOAD IMAGE
# =====================
image = Image.open(IMAGE_PATH).convert("RGB")
image = transform(image).unsqueeze(0)

# =====================
# PREDICT
# =====================
with torch.no_grad():
    outputs = model(image)
    _, predicted = torch.max(outputs, 1)

result = classes[predicted.item()]

print("Prediction:", result)