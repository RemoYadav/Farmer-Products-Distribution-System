const  mongoose =require( "mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = activity for ALL users
    },
   
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isReadBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports=mongoose.model("Activity", activitySchema);
