import React from 'react';

import {render} from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { SearchDialogBox } from './SearchDialogBox';

const defaultProps = {
  title: 'Search Box',
  handleOk: jest.fn(),
  handleCancel: jest.fn(),
  options: [{ id: '1', label: 'something' }],
  selectedOptions: ['1'],
};

let wrapper:any;

beforeEach(()=>{
   wrapper = render(
    <MockedProvider>
      <SearchDialogBox {...defaultProps} />
    </MockedProvider>
  );
})


test('it should render the title correctly', () => {
  expect(wrapper.getByTestId("dialogTitle")).toHaveTextContent('Search Box')
});

test('it should contain the selected option', () => {
  expect(wrapper.getByTestId("searchChip").querySelector('span')).toHaveTextContent('something');
});


