import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';

// --- REGISTRO DE USUARIO ---
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 1. Validar que nos envían todo
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Por favor, rellena todos los campos' });
    }

    // 2. Comprobar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Este email ya está registrado' });
    }

    // 3. Encriptar la contraseña (Hashing)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Crear el usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // 5. Guardar en MongoDB
    await newUser.save();

    res.status(201).json({ 
      message: 'Usuario registrado con éxito',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor al registrar usuario' });
  }
};

// --- LOGIN (Lo haremos en el siguiente paso) ---
export const login = async (req: Request, res: Response) => {
    res.json({ message: "Login no implementado aún" });
}