function generateOrderId() {
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const timePart = `${pad(now.getHours())}${pad(now.getMinutes())}`;
  const randomPart = Math.floor(100 + Math.random() * 900); // 3-digit random
  return `ORDER${datePart}${timePart}${randomPart}`;
}

module.exports = generateOrderId;