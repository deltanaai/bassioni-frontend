import { ZodError } from "zod";

export class RequestError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.name = "RequestError";
  }
}

export class ValidationError extends RequestError {
  constructor(errorInput: ZodError | Record<string, string[]>) {
    const fieldErrors =
      errorInput instanceof ZodError
        ? ValidationError.mapZodIssues(errorInput)
        : errorInput;
    const message = ValidationError.formatFieldErrors(fieldErrors);
    super(400, message, fieldErrors);
    this.name = "ValidationError";
    this.errors = fieldErrors;
  }

  private static mapZodIssues(error: ZodError): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of error.issues) {
      const key = issue.path.join(".") || "_error";
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }

    return fieldErrors;
  }

  static formatFieldErrors(errors: Record<string, string[]>): string {
    const formatted = Object.entries(errors).map(([field, msgs]) => {
      const fieldLabel =
        field === "_error"
          ? "General error"
          : field.charAt(0).toUpperCase() + field.slice(1);
      return `${fieldLabel}: ${msgs.join("، ")}`; // comma in Arabic style
    });

    return formatted.join("، ");
  }
}

export class NotFoundError extends RequestError {
  constructor(message: string) {
    super(404, message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string = "Access forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string = "Unauthorized access") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}
