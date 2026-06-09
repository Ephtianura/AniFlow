# =========================
# BASE
# =========================
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY . .

# =========================
# DEV 
# =========================
FROM base AS dev
ENV NODE_ENV=development
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "dev"]

# =========================
# PROD BUILD 
# =========================
FROM base AS build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_HUB_URL  
ARG NEXT_PUBLIC_CDN_URL
ARG DISABLE_CHECKS

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_HUB_URL=$NEXT_PUBLIC_HUB_URL
ENV NEXT_PUBLIC_CDN_URL=$NEXT_PUBLIC_CDN_URL
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV NEXT_TELEMETRY_DISABLED=1

RUN --mount=type=cache,target=/app/.next/cache \
    if [ "$DISABLE_CHECKS" = "true" ]; then \
      echo "🚀 Вырубаем линтер и TS..."; \
      NEXT_DISABLE_ESLINT=1 NEXT_DISABLE_TYPESCRIPT=1 npm run build; \
    else \
      echo "🛡️ Честный билд со всеми проверками..."; \
      npm run build; \
    fi

# =========================
# PROD RUN 
# =========================
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm install --omit=dev

EXPOSE 3000
CMD ["npm", "start"]