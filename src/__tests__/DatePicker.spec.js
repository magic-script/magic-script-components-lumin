//
import React from "react";
import { create } from "react-test-renderer";

describe("DatePicker component", () => {
  test("Matches the snapshot", () => {
    const props = {label: "Test DatePicker"}
    const datepicker = create(React.createElement("datePicker", props));
    expect(datepicker.toJSON()).toMatchSnapshot();
  });
});
