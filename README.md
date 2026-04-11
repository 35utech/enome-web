# Enome Web Platform

This is the web application for the Enome platform, built using Next.js 15, Drizzle ORM, and Tailwind CSS v4.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Recommended: Latest LTS)
- [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/), or [pnpm](https://pnpm.io/)
- A MySQL database instance

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd enome-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Fill in the required values in `.env`, especially `DATABASE_URL`.

## Development

To run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `.next` folder with the compiled application.

## Running in Production

After building, you can start the production server:

```bash
npm run start
```

## Environment Variables Reference

| Key | Description |
|-----|-------------|
| `NEXT_PUBLIC_URL` | Base URL of the application |
| `DATABASE_URL` | MySQL connection string |
| `JWT_SECRET` | Secret key for JWT authentication |
| `SMTP_*` | SMTP configuration for email notifications |
| `CRON_SECRET` | Secret key for securing cron job endpoints |
