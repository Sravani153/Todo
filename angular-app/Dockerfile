# Stage 1: Build the Angular application
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies
RUN npm install --omit=dev --legacy-peer-deps && \
npm install --save-dev @angular/cli

# Copy the rest of the application code to the container
COPY . .

# Build the Angular application
RUN npm run build -- --configuration=production

# Stage 2: Serve the application using Nginx unprivileged
FROM docker.io/nginxinc/nginx-unprivileged:1.17

# Copy the custom Nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the previous stage to Nginx's HTML folder
COPY --from=build /app/dist/angular-app /usr/share/nginx/html

# Expose port 8080 instead of 80, as this is common for unprivileged images
EXPOSE 8080

# Start Nginx explicitly with bash
CMD ["nginx", "-g", "daemon off;"]
