FROM node:alpine
RUN apk add ffmpeg

ENV DISCORD_TOKEN=""
ENV MONGO_URI=""
ENV TESTGUILDID=""
ENV DELETE_COMMANDS="" 

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

CMD [ "node", "." ]