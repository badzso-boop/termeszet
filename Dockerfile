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
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 termeszet

COPY --from=backend-deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY --from=frontend-builder /app/frontend/build ./public

RUN mkdir -p uploads && chown -R termeszet:nodejs /app

USER termeszet
EXPOSE 5000
ENV PORT=5000

CMD ["node", "src/app.js"]
