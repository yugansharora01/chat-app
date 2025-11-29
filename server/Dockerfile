# Base image
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONBUFFERED=1 

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libopenblas-dev \
    liblapack-dev \
    gfortran \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip
RUN pip install -r /app/requirements.txt

COPY . /app

RUN mkdir -p /vol/static && mkdir -p /vol/media

COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD [ "gunicorn","docchat.wsgi:application","--bind","0.0.0.0:8000","--workers","3","--timeout","120"]