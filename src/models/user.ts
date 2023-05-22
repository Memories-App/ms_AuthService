import mongoose from 'mongoose';

export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
}
  
// MongoDB Schema
const userSchema = new mongoose.Schema({
  first_name: { type: String, required: false },
  email: { type: String, required: true },
  last_login: { type: Date, required: true, default: Date.now },
  strategy: { type: String, required: true, },
});

const User = mongoose.model('User', userSchema);

export default User;
