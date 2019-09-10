//
import React from "react";
import { create } from "react-test-renderer";

describe("Model component", () => {
  test("Matches the snapshot", () => {
    const props = {modelPath:"", materialPath:"", texturePath:"", textureName:""}
    const model = create(React.createElement("model", props));
    expect(model.toJSON()).toMatchSnapshot();
  });
});
