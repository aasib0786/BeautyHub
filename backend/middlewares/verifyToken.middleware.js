import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization || req.headers?.Authorization;
    let token = req.cookies?.token;

    if (!token && authHeader) {
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else {
        token = authHeader;
      }
    }

    if (!token && req.headers?.["x-access-token"]) {
      token = req.headers["x-access-token"];
    }

    console.log("token=>", token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized you are not logged In" });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token signature." });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    } else {
      return res.status(401).json({ message: "Authentication failed." });
    }
  }
};
