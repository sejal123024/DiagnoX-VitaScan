# AI Voice Biomarker Disease Tracking System 🎙️

A complete, end-to-end prototype for continuous monitoring of specific respiratory and neurological conditions using vocal biomarkers. 

## 🎯 Target Diseases Assessed:
* Asthma
* Cardiovascular diseases
* Neurological disorders
* Post-stroke complications
* Parkinson’s disease
* Depression

## 🏗️ System Architecture Pipeline

The system is strictly modular, decoupled, and ready for deployment/frontend integration.
* **Module 1**: `app.py` - Recording Module & Dashboard interface.
* **Module 2**: `core/audio_processor.py` - DSP via Librosa (trimming, noise handling, norm).
* **Module 3**: `core/feature_extractor.py` - Extracts exact metrics utilizing Librosa, OpenSMILE (eGeMAPSv02), and Deep embeddings from Wav2Vec 2.0 (Transformers).
* **Module 4**: `core/model_manager.py` - Multi-class automated disease classifier utilizing RandomForest inference mapped to explainable AI criteria.
* **Module 5 & 6**: `app.py` & `core/alert_system.py` - Real-time tracking and automated risk triggers.

## 🚀 How to Run the Prototype

**1. Create a Python environment:**
```bash
python -m venv venv
venv\Scripts\activate
```

**2. Install requirements:**
```bash
pip install -r requirements.txt
```
*(Note: If `opensmile` or `transformers` fail to install natively, the system will elegantly fallback to zero-matrices to ensure the UI and workflow remains demonstrable).*

**3. Launch the Web Application:**
```bash
streamlit run app.py
```
*(The system will automatically generate a mock trained prototype model on first execution so that it evaluates immediately).*

## 💡 Frontend Integration Notes
The Python logic resides purely inside the `/core` directory mapping strictly to dictionary outputs. You can expose `ModelManager().predict()` as a REST Endpoint via **FastAPI** internally for a React/Next.js client to call directly!
