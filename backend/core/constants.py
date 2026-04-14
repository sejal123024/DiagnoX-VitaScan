"""
Core constants and configurations for ML models and audio parsers.
"""

# Audio Processing Defaults
SAMPLE_RATE = 16000
CHANNELS = 1
BIT_DEPTH = 16
MAX_DURATION_SECONDS = 300

# Feature Extraction Parameters
N_MFCC = 13
HOP_LENGTH = 512
N_FFT = 2048
WINDOW_TYPE = 'hann'

# Model Constraints & Metadata
MODEL_VERSION = "1.0.0-rf-classifier"
CONFIDENCE_THRESHOLD = 0.85
SUPPORTED_DISEASE_CLASSES = ["Healthy", "Mild", "Severe"]

# Network & Endpoint Limits
ALLOWED_ORIGINS = ["http://localhost:3000", "http://localhost:8000"]
RATE_LIMIT_PER_MINUTE = 60
