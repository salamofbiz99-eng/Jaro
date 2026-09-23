FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production
ENV RENDER=true
ENV PORT=10000

COPY package*.json ./
RUN npm ci

COPY . .

RUN mkdir -p /app/data

RUN npm run build

EXPOSE 10000

CMD ["npx", "vinext", "start", "-H", "0.0.0.0"]
