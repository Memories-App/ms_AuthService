import mongoose from 'mongoose';

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}
  

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: false },
  email: { type: String, required: true },
  last_login: { type: Date, required: true, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;
