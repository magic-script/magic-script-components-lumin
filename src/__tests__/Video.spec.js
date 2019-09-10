//
import React from "react";
import { create } from "react-test-renderer";

describe("Video component", () => {
  test("Matches the snapshot", () => {
    const props = {videoPath: "test_file.mp4"}
    const video = create(React.createElement("video", props));
    expect(video.toJSON()).toMatchSnapshot();
  });
});
