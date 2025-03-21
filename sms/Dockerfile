# Step 1: Build the application using Node.js
FROM node:18 AS build

WORKDIR /app

# Set the NODE_OPTIONS environment variable to use the legacy OpenSSL provider
ENV NODE_OPTIONS=--openssl-legacy-provider

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Set up a minimal web server to serve the build files
FROM nginx:alpine

# Copy the build files from the build stage to Nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy a custom Nginx configuration to handle client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
