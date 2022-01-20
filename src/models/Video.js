import mongoose from "mongoose";

// model을 생성하기전에 우리는 model의 형태를 정의해 줄 필요가 있다
// 그것은 schema
// 아래 코드블럭 안에 비디오 형식을 작성한다(실제 데이터는 넣지않고 형식만 정의한다)
// 예시)데이터 형식
// const video = {
//   title: "Heki",
//   description: "lalala",
//   createdAt: 1212,
//   hashtags: [
//     "#hi",
//     "#mongo"
//   ]
// }
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
})

// Video model을 생성하고, 이 model은 위에서 정의한 형식을 따른다
const movieModel = mongoose.model("Video", videoSchema);

export default movieModel;