# SMS.ir Integration - Complete Index

Quick reference to all SMS-related documentation and resources.

## 📚 Documentation

### Getting Started

- **[Quick Start Guide](./SMS_QUICK_START.md)** - Get SMS working in 5 minutes
- **[Setup Checklist](./SMS_CHECKLIST.md)** - Step-by-step setup verification
- **[خلاصه یکپارچه‌سازی](./خلاصه-یکپارچه‌سازی-SMS.md)** - خلاصه فارسی

### Complete Guides

- **[Integration Guide (English)](./SMS_INTEGRATION.md)** - Complete integration documentation
- **[راهنمای کامل (فارسی)](./راهنمای-SMS.md)** - مستندات کامل فارسی

### Reference

- **[Troubleshooting Guide](./SMS_TROUBLESHOOTING.md)** - Common issues and solutions
- **[Changelog](./SMS_CHANGELOG.md)** - Version history and changes

## 🗂️ Code Files

### Core Services

- `src/services/sms.service.js` - Main SMS service
- `src/utils/sms.helper.js` - Helper functions
- `src/utils/verification.js` - Integration with auth system

### Examples

- `src/examples/sms-examples.js` - 8 usage examples
- `src/examples/README.md` - Examples documentation
- `test-sms.js` - Quick test script

### Configuration

- `.env.example` - Environment variables template
- `.env.sms.example` - Detailed SMS configuration examples

## 🚀 Quick Commands

```bash
# Test SMS service
npm run test:sms

# Run examples
npm run examples:sms 1    # Simple verification
npm run examples:sms 5    # Batch send
npm run examples:sms 8    # Status check

# Start development server
npm run dev
```

## 📖 Usage Examples

### Simple Verification Code

```javascript
const {
  sendVerificationCode,
  generateVerificationCode,
} = require("./utils/sms.helper");

const code = generateVerificationCode(6);
await sendVerificationCode("09123456789", code, 123456);
```

### Custom SMS

```javascript
const { sendCustomSMS } = require("./utils/sms.helper");

await sendCustomSMS("09123456789", 100001, {
  Name: "علی",
  OrderNumber: "12345",
});
```

### Check Status

```javascript
const smsService = require("./services/sms.service");

console.log("Configured:", smsService.isConfigured());
console.log("Environment:", smsService.getEnvironment());
console.log("Is Sandbox:", smsService.isSandbox());
```

## 🔧 Configuration

### Environment Variables

```env
SMS_API_KEY=your_api_key_here
SMS_ENVIRONMENT=sandbox  # or production
SMS_TEMPLATE_ID=123456
```

### Get API Key

1. Visit: https://sms.ir/panel/developers
2. Create new API key
3. Select type: Sandbox (test) or Production (real)
4. Copy key to `.env`

## 🎯 Common Tasks

### Setup for Testing

1. Get Sandbox API key
2. Add to `.env`: `SMS_API_KEY=your_key`
3. Set: `SMS_ENVIRONMENT=sandbox`
4. Run: `npm run test:sms`

### Setup for Production

1. Create template in sms.ir panel
2. Get Production API key
3. Update `.env` with production values
4. Test with real phone number

### Troubleshooting

1. Check: [Troubleshooting Guide](./SMS_TROUBLESHOOTING.md)
2. Run: `npm run test:sms`
3. Check logs for errors
4. Verify environment variables

## 📱 Features

### Sandbox Mode

- ✅ No real SMS sent
- ✅ No credit consumed
- ✅ Default template (123456)
- ✅ Perfect for development

### Production Mode

- ✅ Real SMS delivery
- ✅ Credit consumption
- ✅ Custom templates
- ✅ Delivery reports

## 🔗 External Links

### sms.ir Resources

- **Panel:** https://sms.ir/panel
- **Developers:** https://sms.ir/panel/developers
- **API Docs:** https://sms.ir/api
- **Support:** https://sms.ir/support

### Quick Access

- **Create API Key:** https://sms.ir/panel/developers
- **Create Template:** Panel → ارسال سریع → قالب‌های من
- **Check Credit:** Panel → Dashboard
- **Delivery Reports:** Panel → گزارش ارسال

## 📊 File Structure

```
backend/
├── src/
│   ├── services/
│   │   └── sms.service.js          # Main SMS service
│   ├── utils/
│   │   ├── sms.helper.js           # Helper functions
│   │   └── verification.js         # Auth integration
│   └── examples/
│       ├── sms-examples.js         # 8 examples
│       └── README.md               # Examples guide
├── test-sms.js                     # Test script
├── .env.example                    # Config template
├── .env.sms.example                # SMS config examples
├── package.json                    # npm scripts
│
├── SMS_INDEX.md                    # This file
├── SMS_QUICK_START.md              # 5-minute guide
├── SMS_INTEGRATION.md              # Complete guide (EN)
├── SMS_CHECKLIST.md                # Setup checklist
├── SMS_TROUBLESHOOTING.md          # Problem solving
├── SMS_CHANGELOG.md                # Version history
├── راهنمای-SMS.md                  # Complete guide (FA)
└── خلاصه-یکپارچه‌سازی-SMS.md       # Summary (FA)
```

## 🎓 Learning Path

### Beginner

1. Read: [Quick Start Guide](./SMS_QUICK_START.md)
2. Setup: Follow [Checklist](./SMS_CHECKLIST.md)
3. Test: Run `npm run test:sms`
4. Try: Run `npm run examples:sms 1`

### Intermediate

1. Read: [Integration Guide](./SMS_INTEGRATION.md)
2. Study: `src/examples/sms-examples.js`
3. Implement: Add SMS to your features
4. Test: Try different examples

### Advanced

1. Review: `src/services/sms.service.js`
2. Customize: Extend for your needs
3. Optimize: Add caching, queuing
4. Monitor: Set up alerts and logging

## 🆘 Getting Help

### Self-Help

1. Check [Troubleshooting Guide](./SMS_TROUBLESHOOTING.md)
2. Run diagnostics: `npm run test:sms`
3. Review examples: `npm run examples:sms 8`
4. Check logs for errors

### Documentation

- English: [SMS_INTEGRATION.md](./SMS_INTEGRATION.md)
- Persian: [راهنمای-SMS.md](./راهنمای-SMS.md)
- Examples: `src/examples/README.md`

### Support

- sms.ir Support: https://sms.ir/support
- API Documentation: https://sms.ir/api
- Project Issues: Check your repository

## ✅ Quick Checklist

Before going live:

- [ ] API key configured
- [ ] Environment set correctly
- [ ] Template created (Production)
- [ ] Test script passes
- [ ] Examples work
- [ ] Integration tested
- [ ] Error handling in place
- [ ] Monitoring set up
- [ ] Documentation reviewed
- [ ] Team trained

## 🎉 Success Indicators

You're ready when:

- ✅ `npm run test:sms` passes
- ✅ Examples run without errors
- ✅ SMS received in Sandbox
- ✅ Production template approved
- ✅ Real SMS received in Production
- ✅ Error handling works
- ✅ Logs are clean
- ✅ Team knows how to use it

---

**Quick Start:** [SMS_QUICK_START.md](./SMS_QUICK_START.md)
**Full Guide:** [SMS_INTEGRATION.md](./SMS_INTEGRATION.md)
**راهنمای فارسی:** [راهنمای-SMS.md](./راهنمای-SMS.md)
