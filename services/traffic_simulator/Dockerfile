FROM python:3.10-slim

WORKDIR /app
COPY app.py .
COPY road_network.py .

RUN mkdir /data

CMD ["python", "app.py"]
