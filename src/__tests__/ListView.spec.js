//
import React from "react";
import { create } from "react-test-renderer";

describe("ListView component", () => {
  test("Matches the snapshot", () => {
    const listView = create(React.createElement("listView"));
    expect(listView.toJSON()).toMatchSnapshot();
  });
});
