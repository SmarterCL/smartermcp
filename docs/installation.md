# Installation Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Google OAuth credentials
- Supabase account (optional)

## Quick Install

```bash
npm install -g smartermcp
```

## Configuration

1. Create `.env` file:

```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

2. Initialize:

```bash
smartermcp init
```

3. Start server:

```bash
smartermcp start
```

## Verification

Visit: https://rut.smarterbot.store/login

Test authentication flow.

## Troubleshooting

See [troubleshooting.md](troubleshooting.md)
