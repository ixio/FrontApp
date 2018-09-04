import assert from 'assert';
import React from 'react';
import { mount, shallow } from 'enzyme';

import App from '../src/App';
import Navbar from '../src/App';

describe('testing App component', function () {
    this.timeout(20000);
    it('mounts properly with Login when token is not there', () => {
        let wrapper = mount(<App />);
        assert(wrapper.text().includes('Login'), 'Login not found');
        wrapper.unmount();
    });

    it('mounts properly with Navbar when token is there', () => {
        let wrapper = mount(<App />);
        wrapper.setState({app_token: 'testToken'});
        wrapper.update();
        assert(wrapper.find(Navbar).text().includes('Datasets'), 'Navbar linking to datasets not found');
        wrapper.unmount();
    });
});
