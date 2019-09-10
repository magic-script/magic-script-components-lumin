//
import React from "react";
import { create } from "react-test-renderer";

describe("ListViewItem component", () => {
  test("Matches the snapshot", () => {
    const listViewItem = create(React.createElement("listViewItem"));
    expect(listViewItem.toJSON()).toMatchSnapshot();
  });
});
