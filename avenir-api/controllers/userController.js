const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//generar token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
         expiresIn: '7d' 
        });
};

//registro
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExits = await User.findOne({ email });

        if (userExits) {
            return res.status(400).json({message: 'el usuario ya existe'});
        }
    

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    res.status(201).json({message: ' usuario registrado', userId: user._id });
    } catch (error) {
    console.error("ERROR EN REGISTER:", error);
    res.status(500).json({ message: 'error del servidor', error: error.message });
}

    
}
;

//login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'usuario no encontrado'});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'contraseña incorrecta'});
        }

        res.json({ 
            message: 'login exitoso',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            token: generateToken(user._id)
        });
    } catch (error) {
    console.error("ERROR EN LOGIN:", error);
    res.status(500).json({ message: 'error del servidor', error: error.message });
}

};

module.exports = { 
    registerUser, 
    loginUser 
};