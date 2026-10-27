import mongoose from "mongoose";


interface SchemaType {
    _id: mongoose.Types.ObjectId,
    name: string,
    image: string,
    email: string,
    password: string,
    createAt: Date,
    updatedAt: Date,
}

const userSchema = new mongoose.Schema<SchemaType>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },

},{timestamps: true})

const User = mongoose.models?.User || mongoose.model('User', userSchema);
export default User