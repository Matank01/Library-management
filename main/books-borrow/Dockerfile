# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app

# Install necessary dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Make port 5004 available to the world outside this container
EXPOSE 5004

# Define the command to run the application
CMD ["python", "app.py"]
