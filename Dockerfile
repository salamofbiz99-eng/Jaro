FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 10000

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "10000"]
