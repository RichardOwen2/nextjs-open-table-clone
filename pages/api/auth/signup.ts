import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { setCookie } from "cookies-next";
import * as jose from "jose";
import validator from "validator";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { firstName, lastName, email, phone, city, password } = req.body;

    const validationSchema = [
      {
        valid: validator.isLength(firstName, {
          min: 1,
          max: 20,
        }),
        message: "First name is invalid"
      },
      {
        valid: validator.isLength(lastName, {
          min: 1,
          max: 20,
        }),
        message: "Last name is invalid"
      },
      {
        valid: validator.isEmail(email),
        message: "Email is invalid"
      },
      {
        valid: validator.isMobilePhone(phone),
        message: "Phone number is invalid"
      },
      {
        valid: validator.isLength(city, {
          min: 1,
        }),
        message: "City is invalid"
      },
      {
        valid: validator.isStrongPassword(password),
        message: "Password is not strong enough"
      },
    ];

    validationSchema.forEach((check) => {
      if (!check.valid) {
        return res.status(400).json({ message: check.message })
      };
    });

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      }
    })

    if (userWithEmail) {
      return res.status(400).json({ message: "Email is associated with another account" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        password: hashedPassword,
        city,
        phone,
        email
      }
    });

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

  return res.status(405).json({ message: "Method not allowed" });
}