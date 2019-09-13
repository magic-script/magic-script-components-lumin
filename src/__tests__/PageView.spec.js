//
import React from "react";
import { create } from "react-test-renderer";
import { PageView } from "magic-script-components";

describe("PageView component", () => {
  test("Matches the snapshot", () => {
    const pageView = create(<PageView width={0.2} height={0.2} />);
    expect(pageView.toJSON()).toMatchSnapshot();
  });
});
