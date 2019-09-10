//
import React from "react";
import { create } from "react-test-renderer";

describe("Button component", () => {
  test("Matches the snapshot", () => {
    const props = {text: "Test Button", width: 0.25, height: 0.1}
    const button = create(React.createElement("button", props));
    expect(button.toJSON()).toMatchSnapshot();
  });
});
