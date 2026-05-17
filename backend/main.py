from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil
import os
import hashlib

# ML
import torch
import torch.nn as nn
import torchvision.models as models
from torchvision import transforms

# Image Processing
from PIL import Image, ImageChops, ImageEnhance

# OCR
import pytesseract

# Blockchain
from web3 import Web3

# Extra
import numpy as np

# -------------------- APP --------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- DIRECTORIES --------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ELA_FOLDER = os.path.join(BASE_DIR, "ela_outputs")
MODEL_PATH = os.path.join(BASE_DIR, "..", "model", "model.pth")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(ELA_FOLDER, exist_ok=True)

app.mount("/ela_outputs", StaticFiles(directory=ELA_FOLDER), name="ela_outputs")

# -------------------- OCR --------------------
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

LANG_MAP = {
    "eng": "eng",
    "tam": "tam",
    "hin": "hin",
    "mal": "mal",
    "tel": "tel",
    "multi": "eng+tam+hin+mal+tel"
}

def extract_text(image_path, lang="multi"):
    try:
        img = Image.open(image_path).convert("RGB")

        text = pytesseract.image_to_string(
            img,
            lang=LANG_MAP.get(lang, "eng"),
            config="--oem 3 --psm 6"
        )

        return text.strip()
    except Exception as e:
        print("OCR ERROR:", e)
        return "OCR Failed"

# -------------------- HASH --------------------
def generate_hash(file_path):
    with open(file_path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()

# -------------------- ELA --------------------
def generate_ela_image(image_path):
    try:
        original = Image.open(image_path).convert("RGB")

        temp_path = os.path.join(ELA_FOLDER, "temp.jpg")
        original.save(temp_path, "JPEG", quality=90)

        compressed = Image.open(temp_path)

        diff = ImageChops.difference(original, compressed)

        extrema = diff.getextrema()
        max_diff = max([ex[1] for ex in extrema])

        scale = 255.0 / max_diff if max_diff != 0 else 1
        diff = ImageEnhance.Brightness(diff).enhance(scale)

        filename = "ela_" + os.path.basename(image_path)
        ela_path = os.path.join(ELA_FOLDER, filename)

        diff.save(ela_path)

        return filename
    except Exception as e:
        print("ELA ERROR:", e)
        return None

# -------------------- ML MODEL --------------------
model = models.resnet18(pretrained=False)
model.fc = nn.Linear(model.fc.in_features, 2)

model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device("cpu")))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def predict(image_path):
    img = Image.open(image_path).convert("RGB")
    img = transform(img).unsqueeze(0)

    with torch.no_grad():
        output = model(img)
        prob = torch.softmax(output, dim=1)[0]

    confidence = float(prob.max()) * 100
    label = "REAL" if prob.argmax() == 1 else "FAKE"

    return label, confidence

# -------------------- SMART CONFIDENCE --------------------
def compute_final_confidence(ml_conf, ela_path, ocr_text):
    score = ml_conf

    # ELA analysis
    try:
        img = Image.open(ela_path).convert("L")
        arr = np.array(img)
        variance = np.var(arr)

        if variance < 500:
            score += 15
        elif variance > 2000:
            score -= 15
    except:
        pass

    # OCR analysis
    text_len = len(ocr_text.strip())

    if text_len > 50:
        score += 10
    elif text_len < 10:
        score -= 10

    score = max(0, min(100, score))
    return score

def get_analysis_note(conf):
    if conf > 85:
        return "Document structure and compression patterns are consistent."
    elif conf > 65:
        return "Minor inconsistencies detected in image compression."
    else:
        return "Significant anomalies detected. Possible tampering."

# -------------------- BLOCKCHAIN --------------------
w3 = Web3(Web3.HTTPProvider("http://127.0.0.1:8545"))

contract_address = Web3.to_checksum_address(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
)

contract_abi = [
    {
        "inputs": [{"internalType": "bytes32", "name": "docHash", "type": "bytes32"}],
        "name": "registerDocument",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "bytes32", "name": "docHash", "type": "bytes32"}],
        "name": "verifyDocument",
        "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
        "stateMutability": "view",
        "type": "function"
    }
]

contract = w3.eth.contract(address=contract_address, abi=contract_abi)
account = w3.eth.accounts[0]

def store_on_blockchain(doc_hash):
    try:
        tx = contract.functions.registerDocument(doc_hash).transact({"from": account})
        w3.eth.wait_for_transaction_receipt(tx)
        return True
    except Exception as e:
        print("Blockchain Store Error:", e)
        return False

def verify_on_blockchain(doc_hash):
    try:
        return contract.functions.verifyDocument(doc_hash).call()
    except Exception as e:
        print("Blockchain Verify Error:", e)
        return False

# -------------------- API --------------------
@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    lang: str = Form("multi")
):

    # Save file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Hash
    file_hash = generate_hash(file_path)

    # ELA
    ela_filename = generate_ela_image(file_path)
    ela_full_path = os.path.join(ELA_FOLDER, ela_filename) if ela_filename else None

    # OCR
    ocr_text = extract_text(file_path, lang)

    # ML
    result, ml_conf = predict(ela_full_path)

    # Hybrid confidence
    confidence = compute_final_confidence(
        ml_conf,
        ela_full_path,
        ocr_text
    )

    # Blockchain
    blockchain_verified = verify_on_blockchain(bytes.fromhex(file_hash))

    if not blockchain_verified:
        stored = store_on_blockchain(bytes.fromhex(file_hash))
        blockchain_status = "stored" if stored else "failed"

        if stored:
            blockchain_verified = verify_on_blockchain(bytes.fromhex(file_hash))
    else:
        blockchain_status = "already_exists"

    ela_url = f"http://127.0.0.1:8000/ela_outputs/{ela_filename}"

    return {
        "result": result,
        "confidence": f"{confidence:.2f}%",
        "analysis_note": get_analysis_note(confidence),
        "blockchain_status": blockchain_status,
        "blockchain_verified": blockchain_verified,
        "hash": file_hash,
        "ela_image": ela_url,
        "extracted_text": ocr_text
    }

# -------------------- ROOT --------------------
@app.get("/")
def home():
    return {"message": "TrustChain Full System Running 🚀"}