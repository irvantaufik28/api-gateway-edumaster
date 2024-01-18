import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const generateAccessToken = (data: any) => {
  const user_data = {
    id: data.id,
    username: data.username,
    roles: data.roles,
    permissions: data.permissions,
    user_detail: data.user_detail,
  };
  const secretKey = process.env.JWT_SECRET_KEY || "defaultSecretKey";

  const accessToken = jwt.sign(user_data, secretKey, { expiresIn: "6h" });
  return accessToken;
};

export  {
  generateAccessToken,
};
