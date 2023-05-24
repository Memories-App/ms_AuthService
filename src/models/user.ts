import mongoose from 'mongoose';

export interface User {
    id: string;
    name: {
        familyName: string;
        givenName: string;
    };
    email: string;
    picture: string;
}
  
// MongoDB Schema
const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true },
  picture: { type: String, required: true },
  name: { type: Object, required: true },
  email: { type: String, required: true },
  last_login: { type: Date, required: true, default: Date.now },
  strategy: { type: String, required: true, },
});

const User = mongoose.model('User', userSchema);

export default User;

 