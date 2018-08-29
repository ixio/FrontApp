# FrontApp

Front-end Application sourcing data from FeatureService. It is a React application meant to manage datasets, launch annotation campaigns and annotate dataset files.

## Installation

```sh
npm install
```

### Create a config env file:

```sh
echo "REACT_APP_API_URL=http://localhost:7231/data.ode.org/v1" > .env.development.local
```

### Setting up development environment:

You should have FeatureService set up, typically run the following commands in FeatureService folder:

```sh
docker rm -f testdb; docker run --name testdb -e POSTGRES_USER=test -p 127.0.0.1:5433:5432 -d mdillon/postgis
NODE_ENV=test knex migrate:latest; NODE_ENV=test knex seed:run
NODE_ENV=test npm start
```

## Useful commands:

```sh
npm start
npm test
```
