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
