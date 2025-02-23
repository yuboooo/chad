FROM python:3.11-slim

WORKDIR /app

# Install pip first
RUN apt-get update && apt-get install -y python3-pip

# Copy requirements from the backend directory
COPY backend/requirements.txt .
RUN pip3 install -r requirements.txt

# Copy the backend directory contents
COPY backend/ .

EXPOSE 5001

CMD ["gunicorn", "app:app"]