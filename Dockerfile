FROM node:22-alpine
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production=false

# Copy source
COPY . .

# Build Next.js app
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

# Start Next.js server
CMD ["npm", "start", "--", "-H", "0.0.0.0", "-p", "3000"]
