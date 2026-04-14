# 🎙️ DiagnoX-VitaScan

> **Continuous disease monitoring through non-invasive AI-powered vocal biomarker analysis**

---

## 🌐 Live Demo

🚀 **Try the App:** [https://diagnox-vitascan.vercel.app/](https://diagnox-vitascan.vercel.app/)

---

## 🎥 Demo Video

▶️ **Watch Demo:** [https://drive.google.com/file/d/1TlRGLyb7Wmguk8zVXfeyMV4JVEfuIAP4/view?usp=drive_link](https://drive.google.com/file/d/1TlRGLyb7Wmguk8zVXfeyMV4JVEfuIAP4/view?usp=drive_link)

---

## 🌟 Overview

**DiagnoX-VitaScan** is an advanced full-stack AI healthcare application designed to detect disease presence and risk levels using **human vocal biomarkers**.

By uploading or recording a short **10–15 second voice sample**, the system analyzes audio waveforms using a trained **Random Forest classifier** to generate predictive health insights.

The platform enables users to:

- 🔍 Visualize deep diagnostic feature maps
- 📈 Track health over time
- 🤖 Receive AI-generated medical explanations

—all **without invasive procedures**.

---

## 🚀 Key Features

### 🎤 Real-time Audio Processing
Supports recording or uploading `.wav`, `.mp3`, `.ogg` files

### 🧬 Deep Feature Extraction
Analyzes **150+ audio features** including:
- MFCCs
- Spectral roll-off
- Chroma features
- Pitch contours

### 🧠 Machine Learning Classification
Custom-trained Random Forest model provides:
- Disease prediction
- Risk severity score

### 📊 Longitudinal Dashboard
- Built with **Recharts + Firebase**
- Tracks historical health trends

### 🤖 Explainable GenAI
- Powered by **Google Gemini SDK**
- → Converts predictions into simple health insights

### ✨ Premium UI/UX
- Next.js 16
- Framer Motion
- Lenis Smooth Scroll
- Spline 3D Graphics

---

## 🏗️ Architecture Stack

### 🌐 Web Application (Frontend)
| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (React 18) |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion + Lenis |
| Auth & DB | Firebase Auth + Firestore |

### 🧠 Machine Learning Engine (Backend)
| Component | Technology |
|-----------|------------|
| Language | Python 3 |
| Interface | Streamlit |
| Audio Processing | Librosa, NumPy, Pandas |
| ML Model | Scikit-Learn (Random Forest) |
| Visualization | Plotly |

---

## 💻 Local Development Setup

### 1️⃣ Frontend (Next.js)
```bash
npm install
npm run dev
```
Open 👉 [http://localhost:3000](http://localhost:3000)

### 2️⃣ Backend (ML Engine)
```bash
cd backend
pip install -r requirements.txt
streamlit run app.py
```
Open 👉 [http://localhost:8501](http://localhost:8501)

---

## 🔒 Security & Privacy

- All data processed via secure Firebase pipelines
- No raw audio stored without authorization
- Firestore rules ensure strict access control
- User privacy is prioritized at every stage
