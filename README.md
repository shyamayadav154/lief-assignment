This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

# Lief Assignment (Pomo To-Do App)
A web-based to-do list app that implements the Pomodoro Technique, along with an analytics dashboard to track task completion and productivity. 

Live Version: [Lief assignment](https://lief-assignment.vercel.app/)

## Tech Stack
- Front-end: [Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- Back-end: [Prisma](https://prisma.io), [tRPC](https://trpc.io), [Supabase(PostgreSQL)](https://supabase.com/)
- Authentication: [Auth0](https://auth0.com/)
- Analytics: [Chart.js, react-chartjs-2](https://www.chartjs.org/)
- Progressive Web App (PWA): [next-pwa](https://www.npmjs.com/package/next-pwa)

## Features attempted
All the features given in the [Lief assigment document](https://docs.google.com/document/d/1vR2RAVxJC5ZLB8H1sK_Zk_eNjCBCNG7yYnMatQMj6ZA/edit), including bonus features, are included

## Project Structure
```
├── public                 # Public assets and PWA neccesary files
├── prisma                 # Prisma database models and connection configuration files
├── src                    # Main source code directory
│   ├── /components        # React reusable components
│   ├── /features          # react components for a particular functionality based on folder name inside features folder
│   ├── pages              # Nextjs route/pages
│   │  ├─ api              # contains all the API routes of the application
│   │  │  └─ trpc          # tRPC API entrypoint, used to handle tRPC requests
│   │  │     └─ [trpc].ts
│   ├── /hooks              # React custom hooks
│   ├─ server               # Backend related files
│   │  ├─ db.ts             # Database setup using Primsa and Supabase
│   │  └─ api               # api setup files
│   │     ├─ routers        # folder to seprate api for diffrent features
│   │     │  └─ task.ts     # all the operation(CRUD) related to task 
│   │     ├─ trpc.ts        # tRPC initial setup
│   │     └─ root.ts        # combing routers to create a one api router to call all operation/functions
│   ├── styles              # folder to store css for global styling of the application
│   ├── utils               # utility and helper functions
│   └── lib                 # shadcn/ui utility function


```


## Running locally in development mode
1. Clone the project
   ```bash
     git clone https://github.com/shyamayadav154/lief-assignment.git
    ```
2. Copy env file from .ev.example to .env
   ```bash
   cp .env.exampl .env
   ```
3. Replace below shown env variables file with your Auth0 credentials, to genrate credential follow steps given in [Auth0 Nextjs ](https://auth0.com/docs/quickstart/webapp/nextjs/01-login)   
    ```
    AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
    AUTH0_BASE_URL='http://localhost:3000'
    AUTH0_ISSUER_BASE_URL='https://{yourDomain}'
    AUTH0_CLIENT_ID='{yourClientId}'
    AUTH0_CLIENT_SECRET='{yourClientSecret}'
    ```
4. Install dependencies
   ```bash
    npm install
    ```
5. Start devlopment server
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
