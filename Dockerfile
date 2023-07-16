FROM node:14

WORKDIR /app/backend

COPY backend/package.json .
COPY backend/package-lock.json .

RUN npm install -g nodemon --production
RUN npm install --production

COPY backend .

CMD ["npm", "run", "start"]