FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api
ARG API_URL=http://api:8000/api
ARG TELEGRAM_BOT_NOTIFY_URL=http://telegram_bot:8765/notify-purchase
ARG TELEGRAM_NOTIFY_SECRET=

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV API_URL=$API_URL
ENV TELEGRAM_BOT_NOTIFY_URL=$TELEGRAM_BOT_NOTIFY_URL
ENV TELEGRAM_NOTIFY_SECRET=$TELEGRAM_NOTIFY_SECRET

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start", "--", "-p", "3000"]
