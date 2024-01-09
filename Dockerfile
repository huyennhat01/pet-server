FROM node:18-alpine

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3010

CMD [ "npm","run", "dev" ]

#docker build --tag node-docker .
# docker run -p 8080:8080 -d node-docker