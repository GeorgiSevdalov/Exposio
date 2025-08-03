# Exposio - Gallery & Marketplace App

## Environment Setup

1. Copy the environment template files:
   ```bash
   cp src/environments/environment.template.ts src/environments/environment.ts
   cp src/environments/environment.prod.template.ts src/environments/environment.prod.ts
   ```

2. Fill in your Supabase credentials in both files:
   - Get your credentials from [Supabase Dashboard](https://app.supabase.com) → Project Settings → API
   - Replace `YOUR_SUPABASE_PROJECT_URL_HERE` with your Project URL
   - Replace `YOUR_SUPABASE_ANON_KEY_HERE` with your anon/public API key

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   ng serve
   ```

## Project Structure
```
src/app/
├── auth/ (login, register, profile)
├── core/
│   └── guards/ (auth guard)
│   └── services/
├── features/
│   └── expositions/
│   └── sale-ads/
├── models/ (all interfaces)
├── shared/
│   ├── components/ (navbar, footer, etc.)
└── dashboard/ (user's personal area)
```

**⚠️ Never commit environment.ts or environment.prod.ts files to git!**