import { shallow } from "enzyme";
import React from 'react';
import Dashboard from "./index";
describe("test 1", () => {

it("App renders without crashing", () => {
    const tree = shallow(<Dashboard />);
    expect(tree.find('h1').text()).toBe('Dashboard!');
});
});
