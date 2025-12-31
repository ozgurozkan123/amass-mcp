FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application
COPY server.py .

# Set environment variables
ENV HOST=0.0.0.0
EXPOSE 8000

# Run the FastMCP server
CMD ["python", "server.py"]
