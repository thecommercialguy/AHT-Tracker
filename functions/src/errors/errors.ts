import type { Response } from "express";

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
    }
}


export class UnauthorizedError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}


export function errorResponse(
  err: unknown,
  res: Response,
) {
    if (err instanceof NotFoundError) {
        res.status(404).json({ error: err.message });
    } else if (err instanceof UnauthorizedError) {
        res.status(401).json({ error: err.message });
    } else if (err instanceof ForbiddenError) {
        res.status(403).json({ error: err.message });
    }  else if (err instanceof BadRequestError) {
        res.status(404).json({ error: err.message });
    } 
    
    
    else {
        res.status(500).json({ error: "Something went wrong" });
    }
}


export function throwQueryError(status: number, message: string | null) {
    if (status === 401) {
        throw new UnauthorizedError('Validation unsuccessful');
    } else if (status === 404) {
        throw new UnauthorizedError('Resource not found');
    } else if (status === 400) {
        throw new BadRequestError(message || 'Bad Request');
    }  else {
       throw Error()
    } 
}