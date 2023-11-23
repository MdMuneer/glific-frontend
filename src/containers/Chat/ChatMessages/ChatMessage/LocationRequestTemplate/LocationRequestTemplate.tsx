import { Button } from '@mui/material';
import LocationIconDark from 'assets/images/icons/Location/Dark.svg?react';
import styles from './LocationRequestTemplate.module.css';
import { ChatMessageType } from '..//ChatMessageType/ChatMessageType';

export interface QuickReplyTemplateProps {
  content: any;
  disabled?: boolean;

  isSimulator?: boolean;
  onSendLocationClick?: any;
}

const payload = {
  type: 'location',
  name: 'location',
  id: 'LOCATION',
  payload: {
    latitude: '41.725556',
    longitude: '-49.946944',
  },
};

export const LocationRequestTemplate = ({
  content,
  disabled = false,
  isSimulator = false,

  onSendLocationClick = () => {},
}: QuickReplyTemplateProps) => {
  const body = content.body.text;
  return (
    <div>
      <div className={styles.MessageContent}>
        <ChatMessageType type="TEXT" body={body} isSimulatedMessage={isSimulator} />
      </div>
      <Button
        variant="text"
        disabled={disabled}
        startIcon={<LocationIconDark />}
        onClick={() => onSendLocationClick({ payload })}
        className={isSimulator ? styles.SimulatorButton : styles.ChatButton}
      >
        Send Location
      </Button>
    </div>
  );
};
