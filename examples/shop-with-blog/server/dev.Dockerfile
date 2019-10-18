# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
# NOTE: this file is intented only for development purposes, do not use it for production build #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

FROM node:alpine
# git is not obligatory by default but if you link dependencies in package.json via git protocol 
# then it must be installed
RUN apk update && apk add git

WORKDIR /usr/src/app/server

# copying of yarn.lock is optional - it might not exist
COPY package.json yarn.loc[k] ./

RUN yarn install

CMD ["yarn", "start"]