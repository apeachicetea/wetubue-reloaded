import Video from "../models/Video.js";
import User from "../models/User.js";

export const home = async (req, res) => {
  // console.log(req.session.user);
  try {
    const videos = await Video.find({}).sort({ createdAt: "desc" });
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.render("server-error");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  //poplate()는 몽구스가 기존의 owner가 objectId인 것을 알고 objectId가 User 모델에서 온것임을 안다
  //(그 이유는 Video 모델에서 명시해놓았기 떄문이다)
  //그래서 몽구스가 해당 User모델에서 user를 찾아서 video를 로드했을떄 해당 user의 정보도 얻을 수 있게 된다
  const video = await Video.findById(id).populate("owner");
  console.log(video);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const { id } = req.params;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  // here we will add a video to the videos array
  const {
    user: { _id },
  } = req.session;
  const { path } = req.file;
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      fileUrl: path,
      owner: _id,
      hashtags: Video.formatHashtags(hashtags),
    });

    res.redirect("/");
  } catch (error) {
    res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({ title: { $regex: new RegExp(keyword, "i") } });
  }
  res.render("search", { pageTitle: "Search", videos });
};
