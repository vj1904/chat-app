import jwt from "jsonwebtoken";

export const genrateJwtToken = (userId, res) => {
  console.log(userId);
  const token = jwt.sign(
    { id: userId.toString() },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "3d",
    }
  );

  res.cookie("jwt", token, {
    maxAge: 3 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "Strict",
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
