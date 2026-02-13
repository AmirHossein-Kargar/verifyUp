# SMS Integration - Command Reference

Quick reference for all SMS-related commands and scripts.

## 📦 NPM Scripts

### Test SMS Service

```bash
npm run test:sms
```

Tests SMS configuration and sends a test message.

**Options:**

```bash
# Test with specific phone number
npm run test:sms 09123456789
```

### Run Examples

```bash
npm run examples:sms [number]
```

**Available Examples:**

```bash
npm run examples:sms 1    # Simple verification code
npm run examples:sms 2    # Order confirmation
npm run examples:sms 3    # Password reset
npm run examples:sms 4    # Welcome message
npm run examples:sms 5    # Batch send
npm run examples:sms 6    # Direct service usage
npm run examples:sms 7    # With retry logic
npm run examples:sms 8    # Check service status
```

### Development Server

```bash
npm run dev
```

Starts the backend server with nodemon (auto-reload).

### Production Server

```bash
npm start
```

Starts the backend server in production mode.

## 🔧 Direct Node Commands

### Test Phone Formatting

```bash
node -e "const {formatMobileNumber} = require('./src/utils/sms.helper'); console.log(formatMobileNumber('09123456789'));"
```

### Generate Verification Code

```bash
node -e "const {generateVerificationCode} = require('./src/utils/sms.helper'); console.log(generateVerificationCode(6));"
```

### Check Service Status

```bash
node -e "const sms = require('./src/services/sms.service'); console.log('Configured:', sms.isConfigured(), 'Env:', sms.getEnvironment());"
```

### Send Test SMS

```bash
node -e "require('dotenv').config(); const {sendVerificationCode} = require('./src/utils/sms.helper'); sendVerificationCode('09123456789', '123456', 123456).then(console.log).catch(console.error);"
```

## 🧪 Testing Commands

### Quick Test

```bash
# Test configuration
npm run test:sms

# Test with your phone
npm run test:sms 09123456789
```

### Run All Examples

```bash
# Run examples 1-8
for i in {1..8}; do npm run examples:sms $i; done
```

### Test Specific Example

```bash
# Test simple verification
npm run examples:sms 1

# Test batch send
npm run examples:sms 5

# Test status check
npm run examples:sms 8
```

## 📝 Configuration Commands

### View Current Configuration

```bash
# Show SMS environment variables
cat .env | grep SMS
```

### Set Configuration

```bash
# Set API key
echo "SMS_API_KEY=your_key_here" >> .env

# Set environment
echo "SMS_ENVIRONMENT=sandbox" >> .env

# Set template ID
echo "SMS_TEMPLATE_ID=123456" >> .env
```

### Validate Configuration

```bash
# Check if all SMS variables are set
node -e "require('dotenv').config(); console.log('API Key:', !!process.env.SMS_API_KEY, 'Environment:', process.env.SMS_ENVIRONMENT, 'Template:', process.env.SMS_TEMPLATE_ID);"
```

## 🔍 Debugging Commands

### Enable Debug Logging

```bash
# Set debug mode
DEBUG=sms:* npm run dev
```

### Check SMS Service

```bash
# Detailed service check
node -e "require('dotenv').config(); const sms = require('./src/services/sms.service'); console.log('Service Status:', {configured: sms.isConfigured(), environment: sms.getEnvironment(), sandbox: sms.isSandbox()});"
```

### Test API Connection

```bash
# Test connection to sms.ir API
curl -I https://api.sms.ir/v1/send/verify
```

### View Logs

```bash
# Watch logs in real-time
npm run dev | grep SMS
```

## 📊 Monitoring Commands

### Check Recent SMS Logs

```bash
# Filter SMS-related logs
cat logs/app.log | grep SMS
```

### Count SMS Sent

```bash
# Count successful SMS
cat logs/app.log | grep "SMS sent successfully" | wc -l
```

### Check Errors

```bash
# Show SMS errors
cat logs/app.log | grep "SMS Service Error"
```

## 🔄 Environment Switching

### Switch to Sandbox

```bash
# Update .env
sed -i 's/SMS_ENVIRONMENT=production/SMS_ENVIRONMENT=sandbox/' .env

# Restart server
npm run dev
```

### Switch to Production

```bash
# Update .env
sed -i 's/SMS_ENVIRONMENT=sandbox/SMS_ENVIRONMENT=production/' .env

# Restart server
npm start
```

## 🛠️ Maintenance Commands

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update packages
npm update
```

### Security Audit

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Clean Install

```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

## 📦 Deployment Commands

### Build for Production

```bash
# No build step needed for Node.js
# Just ensure environment is set
NODE_ENV=production npm start
```

### PM2 Commands

```bash
# Start with PM2
pm2 start src/server.js --name verifyup-api

# Restart
pm2 restart verifyup-api

# Stop
pm2 stop verifyup-api

# View logs
pm2 logs verifyup-api

# Monitor
pm2 monit
```

### Docker Commands

```bash
# Build image
docker build -t verifyup-backend .

# Run container
docker run -p 4000:4000 --env-file .env verifyup-backend

# View logs
docker logs verifyup-backend
```

## 🔐 Security Commands

### Generate Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate multiple secrets
for i in {1..3}; do node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"; done
```

### Check Environment Security

```bash
# Ensure .env is not tracked
git check-ignore .env

# Check for exposed secrets
git log --all --full-history --source -- .env
```

## 📚 Documentation Commands

### View Documentation

```bash
# View in terminal
cat SMS_INTEGRATION.md

# View in browser (if markdown viewer installed)
mdless SMS_INTEGRATION.md
```

### Search Documentation

```bash
# Search for specific topic
grep -r "verification code" *.md

# Search in all SMS docs
grep -r "sandbox" SMS_*.md
```

## 🎯 Quick Workflows

### First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Edit .env (add your SMS_API_KEY)
nano .env

# 4. Test SMS
npm run test:sms

# 5. Start development
npm run dev
```

### Daily Development

```bash
# Start server
npm run dev

# In another terminal, test SMS
npm run test:sms

# Run examples as needed
npm run examples:sms 1
```

### Before Deployment

```bash
# 1. Test everything
npm run test:sms

# 2. Run all examples
for i in {1..8}; do npm run examples:sms $i; done

# 3. Check configuration
cat .env | grep SMS

# 4. Security audit
npm audit

# 5. Deploy
npm start
```

### Troubleshooting Workflow

```bash
# 1. Check configuration
npm run test:sms

# 2. Check service status
npm run examples:sms 8

# 3. View logs
cat logs/app.log | grep SMS

# 4. Test connection
curl -I https://api.sms.ir/v1/send/verify

# 5. Verify environment
node -e "require('dotenv').config(); console.log(process.env.SMS_API_KEY ? 'API Key Set' : 'API Key Missing');"
```

## 💡 Tips

### Alias Commands

Add to your `.bashrc` or `.zshrc`:

```bash
alias sms-test='cd /path/to/backend && npm run test:sms'
alias sms-status='cd /path/to/backend && npm run examples:sms 8'
alias sms-dev='cd /path/to/backend && npm run dev'
```

### Watch Mode

```bash
# Watch for changes and restart
nodemon --watch src --exec "npm run test:sms"
```

### Batch Testing

```bash
# Test multiple phone numbers
for phone in 09123456789 09987654321; do
  npm run test:sms $phone
  sleep 2
done
```

## 📞 Help Commands

### Get Help

```bash
# Show available npm scripts
npm run

# Show test script help
npm run test:sms --help

# Show examples help
npm run examples:sms
```

### Documentation Links

```bash
# Open documentation (macOS)
open SMS_INDEX.md

# Open documentation (Linux)
xdg-open SMS_INDEX.md

# Open documentation (Windows)
start SMS_INDEX.md
```

---

**Quick Reference:**

- Test: `npm run test:sms`
- Examples: `npm run examples:sms [1-8]`
- Dev: `npm run dev`
- Status: `npm run examples:sms 8`

**Documentation:**

- [SMS Index](./SMS_INDEX.md)
- [Quick Start](./SMS_QUICK_START.md)
- [Troubleshooting](./SMS_TROUBLESHOOTING.md)
