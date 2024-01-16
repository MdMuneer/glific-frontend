import { render, screen, fireEvent, waitFor, getByTestId } from '@testing-library/react';
import UserEvent, { userEvent } from '@testing-library/user-event';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router, MemoryRouter, Route, Routes } from 'react-router-dom';

import { ORGANISATION_MOCKS } from '../SettingList.test.helper';
import { Organisation } from './Organisation';

const mocks = ORGANISATION_MOCKS;

const wrapper = (
  <MockedProvider mocks={mocks} addTypename={false}>
    <MemoryRouter initialEntries={['/settings/organization']}>
      <Organisation />
    </MemoryRouter>
  </MockedProvider>
);

test('it should render the placeholders correctly', async () => {
  const { getByTestId, getByText } = render(wrapper);

  expect(getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(getByTestId('formLayout')).toHaveTextContent('Organisation name');
    expect(getByTestId('formLayout')).toHaveTextContent('Supported languages');
    expect(getByTestId('formLayout')).toHaveTextContent('Default language');
    expect(getByTestId('formLayout')).toHaveTextContent('Organisation phone number');
    expect(getByTestId('formLayout')).toHaveTextContent('Low balance threshold for warning emails');
    expect(getByTestId('formLayout')).toHaveTextContent(
      'Critical balance threshold for warning emails'
    );
    expect(getByTestId('formLayout')).toHaveTextContent('Recieve warning mails?');
  });
});

test('it renders component properly', async () => {
  const { getByText, getByTestId } = render(wrapper);
  // loading is show initially
  expect(getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => {
    expect(getByText('Back to settings')).toBeInTheDocument();
    expect(getByTestId('add-container')).toHaveTextContent('Organisation name');
  });
});

test('it renders component and clicks cancel', async () => {
  const { getByText } = render(wrapper);
  // loading is show initially
  expect(getByText('Loading...')).toBeInTheDocument();
  await waitFor(() => {
    const Button = screen.getByText('Cancel');
    expect(Button).toBeInTheDocument();
    // click on Cancel
    UserEvent.click(Button);
  });
});

test('it renders component in edit mode', async () => {
  const { getByText, getByTestId } = render(
    <MemoryRouter initialEntries={['/organization']}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <Route path="/settings/organization" element={<Organisation />} />
      </MockedProvider>
    </MemoryRouter>
  );
  // loading is show initially
  expect(getByText('Loading...')).toBeInTheDocument();

  //correct values are rendered in the form
  await waitFor(() => {
    const inputElements = screen.getAllByRole('textbox');
    const numberInputElements = screen.getAllByRole('spinbutton');

    const orgName = inputElements[0] as unknown as HTMLInputElement;
    const signaturePhrase = inputElements[1] as unknown as HTMLInputElement;
    const phoneNumber = inputElements[2] as unknown as HTMLInputElement;
    const lowBalanceThreshold = numberInputElements[0] as unknown as HTMLInputElement;
    const criticalBalanceThreshold = numberInputElements[1] as unknown as HTMLInputElement;

    fireEvent.click(phoneNumber);
    expect(orgName?.value).toBe('Glific');
    expect(signaturePhrase?.value).toBe('Please change me, NOW!');
    expect(phoneNumber?.value).toBe('917834811114');
    expect(lowBalanceThreshold?.value).toBe('10');
    expect(criticalBalanceThreshold?.value).toBe('5');
  });

  await waitFor(() => {
    const submit = getByTestId('submitActionButton');
    fireEvent.click(submit);
  });
});

test.only('it submits form correctly', async () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={['/settings/organization']}>
      <MockedProvider mocks={mocks} addTypename={false}>
        <Routes>
          <Route path="/settings/organization" element={<Organisation />} />
        </Routes>
      </MockedProvider>
    </MemoryRouter>
  );

  expect(getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    const inputElements = screen.getAllByRole('textbox');
    const numberInputElements = screen.getAllByRole('spinbutton');

    fireEvent.change(inputElements[0], { target: { value: 'Glific' } });
    fireEvent.change(inputElements[1], { target: { value: 'Please change me, NOW!' } });
    fireEvent.change(numberInputElements[0], { target: { value: '10' } });
    fireEvent.change(numberInputElements[1], { target: { value: '5' } });
  });

  userEvent.click(getByText('Save'));
  console.log(window.location.pathname);

  await waitFor(() => {
    console.log(getByText('Save'));

    console.log(window.location.pathname);
    // expect(getByText('Settings edited successfully!'));
  });
});
