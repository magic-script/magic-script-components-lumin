//
import React from "react";
import { create } from "react-test-renderer";

describe("TimePicker component", () => {
  test("Matches the snapshot", () => {
    const props = {label: "Test TimePicker"}
    const timePicker = create(React.createElement("timePicker", props));
    expect(timePicker.toJSON()).toMatchSnapshot();
  });
});
