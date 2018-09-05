import assert from 'assert';
import React from 'react';
import { mount, shallow } from 'enzyme';
import jsdom from 'jsdom';

import App from '../src/App';
import Navbar from '../src/App';
import DatasetList from '../src/DatasetList';
import AnnotationCampaignList from '../src/AnnotationCampaignList';

describe('testing App component', function () {
    this.timeout(20000);

    it('mounts properly with Navbar when token is in state', () => {
        let wrapper = mount(<App />);
        wrapper.setState({app_token: 'testToken'});
        wrapper.update();
        assert(wrapper.find(Navbar).text().includes('Datasets'), 'Navbar linking to datasets not found');
        wrapper.unmount();
    });

    it('mounts properly with Navbar when token is in cookie', () => {
        document.cookie = 'token=testing';
        let wrapper = mount(<App />);
        assert(wrapper.find(Navbar).text().includes('Datasets'), 'Navbar linking to datasets not found');
        wrapper.unmount();
        document.cookie = 'token=;max-age=0';
    });

    it('mounts properly with Login when token is not there', () => {
        let wrapper = mount(<App />);
        assert(wrapper.text().includes('Login'), 'Login not found');
        wrapper.unmount();
    });

    it('testing that Navbar navigation works correctly', () => {
        let wrapper = mount(<App />);
        let changeURL = (url) => { wrapper.find('Router').props().history.push(url) };
        wrapper.setState({app_token: 'testToken'});
        wrapper.update();
        let links = wrapper.find(Navbar).find('a');
        // Testing default page
        assert.deepEqual(wrapper.find(DatasetList).length, 1, 'DatasetList not found as default page');
        // Testing AnnotationCampaignList link
        changeURL(links.at(1).props().href);
        //window.location.assign('http://localhost/annotation-campaign/');
        wrapper.update();
        assert.deepEqual(wrapper.find(DatasetList).length, 0, 'There should be no DatasetList after clicking second Navbar link');
        assert.deepEqual(wrapper.find(AnnotationCampaignList).length, 1, 'AnnotationCampaignList not found after clicking second Navbar link');
        // Testing DatasetList link
        changeURL(links.at(0).props().href);
        wrapper.update();
        assert.deepEqual(wrapper.find(AnnotationCampaignList).length, 0, 'There should be no AnnotationCampaignList after clicking first Navbar link');
        assert.deepEqual(wrapper.find(DatasetList).length, 1, 'DatasetList not found after clicking first Navbar link');
        wrapper.unmount();
    });
});
