FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build

FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install LibreOffice and fonts in the production runner container
RUN apk add --no-cache \
    libreoffice-writer \
    fontconfig \
    ttf-liberation \
    ttf-dejavu

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/file.docx ./file.docx

EXPOSE 3000

CMD ["node", "server.js"]
