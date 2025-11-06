# Étape 1 : build avec Node.js
FROM node:20 AS build

WORKDIR /app

# Copier package.json et package-lock.json et installer les dépendances
COPY package*.json ./

RUN npm install --force

# Copier tout le projet et builder
COPY . .
RUN rm -f package-lock.json && npm install rollup --save-dev && npm run build
#RUN npm run build

# Étape 2 : servir le build avec Nginx
FROM nginx:alpine

# Copier le build React vers le répertoire de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposer le port 80 du container
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]
