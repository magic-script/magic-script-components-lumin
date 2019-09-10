//
import React from "react";
import { create } from "react-test-renderer";

describe("Audio component", () => {
  test("Matches the snapshot", () => {
    const props = {fileName: "test_file.avi"};
    const audio = create(React.createElement("audio", props));
    expect(audio.toJSON()).toMatchSnapshot();
  });
});
