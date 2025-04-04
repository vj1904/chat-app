import jwt from "jsonwebtoken";

export const genrateJwtToken = (userId, res) => {
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
    sameSite: "None",
    secure: true,
  });

  return token;
};
