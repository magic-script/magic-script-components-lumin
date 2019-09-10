//
import React from "react";
import { create } from "react-test-renderer";

describe("CircleConfirmation component", () => {
  test("Matches the snapshot", () => {
    const circleConfirmation = create(React.createElement("circleConfirmation"));
    expect(circleConfirmation.toJSON()).toMatchSnapshot();
  });
});
