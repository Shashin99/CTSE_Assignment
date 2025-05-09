FROM node:20-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .
RUN echo "mongodb+srv://CTSE:CTSE@ctse.kewjrct.mongodb.net/ctse?retryWrites=true&w=majority&appName=CTSE" > .env

# Environment variables (override with docker run -e)
ENV PORT=5004
# ENV MONGO_URI= mongodb+srv://CTSE:CTSE@ctse.kewjrct.mongodb.net/ctse?retryWrites=true&w=majority&appName=CTSE

# Expose port 5004 for the application
EXPOSE 5004

# Start the application
CMD [ "node", "server.js" ]