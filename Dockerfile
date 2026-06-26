FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
COPY public ./public
COPY src ./src
COPY next.config.mjs ./
COPY postcss.config.mjs ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./
RUN npm install --legacy-peer-deps
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/next.config.mjs ./
EXPOSE 3000
CMD ["npm", "start"]
