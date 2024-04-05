## Google scraper fullstack application

## Features

- **User Registration**: Allows users to sign up for an account.
- **Email Verification**: Verifies user accounts through email confirmation.
- **User Authentication**: Enables users to securely sign in to their accounts.
- **CSV Keyword Upload**: Permits users to upload CSV files containing up to 100 keywords per upload, with instant notification upon completion of scraping.
- **Google Search Result Display**: Shows search result details for each keyword, including the number of links, adwords, an overview of search information, and HTML page previews.
- **Keyword Search**: Allows users to search across their uploaded keywords for specific information

## Demo

> During my demonstration, I aimed to showcase different file upload scenarios, including invalid CSV files, uploads with empty keyword fields, and successful uploads. Unfortunately, due to limitations with the screen recording software, the file upload segment wasn't captured in the video.

![demo!](./demo/demo.mp4)

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
