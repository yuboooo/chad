FROM python:3.11-slim

WORKDIR /app

# Install dependencies in a single RUN command with cleanup
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    portaudio19-dev \
    ffmpeg \
    libasound2 \
    libasound2-plugins \
    alsa-utils \
    libsndfile1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /var/cache/apt/*

# Create ALSA configuration
RUN echo 'pcm.!default { type null }' > /etc/asound.conf && \
    echo 'ctl.!default { type null }' >> /etc/asound.conf

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["gunicorn", "app:app"]