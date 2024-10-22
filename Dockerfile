FROM node:16.5.0-alpine

WORKDIR /


COPY . .

RUN npm install && npm run build && rm -R -f src && mkdir build/thumbnails

EXPOSE 8000

CMD [ "node", "build/index.js" ]
