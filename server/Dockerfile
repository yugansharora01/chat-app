# Base image
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONBUFFERED=1 

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \    
    git \
    build-essential \
    libopenblas-dev \
    liblapack-dev \
    gfortran \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel \
 && pip install --no-cache-dir --disable-pip-version-check -r /app/requirements.txt

COPY . /app

RUN mkdir -p /vol/static && mkdir -p /vol/media

COPY ./entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

ENTRYPOINT [ "/app/entrypoint.sh" ]
CMD [ "gunicorn","docchat.wsgi:application","--bind","0.0.0.0:8000","--workers","3","--timeout","120"]