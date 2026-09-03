class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}


class UserNotAuthenticatedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class UserForbiddenError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}


function errorResponse(
  err: Error,
  req: Request,
  res: Response,
) {
    if (err instanceof NotFoundError) {
        res.status(404).json({ error: err.message });
    } else if (err instanceof UnauthorizedError) {
        res.status(404).json({ error: err.message });
    } else {
        res.status(500).json({ error: "Something went wrong on our end" });
    }
}