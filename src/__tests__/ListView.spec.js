//
import React from "react";
import { create } from "react-test-renderer";
import { ListView } from "magic-script-components";

describe("ListView component", () => {
  test("Matches the snapshot", () => {
    const listView = create(<ListView />);
    expect(listView.toJSON()).toMatchSnapshot();
  });
});
