FROM node:14

WORKDIR /app/backend

COPY backend/package.json .
COPY backend/package-lock.json .

RUN npm install -g nodemon
RUN npm install

COPY backend .

CMD ["npm", "run", "start"]