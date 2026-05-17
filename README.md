TrustChain AI Document Verification System  

Thinkroot x Vortex NIT Hackathon  
Team Cosmo Coders  

Overview  

- TrustChain is an AI powered document verification system designed to detect forged documents and ensure authenticity using OCR image forensics ELA machine learning and blockchain  

- The main goal is to provide a secure intelligent and tamper proof solution for verifying certificates ID cards and official documents  

Features  

- The system allows users to upload documents in formats such as JPG and PNG for verification  

- It supports multi language OCR to extract text from documents in English Tamil Hindi Malayalam and Telugu  

- TrustChain performs Error Level Analysis to identify inconsistencies in image compression that may indicate tampering  

- A deep learning model based on ResNet is used to classify documents as REAL or FAKE along with a confidence score  

- A smart confidence engine improves accuracy by combining machine learning output ELA variance and OCR text density  

- Blockchain integration ensures document authenticity by storing and verifying SHA 256 hashes and preventing duplication  

Processing Pipeline  

- The system begins with user document upload followed by OCR text extraction  

- It then generates an ELA image to detect manipulation patterns and passes it to the AI model for classification  

- The hybrid confidence engine refines the result and blockchain verification confirms document authenticity  

Smart Confidence Logic  

- The final confidence score is calculated using machine learning confidence ELA variance analysis and OCR text density  

- Documents are categorized into three levels highly reliable for scores above 85 percent moderate confidence for scores between 60 and 85 percent and needs review for scores below 60 percent  

Blockchain  

- TrustChain uses SHA 256 to generate a unique hash for each document  

- The system interacts with Ethereum to store and verify document hashes  

- It shows results such as stored or already exists verified or not verified and provides the hash for copying  

Tech Stack  

- Frontend uses React and Tailwind CSS for a modern responsive interface  

- Backend is built with FastAPI for high performance  

- The AI model uses PyTorch with ResNet architecture  

- OCR is implemented using Tesseract  

- Blockchain operations use Web3 and Ethereum  

UI Highlights  

- The interface uses a dark futuristic theme with modern design elements  

- It includes smooth animations such as scan line and magnifier effects  

- A tab based dashboard displays analysis ELA comparison OCR output and blockchain status  

Use Cases  

- Certificate verification for educational institutions  

- Identity validation for secure systems  

- Fraud detection for tampered documents  

- Government document authentication  

Innovation  

- TrustChain combines AI OCR image forensics and blockchain into a single intelligent pipeline  

- This integration provides a powerful solution for reliable document verification  

Conclusion  

- TrustChain is a secure scalable and intelligent platform for detecting document forgery and ensuring authenticity  

Team  
- Cosmo Coders
