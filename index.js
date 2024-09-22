const tasks = require("./tasks.js");

const s3_driver = {
  add: async (path, data) => {
    console.log(`Uploading files to S3 ${path}`);
    console.log(`Data ${JSON.stringify(data)}`);

    return Promise.resolve();
  },
};

const input = {
  files: ["img_file.jpg", "music_file.mp3", "doc_file.doc", "video_file.mp4"],
  scanned_files: ["img_file.jpg"],
  errored_files: ["video_file.mp4"],
};

const resources = {
  s3_driver,
  _debug: console.error,
};

tasks(resources)
  .run(input)
  .then((res) => console.log("Result: ", res))
  .catch((err) => console.error("Error", err));
