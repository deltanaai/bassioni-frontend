import z from "zod";


const PHONE_REGEX = /^(?=.{5,20}$)(?=.*\d)[0-9+\_\-\(\)\.\s]+$/;

export const phoneNumberSchema=z
  .string()
  .min(5, { message: "Invalid phone number. Only digits, +, -, _, (), spaces, and . are allowed." })
  .max(20, { message: "Invalid phone number. Only digits, +, -, _, (), spaces, and . are allowed." })
  .regex(PHONE_REGEX, {
    message:
      "Invalid phone number. Only digits, +, -, _, (), spaces, and . are allowed.",
    })

