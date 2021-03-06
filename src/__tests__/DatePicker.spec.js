//
import React from "react";
import { create } from "react-test-renderer";
import { DatePicker } from "magic-script-components";

describe("DatePicker component", () => {
  test("Matches the snapshot", () => {
    const datePicker = create(<DatePicker label="Test DatePicker" />);
    expect(datePicker.toJSON()).toMatchSnapshot();
  });
});
