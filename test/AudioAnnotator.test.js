import assert from 'assert';
import React from 'react';
import { mount, shallow } from 'enzyme';
import nock from 'nock';

import AudioAnnotator from '../src/AudioAnnotator';

describe('minimal testing of AudioAnnotator component', function () {
    this.timeout(20000);

    it('mounts properly with all scripts', () => {
        let props = {
            app_token: 'test',
            match: {
                params: {
                    annotation_task_id: 1
                }
            }
        };
        let wrapper = mount(<AudioAnnotator {...props}/>);
        assert.deepEqual(document.querySelectorAll('script').length, 14);
        wrapper.unmount();
    });
});
