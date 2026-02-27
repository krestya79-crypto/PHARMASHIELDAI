# PHARMASHIELDAI
AI-powered clinical decision-support system for analyzing potential drug interactions using a structured medication database and local LLM fallback
# PharmaShield AI (Pharma Assistant)

PharmaShield AI is a Flask-based clinical decision-support web application designed to help pharmacists and healthcare professionals review potential drug interaction signals using a structured local medication database and a local AI model (via Ollama).

⚠️ This system is a clinical decision-support tool only.  
Final prescribing authority rests with a licensed healthcare professional.

---

## What This Project Does

- Accepts patient details (ID, name, age, weight, allergies)
- Accepts at least two medications
- Checks for interaction signals using a local `drugs.json` database
- Generates a structured clinical report using a local LLM (Ollama)
- Automatically falls back to a rules-based report if the LLM is unavailable
- Enforces a strict medical report format

---

## Technology Used

- Python
- Flask
- Ollama (Local LLM runtime)
- Waitress (Production WSGI server)
- JSON-based medication database

---

## Required File

The project requires a file named:

drugs.json

Example structure:

{
  "Aspirin": {
    "warning": "Avoid in NSAID allergy. Bleeding risk.",
    "interactions": ["Warfarin"]
  },
  "Warfarin": {
    "warning": "Monitor INR closely.",
    "interactions": ["Aspirin"]
  }
}

---

## Installation

1) Create virtual environment:

python -m venv venv

Activate it:

Windows:
venv\Scripts\activate

Linux/Mac:
source venv/bin/activate

2) Install dependencies:

pip install flask waitress ollama

3) Make sure drugs.json is in the same directory as app.py.

---

## Running the Application

Simply run:

python app.py

The application will start on:

http://localhost:5000

If Waitress is installed, it will automatically run in production mode.

---

## Environment Variables (Optional)

PHARMAI_MODEL  
Default: gemma  
Specifies which Ollama model to use.

PHARMASHIELD_HOST  
Default: 0.0.0.0

PHARMASHIELD_PORT  
Default: 5000

PHARMASHIELD_DEBUG  
Set to 1 or true to enable debug mode.

Example:

set PHARMAI_MODEL=gemma
set PHARMASHIELD_DEBUG=0
python app.py

---

## API Endpoint

POST /api/analyze

Example request body:

{
  "patient_id": "123",
  "patient_name": "John Doe",
  "age": 45,
  "weight": 78,
  "allergies": ["NSAIDs"],
  "medications": ["Aspirin", "Warfarin"]
}

The system returns a structured clinical interaction report.

---

## Safety Controls

- The AI is restricted from providing prescribing instructions.
- Exact dosing is not allowed unless explicitly supported by structured data.
- The report format is enforced automatically.
- A mandatory medical disclaimer is always included.
- If the AI fails, the system returns a deterministic rules-based report.

---

## Production Notes

For production deployment:
- Disable debug mode
- Use HTTPS
- Add authentication
- Add rate limiting
- Avoid logging patient identifiers in production logs

---

## Disclaimer

This software is provided for educational and clinical support purposes only.  
It is not a substitute for professional medical judgment.
