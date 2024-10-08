import jwt from "jsonwebtoken";

export const authenticate_user_token = (req, res, next) => {
  console.log("user auth middleware");
  try {
    if (
      req.headers["authorization"] &&
      req.headers["authorization"].startsWith("Bearer ")
    ) {
      const token = req.headers["authorization"].split(" ")[1];

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
