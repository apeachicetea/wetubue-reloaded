let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 1,
    id: 1
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 2
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2 minutes ago",
    views: 59,
    id: 3
  }
];

export const trending = (req, res) => {
  return res.render("home", {pageTitle: "Home", videos});
}
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("watch", {pageTitle: `Watching: ${video.title}`, video});
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  res.render("edit", {pageTitle: `Editing: ${video.title}`, video});
};
export const postEdit = (req, res) => {
  const { title } = req.body;
  const { id } = req.params;
  videos[id - 1].title = title;
  res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  res.render("upload", {pageTitle: "Upload Video", videos});
}
export const postUpload = (req, res) => {
  // here we will add a video to the videos array
  const { title } = req.body;
  const newVideo = {
    title,
    rating: 4.7,
    comments: 10,
    createdAt: "just now",
    views: 99,
    id: videos.length + 1,
  }
  
  videos = [...videos, newVideo];
  res.redirect("/")
}

