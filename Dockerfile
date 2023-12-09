# Use an official Node.js runtime as the base image
FROM node:18.17.1

# Set the working directory in the container
WORKDIR /usr/src/app

RUN apt-get install -y gpg apt-transport-https gpg-agent curl ca-certificates

ENV DATADOG_APT_KEYRING="/usr/share/keyrings/datadog-archive-keyring.gpg"
ENV DATADOG_APT_KEYS_URL="https://keys.datadoghq.com"
RUN sh -c "echo 'deb [signed-by=${DATADOG_APT_KEYRING}] https://apt.datadoghq.com/ stable 7' > /etc/apt/sources.list.d/datadog.list"
RUN touch ${DATADOG_APT_KEYRING}
RUN curl -o /tmp/DATADOG_APT_KEY_CURRENT.public "${DATADOG_APT_KEYS_URL}/DATADOG_APT_KEY_CURRENT.public" && \
    gpg --ignore-time-conflict --no-default-keyring --keyring ${DATADOG_APT_KEYRING} --import /tmp/DATADOG_APT_KEY_CURRENT.public
RUN curl -o /tmp/DATADOG_APT_KEY_F14F620E.public "${DATADOG_APT_KEYS_URL}/DATADOG_APT_KEY_F14F620E.public" && \
    gpg --ignore-time-conflict --no-default-keyring --keyring ${DATADOG_APT_KEYRING} --import /tmp/DATADOG_APT_KEY_F14F620E.public
RUN curl -o /tmp/DATADOG_APT_KEY_382E94DE.public "${DATADOG_APT_KEYS_URL}/DATADOG_APT_KEY_382E94DE.public" && \
    gpg --ignore-time-conflict --no-default-keyring --keyring ${DATADOG_APT_KEYRING} --import /tmp/DATADOG_APT_KEY_382E94DE.public
# Install the Datadog agent
RUN apt-get update && apt-get -y --force-yes install --reinstall datadog-agent

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# generated prisma files
COPY prisma ./prisma/

#COPY env.example ./.env
COPY .env ./

# Install project dependencies
RUN npm install

RUN npx prisma generate

RUN command

# Copy the rest of the application code to the container
COPY . .

# Expose the port your app runs on
EXPOSE 3000
EXPOSE 8125/udp 8126/tcp
ENV DD_APM_ENABLED=true
COPY datadog-config/ /etc/datadog-agent/

# Command to run your app when the container starts
CMD ["sh", "-c", "bash; datadog-agent run & /opt/datadog-agent/embedded/bin/trace-agent --config=/etc/datadog-agent/datadog.yaml > /dev/null & /opt/datadog-agent/embedded/bin/process-agent --config=/etc/datadog-agent/datadog.yaml > /dev/null & npm start"]
