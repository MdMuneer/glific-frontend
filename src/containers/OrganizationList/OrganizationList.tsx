import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { OutlinedInput } from '@material-ui/core';
import { useMutation, useApolloClient } from '@apollo/client';

import styles from './OrganizationList.module.css';
import { GET_ORGANIZATION_COUNT, FILTER_ORGANIZATIONS } from '../../graphql/queries/Organization';
import {
  DELETE_INACTIVE_ORGANIZATIONS,
  UPDATE_ORGANIZATION_STATUS,
} from '../../graphql/mutations/Organization';
import { List } from '../List/List';
import { setVariables } from '../../common/constants';

import { ReactComponent as OrganisationIcon } from '../../assets/images/icons/Organisation.svg';
import { ReactComponent as ExtensionIcon } from '../../assets/images/icons/extension.svg';

import { setNotification } from '../../common/notification';
import { Dropdown } from '../../components/UI/Form/Dropdown/Dropdown';

export interface OrganizationListProps {}

const queries = {
  countQuery: GET_ORGANIZATION_COUNT,
  filterItemsQuery: FILTER_ORGANIZATIONS,
  deleteItemQuery: DELETE_INACTIVE_ORGANIZATIONS,
};

export const OrganizationList: React.SFC<OrganizationListProps> = () => {
  const { t } = useTranslation();
  const client = useApolloClient();
  const [orgName, setOrgName] = useState('');
  const history = useHistory();

  const columnNames = ['NAME', 'STATUS', 'ACTIONS'];

  const getName = (label: string, insertedAt: any) => (
    <div className={styles.LabelContainer}>
      <p className={styles.LabelText}>
        {label}
        <br />
        <span className={styles.SubLabelText}>{moment(insertedAt).format('DD MMM YYYY')}</span>
      </p>
    </div>
  );

  const [updateOrganizationStatus] = useMutation(UPDATE_ORGANIZATION_STATUS, {
    onCompleted: () => {
      setNotification(client, 'Organization updated successfully');
    },
  });

  const getStatus = (id: any, status: string) => {
    const options = [
      { id: 'INACTIVE', label: 'Inactive' },
      { id: 'APPROVED', label: 'Approved' },
      { id: 'ACTIVE', label: 'Active' },
      { id: 'SUSPENDED', label: 'Suspended' },
      { id: 'READY_TO_DELETE', label: <div className={styles.Delete}>Ready to delete</div> },
    ];

    const languageField = {
      onChange: (event: any) => {
        updateOrganizationStatus({
          variables: {
            updateOrganizationId: id,
            status: event.target.value,
          },
        });
      },
      value: status,
    };
    return <Dropdown options={options} placeholder="" field={languageField} />;
  };

  const columnStyles: any = [styles.Label, styles.Status, styles.Actions];

  const getColumns = ({ id, name, insertedAt, status }: any) => ({
    name: getName(name, insertedAt),
    isApproves: getStatus(id, status),
  });

  const columnAttributes = {
    columnNames,
    columns: getColumns,
    columnStyles,
  };

  const listIcon = <OrganisationIcon className={styles.OrgIcon} />;
  const extensionIcon = <ExtensionIcon className={styles.ExtensionIcon} />;

  const [deleteInActiveOrg] = useMutation(DELETE_INACTIVE_ORGANIZATIONS);

  const handleDeleteInActiveOrg = ({ payload, refetch, setDeleteItemID }: any) => {
    deleteInActiveOrg({ variables: payload, refetchQueries: refetch });
    // Setting delete item id to null to prevent showing dialogue again
    setDeleteItemID(null);
    setNotification(client, 'Organization deleted successfully');
  };

  const deleteDialogue = (id: any, name: any) => {
    const component = (
      <div>
        <p className={styles.DialogSubText}>
          This action cannot be undone. Please enter the name of organization to proceed
        </p>
        <OutlinedInput
          fullWidth
          placeholder="Organization name"
          onChange={(event: any) => setOrgName(event.target.value)}
          className={styles.DialogSubInput}
        />
      </div>
    );

    const isConfirmed = orgName === name;
    const payload = {
      isConfirmed,
      deleteOrganizationID: id,
    };
    return {
      component,
      handleOkCallback: (val: any) => handleDeleteInActiveOrg({ payload, ...val }),
      isConfirmed,
    };
  };

  const addExtension = (id: any) => {
    history.push({ pathname: `/organizations/${id}/extensions` });
  };

  const dialogMessage = deleteDialogue;

  const additionalActions = [
    {
      icon: extensionIcon,
      parameter: 'id',
      label: t('Extension code'),
      dialog: addExtension,
    },
  ];
  const addNewButton = { show: false, label: 'Add New' };
  const restrictedAction = () => ({ delete: false, edit: false });

  return (
    <List
      title={t('Organizations')}
      listItem="organizations"
      listItemName="organization"
      pageLink="organization"
      listIcon={listIcon}
      dialogMessage={dialogMessage}
      refetchQueries={{
        query: FILTER_ORGANIZATIONS,
        variables: setVariables(),
      }}
      additionalAction={additionalActions}
      button={addNewButton}
      restrictedAction={restrictedAction}
      searchParameter="name"
      editSupport={false}
      {...queries}
      {...columnAttributes}
    />
  );
};

export default OrganizationList;
