//
import React from "react";
import { create } from "react-test-renderer";

describe("PageView component", () => {
  test("Matches the snapshot", () => {
    const props = {width: 0.2, height: 0.2}
    const pageView = create(React.createElement("pageView", props));
    expect(pageView.toJSON()).toMatchSnapshot();
  });
});
