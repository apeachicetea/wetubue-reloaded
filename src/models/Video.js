import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, tirm: true, maxlength: 80 },
  description: { type: String, required: true, tirm: true, minlength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  fileUrl: { type: String, required: true },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
  //몽구스에게 objectId가 model user에서 온다고 알려주는 코드이다
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags.split(",").map((el) => (el.startsWith("#") ? el : `#${el}`));
});

const movieModel = mongoose.model("Video", videoSchema);

export default movieModel;
