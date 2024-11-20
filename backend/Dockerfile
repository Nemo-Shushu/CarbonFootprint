# pull official base image
FROM python:3.11-slim

# set work directory
WORKDIR /usr/src/backend

# install system dependencies
RUN apt-get update && apt-get install -y \
    netcat-openbsd \
    libpq-dev gcc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt --no-cache-dir

# copy entrypoint.sh
# COPY ./entrypoint.sh .
# RUN sed -i 's/\r$//g' /usr/src/backend/entrypoint.sh
# RUN chmod +x /usr/src/backend/entrypoint.sh

# copy project
COPY . .

# run entrypoint.sh
# ENTRYPOINT ["/usr/src/backend/entrypoint.sh"]
