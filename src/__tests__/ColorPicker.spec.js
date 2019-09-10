//
import React from "react";
import { create } from "react-test-renderer";

describe("ColorPicker component", () => {
  test("Matches the snapshot", () => {
    const colorPicker = create(React.createElement("colorPicker"));
    expect(colorPicker.toJSON()).toMatchSnapshot();
  });
});
