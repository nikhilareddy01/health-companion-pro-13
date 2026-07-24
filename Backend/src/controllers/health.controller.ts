import { Request, Response } from 'express';

export const checkHealth = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'API is healthy and routing is working correctly.',
    timestamp: new Date().toISOString()
  });
};
