# Production Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Configuration

```bash
# Generate strong secrets
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Update .env for Production

```env
PORT=4000
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/VerifyUp?retryWrites=true&w=majority
JWT_SECRET=<generated-secret-1>
JWT_REFRESH_SECRET=<generated-secret-2>
FRONTEND_URL=https://yourdomain.com
```

### 3. Security Checklist

- [ ] Strong JWT secrets (32+ characters)
- [ ] MongoDB authentication enabled
- [ ] HTTPS configured
- [ ] FRONTEND_URL set to actual domain
- [ ] NODE_ENV=production
- [ ] Firewall configured
- [ ] Rate limits appropriate for production

## Deployment Options

## Option 1: VPS/Cloud Server (DigitalOcean, AWS EC2, etc.)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (or use MongoDB Atlas)
# See: https://docs.mongodb.com/manual/installation/

# Install PM2
sudo npm install -g pm2

# Install nginx
sudo apt install -y nginx
```

### Step 2: Clone and Setup

```bash
# Clone repository
git clone <your-repo-url>
cd backend

# Install dependencies
npm install --production

# Create .env file
nano .env
# Paste production environment variables

# Test the application
npm start
# Ctrl+C to stop
```

### Step 3: PM2 Setup

```bash
# Start with PM2
pm2 start src/server.js --name verifyup-api

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions shown

# Monitor
pm2 monit

# View logs
pm2 logs verifyup-api
```

### Step 4: Nginx Reverse Proxy

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/verifyup-api
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/verifyup-api /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### Step 5: SSL with Let's Encrypt

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

### Step 6: Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## Option 2: Heroku

### Step 1: Prepare Application

```bash
# Create Procfile
echo "web: node src/server.js" > Procfile

# Ensure package.json has start script
# "start": "node src/server.js"
```

### Step 2: Deploy

```bash
# Login to Heroku
heroku login

# Create app
heroku create verifyup-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<your-secret>
heroku config:set JWT_REFRESH_SECRET=<your-secret>
heroku config:set FRONTEND_URL=https://yourdomain.com

# Add MongoDB (using MongoDB Atlas)
heroku config:set MONGO_URI=<your-mongodb-atlas-uri>

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

## Option 3: Docker

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 4000

CMD ["node", "src/server.js"]
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  api:
    build: .
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - PORT=4000
      - MONGO_URI=mongodb://mongo:27017/VerifyUp
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - FRONTEND_URL=${FRONTEND_URL}
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped

volumes:
  mongo-data:
```

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop
docker-compose down
```

## Option 4: Railway

### Step 1: Prepare

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login
```

### Step 2: Deploy

```bash
# Initialize project
railway init

# Add MongoDB plugin
railway add mongodb

# Set environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=<your-secret>
railway variables set JWT_REFRESH_SECRET=<your-secret>
railway variables set FRONTEND_URL=https://yourdomain.com

# Deploy
railway up

# View logs
railway logs
```

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for all IPs)
5. Get connection string
6. Update MONGO_URI in .env

### Option 2: Self-Hosted MongoDB

```bash
# Install MongoDB
sudo apt install -y mongodb

# Enable authentication
sudo nano /etc/mongodb.conf
# Set: security.authorization: enabled

# Create admin user
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "strong-password",
  roles: ["root"]
})

# Create app user
use VerifyUp
db.createUser({
  user: "verifyup",
  pwd: "strong-password",
  roles: ["readWrite"]
})

# Update MONGO_URI
MONGO_URI=mongodb://verifyup:strong-password@localhost:27017/VerifyUp
```

## Monitoring & Logging

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs verifyup-api

# Flush logs
pm2 flush

# Setup log rotation
pm2 install pm2-logrotate
```

### Application Monitoring Services

- **New Relic**: https://newrelic.com/
- **Datadog**: https://www.datadoghq.com/
- **Sentry** (for errors): https://sentry.io/

### Setup Sentry (Error Tracking)

```bash
npm install @sentry/node
```

```javascript
// In src/app.js (before routes)
const Sentry = require("@sentry/node");

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: "production",
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
}
```

## Backup Strategy

### MongoDB Backups

```bash
# Manual backup
mongodump --uri="mongodb://user:pass@host:27017/VerifyUp" --out=/backup/$(date +%Y%m%d)

# Automated daily backup (cron)
0 2 * * * mongodump --uri="mongodb://user:pass@host:27017/VerifyUp" --out=/backup/$(date +\%Y\%m\%d)

# Restore
mongorestore --uri="mongodb://user:pass@host:27017/VerifyUp" /backup/20240101
```

### MongoDB Atlas Backups

- Automatic backups enabled by default
- Point-in-time recovery available
- Configure in Atlas dashboard

## Performance Optimization

### 1. Enable Compression

```javascript
// In src/app.js
const compression = require("compression");
app.use(compression());
```

### 2. Database Indexes

Already implemented in models:

- User: email, phone
- Order: userId, status, service
- Document: orderId, userId, status

### 3. Caching (Optional)

```bash
npm install redis
```

```javascript
// Cache frequently accessed data
const redis = require("redis");
const client = redis.createClient();
```

### 4. CDN for Static Assets

- Use Cloudflare or AWS CloudFront
- Serve static files from CDN

## Health Checks

### Endpoint

```javascript
// Already implemented at GET /
{
  "success": true,
  "message": "VerifyUp API is running",
  "data": {
    "version": "1.0.0",
    "status": "healthy"
  }
}
```

### Uptime Monitoring

- **UptimeRobot**: https://uptimerobot.com/
- **Pingdom**: https://www.pingdom.com/
- **StatusCake**: https://www.statuscake.com/

## Scaling

### Horizontal Scaling

```bash
# PM2 cluster mode
pm2 start src/server.js -i max --name verifyup-api

# Or specify number of instances
pm2 start src/server.js -i 4 --name verifyup-api
```

### Load Balancer (nginx)

```nginx
upstream backend {
    least_conn;
    server localhost:4000;
    server localhost:4001;
    server localhost:4002;
    server localhost:4003;
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

## Troubleshooting

### Check Logs

```bash
# PM2 logs
pm2 logs verifyup-api

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System logs
sudo journalctl -u nginx -f
```

### Common Issues

#### 1. CORS Errors

- Verify FRONTEND_URL matches exactly
- Check nginx proxy headers
- Ensure credentials: true in CORS config

#### 2. 502 Bad Gateway

- Check if app is running: `pm2 status`
- Check app logs: `pm2 logs`
- Verify port 4000 is accessible

#### 3. MongoDB Connection Failed

- Check MongoDB is running
- Verify connection string
- Check firewall rules
- Verify database user permissions

#### 4. Cookies Not Working

- Ensure HTTPS in production
- Check secure: true in cookie settings
- Verify domain matches

## Rollback Strategy

### PM2 Rollback

```bash
# Save current version
pm2 save

# If issues occur, restore previous version
git checkout <previous-commit>
npm install
pm2 restart verifyup-api
```

### Database Rollback

```bash
# Restore from backup
mongorestore --uri="mongodb://..." /backup/20240101
```

## Security Hardening

### 1. Fail2Ban (Prevent Brute Force)

```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

### 2. Regular Updates

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Update Node.js packages
npm audit
npm audit fix
```

### 3. Security Headers

Already implemented via Helmet

### 4. Rate Limiting

Already implemented (5 req/15min on auth)

## Post-Deployment

### 1. Test All Endpoints

```bash
# Health check
curl https://api.yourdomain.com/

# Register
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Get orders
curl https://api.yourdomain.com/api/orders/me -b cookies.txt
```

### 2. Monitor Performance

- Check response times
- Monitor error rates
- Watch resource usage (CPU, memory)

### 3. Setup Alerts

- Uptime monitoring alerts
- Error tracking alerts
- Resource usage alerts

## Maintenance

### Weekly

- [ ] Review logs for errors
- [ ] Check disk space
- [ ] Monitor performance metrics

### Monthly

- [ ] Update dependencies (`npm update`)
- [ ] Review security advisories (`npm audit`)
- [ ] Check backup integrity
- [ ] Review rate limit effectiveness

### Quarterly

- [ ] Rotate JWT secrets
- [ ] Security audit
- [ ] Performance optimization review
- [ ] Database optimization

---

**Your VerifyUp API is now production-ready! 🚀**
