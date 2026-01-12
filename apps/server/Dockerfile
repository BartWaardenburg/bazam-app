FROM oven/bun:1.3-alpine

WORKDIR /app

COPY libs/ ./libs/
COPY tsconfig.base.json ./
COPY apps/server/package.json apps/server/bun.lock* ./apps/server/

RUN cd apps/server && bun install --production

COPY apps/server/ ./apps/server/

EXPOSE 3001
CMD ["bun", "run", "apps/server/src/index.ts"]
