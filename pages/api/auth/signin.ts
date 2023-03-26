import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";
import * as jose from "jose";
import validator from "validator";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    const validationSchema = [
      {
        valid: validator.isEmail(email),
        message: "Email is invalid"
      },
      {
        valid: validator.isLength(password, {
          min: 1
        }),
        message: "Password is invalid"
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        return res.status(400).json({ message: check.message });
      }
    })

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        city: true,
        password: true,
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Email or password is invalid" });
    };

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is invalid" });
    }

    const alg = "HS256"
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ email: user.email })
      .setProtectedHeader({ alg })
      .setExpirationTime("24h")
      .sign(secret)

    setCookie("jwt", token, { req, res, maxAge: 3600 })
    return res.status(200).json({
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phone: user.phone,
      city: user.city,
    });
  }

  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}