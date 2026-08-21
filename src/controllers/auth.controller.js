import asyncHandler from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';

export const login = asyncHandler(async (req, res) => {
  res.json(authService.login(req.body));
});
