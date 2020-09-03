import React, { useState } from 'react';
import * as Yup from 'yup';
import { Input } from '../../components/UI/Form/Input/Input';
import { FormLayout } from '../Form/FormLayout';
import { ReactComponent as AutomationIcon } from '../../assets/images/icons/Automations/Selected.svg';
import styles from './Automation.module.css';

import {
  CREATE_AUTOMATION,
  UPDATE_AUTOMATION,
  DELETE_AUTOMATION,
} from '../../graphql/mutations/Automation';

import { GET_AUTOMATION } from '../../graphql/queries/Automation';
import { Checkbox } from '../../components/UI/Form/Checkbox/Checkbox';

export interface AutomationProps {
  match: any;
}

const FormSchema = Yup.object().shape({
  shortcode: Yup.string().required('Shortcode is required.'),
});

const dialogMessage = "You won't be able to use this automation again.";

const formFields = [
  {
    component: Input,
    name: 'shortcode',
    type: 'text',
    placeholder: 'Shortcode',
  },
  {
    component: Input,
    name: 'name',
    type: 'text',
    placeholder: 'Name',
  },
  {
    component: Input,
    name: 'keywords',
    type: 'text',
    placeholder: 'Keywords',
    helperText: 'Enter comma separated keywords that trigger this automation',
  },

  {
    component: Checkbox,
    name: 'ignoreKeywords',
    title: 'Ignore Keywords',
  },
];

const automationIcon = <AutomationIcon className={styles.AutomationIcon} />;

const queries = {
  getItemQuery: GET_AUTOMATION,
  createItemQuery: CREATE_AUTOMATION,
  updateItemQuery: UPDATE_AUTOMATION,
  deleteItemQuery: DELETE_AUTOMATION,
};

export const Automation: React.SFC<AutomationProps> = ({ match }) => {
  const [shortcode, setShortcode] = useState('');
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ignoreKeywords, setIgnoreKeywords] = useState(false);

  const states = { shortcode, name, keywords, ignoreKeywords };

  const setStates = ({ shortcode, name, keywords, ignoreKeywords }: any) => {
    setShortcode(shortcode);
    setName(name);
    setKeywords(keywords);
    setIgnoreKeywords(ignoreKeywords);
  };

  const additionalAction = { label: 'Configure', link: '/automation/configure' };

  return (
    <FormLayout
      {...queries}
      match={match}
      states={states}
      setStates={setStates}
      validationSchema={FormSchema}
      listItemName="automation"
      dialogMessage={dialogMessage}
      formFields={formFields}
      redirectionLink="automation"
      cancelLink="automation"
      linkParameter="id"
      listItem="flow"
      icon={automationIcon}
      additionalAction={additionalAction}
      languageSupport={false}
    />
  );
};