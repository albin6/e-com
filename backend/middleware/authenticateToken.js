import jwt from "jsonwebtoken";

export const authenticate_token = (req, res, next) => {
  try {
    if (
      req.headers["Authorization"] &&
      req.headers["Authorization"].startsWith("Bearer ")
    ) {
      const token = req.headers["Authorization"].split(" ")[1];

      jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } catch (error) {
    console.log(error);
  }
};
