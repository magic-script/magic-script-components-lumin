//
import React from "react";
import { create } from "react-test-renderer";
import { TimePicker } from "magic-script-components";

describe("TimePicker component", () => {
  test("Matches the snapshot", () => {
    const timePicker = create(<TimePicker label="Test TimePicker" />);
    expect(timePicker.toJSON()).toMatchSnapshot();
  });
});
