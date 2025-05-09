import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    nic: {
        type: String,
        required: [true, "NIC is required"],
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                // Validates both old (9+1 char) and new (12 digit) Sri Lankan NIC formats
                return /^([0-9]{9}[vVxX]|[0-9]{12})$/.test(v);
            },
            message: (props) => `${props.value} is not a valid Sri Lankan NIC!`,
        },
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    contactNumber: {
        type: String,
        required: [true, "Contact number is required"],
        trim: true,
        match: [
            /^(?:0|94|\+94)?(?:7(?:0|1|2|4|5|6|7|8)\d)\d{6}$/,
            "Please enter a valid Sri Lankan phone number (e.g., 0771234567)",
        ],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

// Auto-update timestamp
userSchema.pre("save", function (next) {
    if (this.isModified()) {
        this.updatedAt = Date.now();
    }
    next();
});

const User = mongoose.model("User", userSchema);

export default User;
