FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
ARG REACT_APP_API_BASE_URL=""
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
RUN npm run build

FROM node:20-alpine AS backend-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache python3 py3-pillow
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 termeszet

COPY --chown=termeszet:nodejs --from=backend-deps /app/node_modules ./node_modules
COPY --chown=termeszet:nodejs package.json ./
COPY --chown=termeszet:nodejs src ./src
COPY --chown=termeszet:nodejs scripts ./scripts
COPY --chown=termeszet:nodejs --from=frontend-builder /app/frontend/build ./public
# Közös útvonaltábla + SEO-szövegek: a src/seo.js ebből injektálja a head-tageket
COPY --chown=termeszet:nodejs --from=frontend-builder /app/frontend/src/i18n ./i18n

RUN mkdir -p uploads/gallery && chown -R termeszet:nodejs uploads

USER termeszet
EXPOSE 5000
ENV PORT=5000

CMD ["node", "src/app.js"]
