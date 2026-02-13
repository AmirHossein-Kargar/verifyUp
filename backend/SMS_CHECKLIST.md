# SMS.ir Integration Checklist

Use this checklist to ensure your SMS integration is properly set up.

## 📋 Initial Setup

### 1. Get API Key

- [ ] Visit https://sms.ir/panel/developers
- [ ] Create new API key
- [ ] Select "Sandbox" type for testing
- [ ] Copy the API key

### 2. Configure Environment

- [ ] Open `.env` file
- [ ] Add `SMS_API_KEY=your_key_here`
- [ ] Add `SMS_ENVIRONMENT=sandbox`
- [ ] Add `SMS_TEMPLATE_ID=123456`
- [ ] Save the file

### 3. Test Configuration

- [ ] Run `npm run test:sms`
- [ ] Verify "Service Status: Configured: ✅"
- [ ] Verify "Environment: SANDBOX"
- [ ] Check for successful test message

## 🧪 Testing Phase

### 4. Run Examples

- [ ] Run `npm run examples:sms 1` (Simple verification)
- [ ] Run `npm run examples:sms 8` (Status check)
- [ ] Verify no errors in console
- [ ] Check logs show "SMS sent successfully"

### 5. Test in Application

- [ ] Start your backend: `npm run dev`
- [ ] Try user registration
- [ ] Check console for OTP code
- [ ] Verify "SMS sent successfully" message
- [ ] Test OTP verification flow

### 6. Verify Integration

- [ ] Registration sends OTP
- [ ] OTP appears in console (Sandbox mode)
- [ ] OTP verification works
- [ ] Resend OTP works
- [ ] No errors in application logs

## 🚀 Production Preparation

### 7. Create Production Template

- [ ] Login to sms.ir panel
- [ ] Go to "ارسال سریع" → "قالب‌های من"
- [ ] Create new template
- [ ] Example: `کد تایید شما: #Code#`
- [ ] Note the Template ID

### 8. Get Production API Key

- [ ] Go to https://sms.ir/panel/developers
- [ ] Create new API key
- [ ] Select "Production" type
- [ ] Copy the production key

### 9. Check Account Credit

- [ ] Login to sms.ir panel
- [ ] Check account balance
- [ ] Add credit if needed
- [ ] Verify credit is sufficient

### 10. Update Production Environment

- [ ] Update `.env` file:
  ```env
  SMS_API_KEY=production_key_here
  SMS_ENVIRONMENT=production
  SMS_TEMPLATE_ID=your_template_id
  ```
- [ ] Restart your application
- [ ] Test with real phone number
- [ ] Verify SMS is received

## 🔒 Security Checklist

### 11. Security Review

- [ ] API key is in `.env` file (not in code)
- [ ] `.env` is in `.gitignore`
- [ ] No API keys committed to git
- [ ] Production uses HTTPS
- [ ] Rate limiting is enabled
- [ ] Error messages don't leak sensitive info

## 📊 Monitoring

### 12. Set Up Monitoring

- [ ] Check sms.ir panel for delivery reports
- [ ] Monitor application logs
- [ ] Set up alerts for SMS failures
- [ ] Track SMS costs
- [ ] Monitor rate limits

## ✅ Final Verification

### 13. End-to-End Test

- [ ] User registration works
- [ ] SMS is received on real phone
- [ ] OTP verification works
- [ ] Resend OTP works
- [ ] Error handling works properly
- [ ] Logs are clean and informative

### 14. Documentation Review

- [ ] Team knows how to use SMS service
- [ ] Documentation is accessible
- [ ] Emergency contacts are documented
- [ ] Backup plan is in place

## 🎯 Common Issues

### If SMS not sending:

- [ ] Check API key is correct
- [ ] Verify environment is set correctly
- [ ] Check template ID matches
- [ ] Verify phone number format
- [ ] Check account has credit (Production)
- [ ] Review error logs

### If getting authentication errors:

- [ ] Regenerate API key
- [ ] Check for extra spaces in `.env`
- [ ] Verify key type matches environment
- [ ] Restart application after changes

### If rate limited:

- [ ] Add delays between requests
- [ ] Check sms.ir panel for limits
- [ ] Implement retry logic
- [ ] Contact sms.ir support if needed

## 📞 Support Resources

- [ ] Bookmark: https://sms.ir/panel
- [ ] Bookmark: https://sms.ir/api
- [ ] Save sms.ir support contact
- [ ] Document internal SMS admin contact

## 🎉 Completion

When all items are checked:

- ✅ SMS integration is complete
- ✅ Testing is done
- ✅ Production is ready
- ✅ Team is informed
- ✅ Monitoring is active

---

**Last Updated:** Check this list whenever you update the SMS integration or deploy to a new environment.
