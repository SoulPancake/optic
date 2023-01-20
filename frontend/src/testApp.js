import React from "react";
import { shallow } from "enzyme";
import App from "./App";

describe("App", () => {
  it("should update currentPlaceID when handleMarkerClick is called", () => {
    const wrapper = shallow(<App />);
    wrapper.setState({ currentPlaceID: 0 });
    wrapper.instance().handleMarkerClick(1, 0, 0);
    expect(wrapper.state("currentPlaceID")).toBe(1);
  });
});
