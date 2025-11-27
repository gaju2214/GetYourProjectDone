async function sendOTP(mobile, otp) {
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

  const response = await fetch(url);
  return await response.text();
}

module.exports = { sendOTP };
