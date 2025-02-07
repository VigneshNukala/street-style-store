const PORT = process.env.PORT || 3000;
const SECRET_KEY = "SECRET";

const requestCounts = new Map();

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const time = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 2;

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, []);
  }

  const timestamps = requestCounts.get(ip);
  const filteredTimestamps = timestamps.filter(
    (timestamp) => time - timestamp < windowMs
  );

  if (filteredTimestamps.length >= maxRequests) {
    return res
      .status(429).send("Too many requests, please try again later.");
  }

  filteredTimestamps.push(time);
  requestCounts.set(ip, filteredTimestamps);

  next();
};

module.exports = {
  PORT,
  SECRET_KEY,
  rateLimiter,
};
