import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// --- REGISTRO ---
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Por favor, rellena todos los campos' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Este email ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'Usuario registrado con éxito',
      user: { id: newUser._id, username: newUser.username, email: newUser.email }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al registrar usuario' });
  }
};

// --- LOGIN (LÓGICA REAL) ---
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validar que envían datos
    if (!email || !password) {
      return res.status(400).json({ message: 'Falta email o contraseña' });
    }

    // 2. Buscar usuario (incluyendo la contraseña oculta)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // 3. Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // 4. Generar Token JWT
    const secret = process.env.JWT_SECRET || 'palabrasecretaparaeltoken';
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' });

    // 5. Responder con el token
    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión' });
  }
};