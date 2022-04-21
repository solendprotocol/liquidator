FROM node:16-alpine3.11


# Create Directory for the Container
RUN mkdir -p /home/solend/app
WORKDIR /home/solend/app

# Increase heap size
ENV NODE_OPTIONS=--max_old_space_size=4096

# Only copy the package.json file to work directory
COPY package.json package-lock.json ./
# Install all Packages
RUN npm install

# Copy all other source code to work directory
COPY src /home/solend/app/src
COPY tsconfig.json /home/solend/app
RUN npm run build

# Start
CMD ["npm", "start"]
