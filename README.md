## Google scraper fullstack application

## Features

- User sign up
- User account verification (via email)
- User sign in
- Upload CSV per user up to 100 keywords per upload with instant notification upon scraping result
- Show the result of google search for each keyword (number of links, number of adwords, overview of search result info, and HTML page)
- Search across keywords per user

## Tech stacks

### High-level architecture

TBD

### Backend

- Framework: ExpressJS
- Language: TypeScript
- DB: PostgreSQL
- Auth: JSON web token
- Pub/sub: Redis
- Email service: [Elastic email](https://elasticemail.com/)
- Websocket server: Socket.IO

### Frontend

- Library: React
- Language: TypeScript
- Fronted tooling (generator): [Vite](https://vitejs.dev/)
- Frontend toolkit: Bootstrap
- Websocket client: Socket.IO

## Requirements

- Node >= 20.x
- NPM >= 9

## How to run

- [backend](./backend/README.md)
- [frontend](./frontend/README.md)

## Testing

- [backend](./backend/tests/)
- [frontend](./frontend/tests/)

## Deployment

> Because of time constraints, the deployment strategy employed was not optimal. As a result, both the frontend and backend were deployed using development mode, potentially leading to suboptimal performance.

This project is deployed at Heroku with the following addresses:

- frontend: [https://google-scraper-web-7922a635d04a.herokuapp.com](https://google-scraper-web-7922a635d04a.herokuapp.com)
- backend: [https://google-scraper-7cabe000fda7.herokuapp.com](https://google-scraper-7cabe000fda7.herokuapp.com)
