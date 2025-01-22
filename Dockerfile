FROM node:18
WORKDIR /ploybout
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npx", "serve", "-s", "build"]
EXPOSE 3000
