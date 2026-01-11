# Plesk Node.js Deployment Guide

## Prerequisites
- Plesk server with Node.js extension installed
- Node.js 18.x or higher
- Domain configured in Plesk

## Step 1: Upload Files

Upload your project files to your Plesk hosting via:
- Git deployment (recommended)
- FTP/SFTP
- File Manager

## Step 2: Plesk Node.js Configuration

In Plesk panel:

1. Go to **Websites & Domains** → Your Domain → **Node.js**

2. Configure the following settings:

| Setting | Value |
|---------|-------|
| **Node.js Version** | 18.x or 20.x |
| **Document Root** | `/httpdocs` |
| **Application Mode** | `production` |
| **Application URL** | Your domain URL |
| **Application Root** | `/httpdocs` (or where you uploaded files) |
| **Application Startup File** | `node_modules/.bin/next` |
| **Custom environment variables** | See below |

## Step 3: Environment Variables

Add these environment variables in Plesk Node.js settings:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://fawadsarwar43_db_user:95sMYDefnsEn6hLP@nobot.eglgiyn.mongodb.net/magnetic-nobot?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-random-string-min-32-characters
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_WS_URL=https://your-domain.com
NEXT_PUBLIC_WIDGET_URL=https://your-domain.com/widget.js
ADMIN_EMAIL=admin@your-domain.com
ADMIN_PASSWORD=your-secure-admin-password
GEMINI_API_KEY=your-gemini-api-key
```

## Step 4: Build & Start

### Option A: SSH Access (Recommended)

```bash
# Connect to your server via SSH
ssh user@your-server.com

# Navigate to your project directory
cd /var/www/vhosts/your-domain.com/httpdocs

# Install dependencies
npm install

# Build the project
npm run build

# The app will auto-start via Plesk
```

### Option B: Plesk Interface

1. Click **NPM Install** in Plesk Node.js panel
2. After install, the startup command should be: `npm start`

## Step 5: Custom Startup Script

If needed, create a custom startup file `server.js` in your project root:

```javascript
const { execSync } = require('child_process');

// Set production environment
process.env.NODE_ENV = 'production';

// Start Next.js
require('child_process').spawn('npx', ['next', 'start', '-p', process.env.PORT || 3000], {
  stdio: 'inherit',
  shell: true
});
```

Then set **Application Startup File** to `server.js`

## Step 6: Seed Admin User

After deployment, run the seed script once:

```bash
# Via SSH
cd /var/www/vhosts/your-domain.com/httpdocs
npx ts-node --project tsconfig.server.json scripts/seed.ts
```

## Alternative: PM2 Process Manager

If Plesk Node.js extension has issues, use PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Build the app
npm run build

# Start with PM2
pm2 start npm --name "magnetic-nobot" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Nginx Configuration (if using custom proxy)

```nginx
location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## Troubleshooting

### App not starting
- Check Node.js version (must be 18+)
- Verify all environment variables are set
- Check Plesk error logs

### MongoDB connection issues
- Ensure your server IP is whitelisted in MongoDB Atlas
- Go to MongoDB Atlas → Network Access → Add your server IP

### Build errors
- Clear `.next` folder and rebuild
- Check for TypeScript errors

## Important Security Notes

1. **Change default admin password** immediately after first login
2. **Generate a secure JWT_SECRET** (min 32 characters, random)
3. **Use HTTPS** for production
4. **Whitelist server IP** in MongoDB Atlas Network Access
