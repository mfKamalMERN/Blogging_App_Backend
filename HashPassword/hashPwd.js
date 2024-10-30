const bcrypt = require('bcryptjs');

// Function to hash a password
const hashPassword = async (password) => {
    try {
        // Generate a salt
        const saltRounds = 10; // You can adjust the salt rounds for more security
        const salt = await bcrypt.genSalt(saltRounds);

        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error; // Rethrow the error for handling in calling function
    }
};

module.exports = hashPassword;