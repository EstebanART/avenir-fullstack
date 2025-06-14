const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

//registro
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExits = await User.findOne({ email });

        if (userExits) {
            return res.status(400).json({message: 'el usuario ya existe'});
        }
    

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    res.status(201).json({message: ' usuario registrado', userId: user._id }
    
    )
}