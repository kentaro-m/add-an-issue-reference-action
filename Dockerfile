FROM node:10-slim

LABEL "com.github.actions.name"="Add an issue reference"
LABEL "com.github.actions.description"="Adds an issue reference to a pull request."
LABEL "com.github.actions.icon"="link"
LABEL "com.github.actions.color"="gray-dark"

LABEL "repository"="https://github.com/kentaro-m/add-an-issue-reference-action"
LABEL "homepage"="https://github.com/kentaro-m/add-an-issue-reference-action"
LABEL "maintainer"="Kentaro Matsushita"

COPY package*.json ./
RUN npm ci
COPY . .

ENTRYPOINT ["node", "/entrypoint.js"]
