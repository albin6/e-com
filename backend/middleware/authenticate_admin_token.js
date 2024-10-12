import jwt from "jsonwebtoken";

export const authenticate_admin_token = (req, res, next) => {
  console.log("admin auth middleware");
  console.log(req.headers);

  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.ADMIN_JWT_ACCESS_KEY);
    req.user = user; // Attach the user data to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.log("JWT verification error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
