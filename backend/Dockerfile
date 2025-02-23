FROM python:3.11-slim

# Set working directory
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

# Copy the entire backend directory
COPY . .

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Railway will provide the PORT environment variable
ENV PORT=5001

# We'll let railway.toml handle the start command