import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET || "defaultSecret", {
    expiresIn: "30d",
  });
};
