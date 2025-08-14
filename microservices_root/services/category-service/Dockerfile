FROM node:20-alpine

WORKDIR /app

# Copy shared dependencies first  
COPY ../../shared /app/shared
WORKDIR /app/shared
RUN npm install

WORKDIR /app

# Copy service files
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4004

CMD ["npm", "start"]
