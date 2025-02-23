FROM python:3.11-slim

WORKDIR /app

# Install pip first
RUN apt-get update && apt-get install -y python3-pip

COPY requirements.txt .
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["gunicorn", "app:app"]