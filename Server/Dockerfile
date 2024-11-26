FROM node:18.0.0


WORKDIR /backend

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3010

CMD [ "node", "app.js" ]