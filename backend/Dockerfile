FROM python:3.11-slim

WORKDIR /app

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

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]