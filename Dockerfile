FROM node:18-alpine

WORKDIR /app

# Copy the package.json and package-lock.json first to install dependencies
COPY package*.json ./
RUN npm install

# Now copy all the remaining project files
COPY . .

EXPOSE 3000

# Start the Next.js application in development mode
CMD ["npm", "run", "dev"]
