//
import React from "react";
import { create } from "react-test-renderer";

describe("Text component", () => {
  test("Matches the snapshot", () => {
    const props = {text: "Test Text"}
    const text = create(React.createElement("text", props));
    expect(text.toJSON()).toMatchSnapshot();
  });
});
