FROM node:22-bookworm-slim
WORKDIR /app

# Install system deps (git for npm, ca-certificates)
RUN apt-get update && apt-get install -y git ca-certificates && rm -rf /var/lib/apt/lists/*

# Install node dependencies
COPY package.json package-lock.json* ./
RUN npm install --production=false

# Copy source
COPY . .

# Build Next.js app
RUN npm run build

# Render injects PORT env var - Next.js will use it via -p $PORT
ENV HOST=0.0.0.0

# Let Render inject the PORT, start with that port
CMD ["sh", "-c", "npm start -- -H 0.0.0.0 -p ${PORT:-10000}"]
