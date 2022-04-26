FROM node:alpine
RUN apk add ffmpeg

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

CMD [ "node", "." ]