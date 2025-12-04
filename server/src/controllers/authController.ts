import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Project from '../models/Project';
import { AuthRequest } from '../middlewares/auth';

// Función auxiliar para validar la contraseña
const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una mayúscula' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos una minúscula' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'La contraseña debe contener al menos un número' };
  }
  return { valid: true };
};

// --- REGISTRO ---
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Rellena todos los campos' });
    }

    // Validar la contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ 
      message: 'Usuario registrado', 
      user: { id: newUser._id, username: newUser.username, email: newUser.email } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en registro' });
  }
};

// --- LOGIN ---
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan credenciales' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const secret = process.env.JWT_SECRET || 'palabrasecretaparaeltoken';
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' });

    res.json({ 
      message: 'Login exitoso', 
      token, 
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en login' });
  }
};

// --- ACTUALIZAR PERFIL ---
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (username) user.username = username;
    
    await user.save();

    res.json({ 
      success: true, 
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando perfil' });
  }
};

// --- CAMBIAR CONTRASEÑA ---
export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Validar la nueva contraseña
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Error cambiando contraseña' });
  }
};

// --- ELIMINAR USUARIO ---
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;

    // Borrar todos los datos asociados
    await Project.deleteMany({ owner: userId });

    // Borrar el usuario
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Cuenta eliminada con éxito' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: 'Error al eliminar la cuenta' });
  }
};