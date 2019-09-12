//
import React from "react";
import { create } from "react-test-renderer";
import { CircleConfirmation } from "magic-script-components";

describe("CircleConfirmation component", () => {
  test("Matches the snapshot", () => {
    const circleConfirmation = create(<CircleConfirmation />);
    expect(circleConfirmation.toJSON()).toMatchSnapshot();
  });
});
