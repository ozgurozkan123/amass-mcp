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

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
