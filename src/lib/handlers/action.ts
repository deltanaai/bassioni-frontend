"use server";

import { ZodError, ZodSchema } from "zod";

import { UnauthorizedError, ValidationError } from "../http-errors";
import logger from "../logger";
import { getSession } from "../session";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
};

async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        logger.error(`Validation error: ${error.message}`);
        throw new ValidationError(error);
      }
      throw error;
    }
  }

  let session: Session | null = null;
  if (authorize) {
    session = await getSession();
    if (!session) {
      logger.error("Unauthorized access attempt");
      throw new UnauthorizedError();
    }
  }

  return { params, session };
}

export default action;
