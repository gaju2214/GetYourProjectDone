async function sendOTP(mobile, otp) {
  try {
    // Ensure mobile is exactly 10 digits
    if (!/^\d{10}$/.test(mobile)) {
      console.error(`❌ Invalid phone format: ${mobile} (must be 10 digits)`);
      throw new Error(`Invalid phone number format: ${mobile}. Must be exactly 10 digits.`);
    }

    console.log(`📱 Preparing to send OTP to: +91${mobile}`);
    
    const message = `Dear user, your OTP for project registration is ${otp} . Thank You. -Electrosoft`;

    const params = new URLSearchParams({
      AUTH_KEY: process.env.AUTH_KEY,
      message,
      senderId: process.env.SENDER_ID,
      routeId: process.env.ROUTE_ID,
      mobileNos: mobile,
      smsContentType: process.env.SMS_CONTENT_TYPE,
      entityid: process.env.ENTITY_ID,
      tmid: process.env.TMID,
      templateid: process.env.TEMPLATE_ID,
      concentFailoverId: process.env.CONSENT_FAILOVER_ID
    });

    const url = `https://msg.softanic.in/rest/services/sendSMS/sendGroupSms?${params.toString()}`;

    console.log(`📤 Sending request to SMS gateway...`);
    console.log(`📞 Phone: +91${mobile}`);
    console.log(`🔐 OTP: ${otp}`);

    const response = await fetch(url);
    const responseText = await response.text();

    console.log(`📨 SMS Gateway Response Status: ${response.status}`);
    console.log(`📨 SMS Gateway Response: ${responseText}`);

    if (response.ok) {
      console.log(`✅ OTP sent successfully to +91${mobile}`);
      return { success: true, message: responseText, phone: `+91${mobile}`, otp };
    } else {
      console.error(`❌ Failed to send OTP to +91${mobile}`);
      console.error(`Response Status: ${response.status}`);
      console.error(`Response: ${responseText}`);
      throw new Error(`SMS Gateway Error: ${responseText}`);
    }
  } catch (error) {
    console.error(`❌ Error sending OTP:`, error.message);
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
}

module.exports = { sendOTP };
