FROM node:10.7.0
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . /home/node/app
COPY nginx.conf /etc/nginx/nginx.conf
COPY default.conf /etc/nginx/conf.d/app.conf
COPY --chown=node:node . .
USER node
EXPOSE 8080
CMD [ "npm", "run", "dev" ]