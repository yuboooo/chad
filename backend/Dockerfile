FROM python:3.11-slim

WORKDIR /chad/backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    portaudio19-dev \
    ffmpeg \
    libasound2 \
    libasound2-plugins \
    alsa-utils \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Create ALSA configuration
RUN mkdir -p /etc/alsa && \
    echo 'pcm.!default { type null }' > /etc/asound.conf && \
    echo 'ctl.!default { type null }' >> /etc/asound.conf

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Railway will provide the PORT environment variable, but we'll default to 5001
ENV PORT=5001

CMD gunicorn --bind 0.0.0.0:$PORT app:app