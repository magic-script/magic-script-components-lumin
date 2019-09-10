//
import React from "react";
import { create } from "react-test-renderer";

describe("ScrollBar component", () => {
  test("Matches the snapshot", () => {
    const props = {width: 0.1}
    const scrollbar = create(React.createElement("scrollBar", props));
    expect(scrollbar.toJSON()).toMatchSnapshot();
  });
});
