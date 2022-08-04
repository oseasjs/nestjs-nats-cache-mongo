# NestJS x NATS Server x Cache Manager x Mongo DB

This project was bootstrapped with:
- [Node](https://nodejs.org/en/docs/);
- [NestJS](https://docs.nestjs.com/);
- [Swagger](https://swagger.io/);
- [Nats Server](https://docs.nats.io/nats-concepts/overview);
- [Cache Manager](https://github.com/v4l3r10/node-cache-manager-mongodb);
- [MongoDB](https://docs.mongodb.com/manual/);
- [Docker](https://docs.docker.com/);
- [Docker-Compose](https://docs.docker.com/compose/);

## Project Goal

_TODO_

## Infra

This project require some services that should be running before services start: `mongo`, `mongo-express` and `nats-server`
A docker-compose file is available on ./docker-compose to install those services;
To install them, on project root folder and run: 
`docker-compose up -d`

## Running

This project use NodeJS and NestJS and is splited in 2 different projects: _producer_  and _consumer_. 
To install all package dependence, just go to related directory and run: 
`npm install`

* Swagger Page: 
[localhost:5001](http://localhost:5001/openApi)


## Inspiration

_TODO_