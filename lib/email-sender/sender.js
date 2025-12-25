const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

// Async version for better serverless support
const sendEmailAsync = async (body, message) => {
  // Validate email configuration
  if (!process.env.HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    const errorMsg = "Email configuration is missing. Please set HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS environment variables.";
    console.error("[Email] Configuration Error:", errorMsg);
    console.error("[Email] HOST:", process.env.HOST ? "Set" : "Missing");
    console.error("[Email] EMAIL_PORT:", process.env.EMAIL_PORT ? "Set" : "Missing");
    console.error("[Email] EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Missing");
    console.error("[Email] EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Missing");
    throw new Error(errorMsg);
  }

  const emailPort = parseInt(process.env.EMAIL_PORT, 10);
  const useSecure = emailPort === 465;

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: emailPort,
    secure: useSecure, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add TLS options for better compatibility
    tls: {
      rejectUnauthorized: false, // Allow self-signed certificates (useful for some SMTP servers)
    },
  });

  try {
    // Verify connection
    await transporter.verify();
    console.log("[Email] Server is ready to take our messages");
    
    // Send email
    const info = await transporter.sendMail(body);
    console.log("[Email] Email sent successfully!", message ? `(${message})` : "");
    console.log("[Email] To:", body.to);
    console.log("[Email] From:", body.from);
    console.log("[Email] MessageId:", info.messageId);
    return info;
  } catch (err) {
    console.error("[Email] Error sending email:", err.message);
    console.error("[Email] Error details:", err);
    console.error("[Email] To:", body.to);
    console.error("[Email] From:", body.from);
    throw err;
  }
};

// Legacy callback version for backward compatibility
const sendEmail = (body, res, message) => {
  // For fire-and-forget (res is null), use async version
  if (!res) {
    sendEmailAsync(body, message).catch((err) => {
      console.error("[Email] Fire-and-forget email failed:", err.message);
    });
    return;
  }

  // For requests that need a response, use async version but handle response
  sendEmailAsync(body, message)
    .then(() => {
      res.send({
        message: message || "Email sent successfully",
      });
    })
    .catch((err) => {
      console.error("[Email] Error in callback email:", err.message);
      res.status(403).send({
        message: `Error sending email: ${err.message}`,
      });
    });
};
//limit email verification and forget password
const minutes = 30;
const emailVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const passwordVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const supportMessageLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const phoneVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 2,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

module.exports = {
  sendEmail,
  sendEmailAsync,
  emailVerificationLimit,
  passwordVerificationLimit,
  supportMessageLimit,
  phoneVerificationLimit,
};
