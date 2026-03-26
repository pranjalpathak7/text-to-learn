import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    auth0Id: { type: String, required: true, unique: true }, // The 'sub' field from Auth0
    email: { type: String, required: true },
    name: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);