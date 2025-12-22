import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { userRegistrationSchema, userLoginSchema } from '../utils/validation';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { error, value } = userRegistrationSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const existingUser = await UserModel.findByEmail(value.email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const userId = await UserModel.create(value);
      const user = await UserModel.findById(userId);
      const token = UserModel.generateToken(user!);

      // Clean the user name from any non-printable characters
      const cleanName = user!.name ? user!.name.replace(/[^\x20-\x7E]/g, '').trim() : user!.name;

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: user!.id, email: user!.email, name: cleanName, role: user!.role }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { error, value } = userLoginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const user = await UserModel.findByEmail(value.email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await UserModel.validatePassword(value.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = UserModel.generateToken(user);

      // Clean the user name from any non-printable characters
      const cleanName = user.name ? user.name.replace(/[^\x20-\x7E]/g, '').trim() : user.name;

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, email: user.email, name: cleanName, role: user.role }
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
}