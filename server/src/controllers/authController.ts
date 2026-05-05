import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import Project from '../models/Project';
import { AuthRequest } from '../middlewares/auth';
import { getSiteConfig } from '../utils/siteConfig';
import { getJwtSecret } from '../utils/jwt';

// Función para validar la contraseña
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
    const config = await getSiteConfig();
    if (!config.allowRegistration) {
      return res.status(403).json({ message: 'El registro esta deshabilitado temporalmente' });
    }
    if (config.maintenanceMode) {
      return res.status(503).json({ message: 'Plataforma en mantenimiento. Intenta mas tarde' });
    }
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Rellena todos los campos' });
    }

    // Validar la contraseña
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    // Verificar email y username únicos
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email ya registrado' });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: 'Nombre de usuario ya en uso' });
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
    if (user?.isSuspended) {
      return res.status(403).json({ message: 'Cuenta suspendida. Contacta con soporte' });
    }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    const secret = getJwtSecret();
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' });

    res.json({
      message: 'Login exitoso',
      token,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio, role: user.role }
    });
  } catch (error: any) {
    if (error?.message === 'JWT_SECRET_MISSING') {
      return res.status(500).json({ message: 'Server misconfigured: JWT_SECRET missing' });
    }
    res.status(500).json({ message: 'Error en login' });
  }
};

// --- ACTUALIZAR PERFIL ---
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, bio } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (username) {
      // Verificar unicidad del username al actualizar
      const taken = await User.findOne({ username });
      if (taken && taken._id.toString() !== userId) {
        return res.status(400).json({ message: 'Nombre de usuario ya en uso' });
      }
      user.username = username;
    }

    if (bio !== undefined) {
      const trimmedBio = String(bio).trim();
      if (trimmedBio.length > 65) {
        return res.status(400).json({ message: 'La descripcion no puede superar 65 caracteres' });
      }
      user.bio = trimmedBio;
    }

    await user.save();

    res.json({
      success: true,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio, role: user.role }
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

// --- OLVIDÉ MI CONTRASEÑA (Solicitar reset) ---
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Proporciona tu email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Por seguridad, no revelamos si el email existe
      return res.json({ message: 'Si el email existe, recibirás un enlace de recuperación' });
    }

    // Generar token único
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Guardar token hasheado en BD (más seguro)
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await user.save();

    // 🔔 NOTIFICAR A N8N para enviar email
    try {
      const n8nUrl = process.env.N8N_WEBHOOK_URL_RESET || 'http://n8n:5678/webhook/reset-password';

      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          username: user.username,
          resetUrl: resetUrl,
          expiresIn: '1 hora'
        })
      });

      console.log('✅ Email de recuperación enviado via n8n');
    } catch (webhookError) {
      console.error('❌ Error al notificar n8n:', webhookError);
    }

    res.json({ message: 'Si el email existe, recibirás un enlace de recuperación' });

  } catch (error) {
    console.error('Error forgot password:', error);
    res.status(500).json({ message: 'Error al procesar solicitud' });
  }
};

// --- RESETEAR CONTRASEÑA (Con token) ---
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: 'Proporciona una nueva contraseña' });
    }

    // Validar la nueva contraseña
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    // Hashear el token recibido para comparar
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Buscar usuario con token válido y no expirado
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select('+resetPasswordToken +resetPasswordExpires');

    if (!user) {
      return res.status(400).json({ message: 'Token inválido o expirado' });
    }

    // Actualizar contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Limpiar campos de reset
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, message: 'Contraseña actualizada correctamente' });

  } catch (error) {
    console.error('Error reset password:', error);
    res.status(500).json({ message: 'Error al resetear contraseña' });
  }
};

// --- SUBIR AVATAR ---
export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ message: 'No se envió archivo' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Guardar nombre del archivo como avatar
    user.avatar = req.file.filename;
    await user.save();

    res.json({
      success: true,
      message: 'Avatar actualizado',
      avatar: req.file.filename,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar, role: user.role }
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ message: 'Error al subir avatar' });
  }
};