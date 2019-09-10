//
import React from "react";
import { create } from "react-test-renderer";

describe("Image component", () => {
  test("Matches the snapshot", () => {
    const props = {filePath: "test_file.png", width: 0.2, height: 0.2}
    const image = create(React.createElement("image", props));
    expect(image.toJSON()).toMatchSnapshot();
  });
});
