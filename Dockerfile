# Node.js 构建阶段
FROM node:24-slim AS node-builder
LABEL authors="Chen"

WORKDIR /app

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY ./ ./
RUN pnpm run build

# 生产依赖安装（包含 TypeScript，Next.js 需要它来解析 next.config.ts）
# 注意：版本号需要与 pnpm-lock.yaml 中的版本保持一致（当前为 5.9.3）
RUN rm -rf node_modules && \
    pnpm install --frozen-lockfile --prod && \
    pnpm install typescript@5.9.3

# 运行阶段
FROM node:24-slim
LABEL authors="Chen"

EXPOSE 3000

WORKDIR /app

RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && npm install -g pnpm

COPY --from=node-builder /app/.next ./.next
COPY --from=node-builder /app/package.json ./package.json
COPY --from=node-builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=node-builder /app/node_modules ./node_modules
COPY --from=node-builder /app/next.config.ts ./next.config.ts

CMD ["pnpm", "run", "start"]
