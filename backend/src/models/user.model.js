import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      // validate: {
      //   validator: function (value) {
      //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_@]).{8,}$/.test(
      //       value
      //     );
      //   },
      //   message:
      //     "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit and one special character (_ or @).",
      // },
    },
    profilePic: { type: String, default: "" },
    delete_type: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  { Timestamps: true }
);

userSchema.methods.softDelete = async function () {
  this.delete_type = 1;
  this.deletedAt = new Date();
  await this.save();
};

userSchema.methods.restoreUser = async function () {
  this.delete_type = 0;
  this.deletedAt = null;
  await this.save();
};

userSchema.methods.findActiveUser = async function (userId) {
  return await this.findOne({ _id: userId, delete_type: 0 });
};

const User = mongoose.model("User", userSchema);

export default User;
