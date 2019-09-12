//
import React from "react";
import { create } from "react-test-renderer";
import { ListViewItem } from "magic-script-components";

describe("ListViewItem component", () => {
  test("Matches the snapshot", () => {
    const listViewItem = create(<ListViewItem />);
    expect(listViewItem.toJSON()).toMatchSnapshot();
  });
});
