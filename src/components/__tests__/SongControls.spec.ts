import { describe, it, expect, beforeEach } from 'vitest'

import { mount } from '@vue/test-utils'
import SongControls from '../SongControls.vue'

describe('SongControls', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = mount(
            SongControls,
            {
                props: {
                    fileName: 'test',
                    title: 'test',
                    totalSongTime: 70,
                    currentSongTime: 0
                }
            }
        );
    });

    it('renders properly', () => {
        const buttons:any = wrapper.findAll('[data-test$="control"]');
        const title:any = wrapper.find('[data-test="title"]');
        const currentSongTime:any = wrapper.find('[data-test="song-current-time"]');
        const totalSongTime:any = wrapper.find('[data-test="song-total-time"]');

        expect(buttons.length).toBe(3);
        expect(title.text()).toBe('test');
        expect(currentSongTime.text()).toBe('0:00');
        expect(totalSongTime.text()).toBe('1:10');
    });
})
