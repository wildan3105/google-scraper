## How to run

### System requirement

1. Node >= 20.0.0
2. NPM >= 9.5.0
3. Postgres >= 12.0.0
4. Redis server >= 7.2.1

### Running locally

**Prerequisites**

1. Clone the project
2. Install dependencies: `npm i`
3. Copy the environment variable and adjust the value accordingly: `cp .env.example .env`
4. Create a postgre user and then database in which you have full access to that DB. And then specify the credentials in the `.env` file as `DATABASE_URL`

```bash
DATABASE_URL='postgres://user:password@host:port/database'
```

#### Using TypeScript (simulate development)

1. Run the server `npm run server:dev`
2. Run the worker (to subscribe to redis event) `npm run worker:dev`

#### Using JavaScript (simulate production)

1. Build to JS files: `npm run build`
2. Run the server using JS file: `node builds/src/server.js`
3. Run the worker using JS file: `node builds/src/events/subscriber/keyword-event.js`
