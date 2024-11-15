# Multiple Deployment Environments with Docker

This guide demonstrates how to run a Dockerized Next.js application and deploy it in multiple environments using different environment variables.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Running the Development Environment](#running-the-development-environment)
- [Running the Production Environment](#running-the-production-environment)
- [Conclusion](#conclusion)

## Prerequisites

Before getting started, ensure you have the following installed:
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

Make sure your `.env.development` and `.env.production` files are properly configured with the required environment variables.


## Running the Development Environment

To start the development environment, navigate to the root directory of your project and run:

```bash
docker compose up --watch
```

The `.env.development` file is automatically to be used for it.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.


## Running the Production Environment

To start the production server, run the following command in the root directory:

```
docker compose -f docker/production/docker-compose.yml up -d
```
The `.env.production` file is automatically to be used for it.

### Rebuilding the Production Image

If you make changes to the production image, rebuild it using:

```
docker compose -f docker/production/docker-compose.yml up -d --build
```

## Conclusion

This setup allows you to manage different deployment environments effortlessly using Docker, enabling smooth development and production workflows.