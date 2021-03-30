import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import cn from 'classnames';

import pencilIcon from '../../assets/icons/pencil.svg';
import trashIcon from '../../assets/icons/trash.svg';
import AppContext from '../AppContext';
import { openModal, selectChannel } from '../reducers/channels';

function ChannelsPanel(props) {
  const {
    currentChannelId,
    channels,
  } = props;

  const dispatch = useDispatch();

  const { i18n } = useTranslation(['ru', 'en'], useContext(AppContext).i18n);

  const getButtonClasses = (idChannel) => cn('btn', 'nav-link', 'btn-block', 'mb-2', 'text-left', {
    'btn-primary': idChannel === currentChannelId,
    'btn-light': idChannel !== currentChannelId,
  });

  const showModal = (modalType, channelId = null) => dispatch(openModal({ modalType, channelId }));

  return (
    <div className="col-3 border-right">
      <div className="d-flex mb-2">
        <span>{i18n.t('channels-title')}</span>
        <Button type="button" aria-label="add-modal" className="ml-auto" onClick={() => showModal('newChannel')}>+</Button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill text-break">
        {channels.map(({ name, id, removable }) => (
          <li key={id} className="nav-item d-flex">
            <Button type="button" className={getButtonClasses(id)} onClick={() => dispatch(selectChannel(id))}>{name}</Button>
            {removable ? (
              <>
                <Button
                  type="button"
                  aria-label="edit-modal"
                  className="mb-2 ml-2 btn-light"
                  onClick={() => showModal('editChannel', id)}
                >
                  <img src={pencilIcon} alt="Edit shannel" />
                </Button>
                <Button
                  variant="secondary"
                  aria-label="delete-modal"
                  className="mb-2 ml-2 btn-light"
                  onClick={() => showModal('deleteChannel', id)}
                >
                  <img src={trashIcon} alt="Delete shannel" />
                </Button>
              </>
            ) : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChannelsPanel;
