FROM node:14-alpine
WORKDIR /
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm install && npm run build && rm -R -f src && mkdir build/thumbnails
EXPOSE 8007
CMD [ "node", "build/index.js" ]
