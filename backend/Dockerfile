# pull official base image
# FROM python:3.11-slim

# # set work directory
# WORKDIR /usr/src/backend

# # install system dependencies
# RUN apt-get update && apt-get install -y \
#     netcat-openbsd \
#     libpq-dev gcc && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# # set environment variables
# ENV PYTHONDONTWRITEBYTECODE 1
# ENV PYTHONUNBUFFERED 1

# # install dependencies
# RUN pip install --upgrade pip
# COPY ./requirements.txt .
# RUN pip install -r requirements.txt --no-cache-dir

# # copy entrypoint.sh
# COPY ./entrypoint.sh .
# RUN sed -i 's/\r$//g' /usr/src/backend/entrypoint.sh
# RUN chmod +x /usr/src/backend/entrypoint.sh

# # copy project
# COPY . .

# # run entrypoint.sh
# ENTRYPOINT ["/usr/src/backend/entrypoint.sh"]

# Use the official Python runtime image
FROM python:3.11-slim
 
# Create the app directory
RUN mkdir /app
 
# Set the working directory inside the container
WORKDIR /app
 
# Set environment variables 
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED=1 
 
# Upgrade pip
RUN pip install --upgrade pip 
  
# Copy the Django project  and install dependencies
COPY requirements.txt  /app/
 
# run this command to install all dependencies 
RUN pip install --no-cache-dir -r requirements.txt
 
# Copy the Django project to the container
COPY . /app/

# The following are used to make changes to default python packages to let Django use the partition attribute
COPY modified_libraries/middleware.py /usr/local/lib/python3.11/site-packages/django/contrib/sessions/
COPY modified_libraries/cookies.py /usr/local/lib/python3.11/http/
COPY modified_libraries/response.py /usr/local/lib/python3.11/site-packages/django/http/

# Expose the Django port
EXPOSE 8000
 
# Run Django’s development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
