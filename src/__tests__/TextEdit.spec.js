//
import React from "react";
import { create } from "react-test-renderer";

describe("TextEdit component", () => {
  test("Matches the snapshot", () => {
    const props = {text: "Test Text Edit", width: 0.25, height: 0.1}
    const text = create(React.createElement("textEdit", props));
    expect(text.toJSON()).toMatchSnapshot();
  });
});
