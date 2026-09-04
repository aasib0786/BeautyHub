import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized you are not logged In" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    const allowedRoles = ["admin", "superadmin", "super_admin", "vendor", "staff"];
    const userRole = (decoded.role || "").toLowerCase();

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Unauthorized ! You do not have access permissions." });
    }
    next();
  } catch (error) {
    console.log("Verify token error", error);
    return res.status(500).json({ message: "Unauthorized Invalid token" });
  }
};
