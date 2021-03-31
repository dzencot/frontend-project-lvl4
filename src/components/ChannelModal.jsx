import React, { useContext, useEffect, useRef } from 'react';
import * as yup from 'yup';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';
import axios from 'axios';
import _ from 'lodash';
import cn from 'classnames';

import AppContext from '../AppContext';
import routes from '../routes';
import { removeChannel, selectChannel } from '../reducers/channels';
import { closeModal } from '../reducers/modal';

const modalMapping = {
  newChannel: {
    title: 'add channel',
    handler: async (channelId, values) => {
      const url = routes.channelsPath();
      const body = {
        data: {
          attributes: {
            name: values.channelName,
            createdBy: values.authorName,
          },
        },
      };
      const response = await axios.post(url, body);
      return response;
    },
    inputEffect: (ref) => ref?.current?.focus(),
  },
  editChannel: {
    title: 'edit channel',
    handler: async (channelId, values) => {
      const url = routes.channelPath(channelId);
      const body = {
        data: {
          attributes: {
            id: channelId,
            name: values.channelName,
            editedBy: values.authorName,
          },
        },
      };
      const response = await axios.patch(url, body);
      return response;
    },
    inputEffect: (ref) => ref?.current?.select(),
  },
  deleteChannel: {
    title: 'remove channel',
    handler: async (channelId) => {
      const url = routes.channelPath(channelId);
      await axios.delete(url);
    },
    inputEffect: () => {},
  },
};


const currentChannelIdSelector = (store) => store.modal.modalChannelId;

const allChannelsSelector = (store) => store.channels.list;

const channelDataSelector = createSelector([
  currentChannelIdSelector,
  allChannelsSelector,
], (id, channels) => channels
  .find((channel) => channel.id === id));

const existChannelNamesSelector = createSelector([
  channelDataSelector,
  allChannelsSelector,
], (channelData, channels) => channels
  .filter((channel) => channel.id !== channelData?.id)
  .map(({ name }) => name));

function ChannelModal() {
  const modalType = useSelector((store) => store.modal.modalType);
  const channelId = useSelector((store) => store.modal.modalChannelId);
  const channelData = useSelector(channelDataSelector);
  const existChannelNames = useSelector(existChannelNamesSelector);

  const dispatch = useDispatch();

  const { userName, i18n: i18nextInstance } = useContext(AppContext);

  const { i18n } = useTranslation(['ru', 'en'], { i18n: i18nextInstance });

  const channelNameInput = useRef(null);

  const formSchema = yup.object().shape({
    channelName: yup.string()
      .trim()
      .max(15, 'Too Long!')
      .required('Required')
      .notOneOf(existChannelNames, 'Already exist'),
  });

  const currentModal = modalType ? modalMapping[modalType] : null;
  useEffect(() => currentModal?.inputEffect(channelNameInput), [modalType]);

  const saveEdit = async (values, form) => {
    try {
      const response = await currentModal.handler(channelId, values);
      form.resetForm({});
      form.setStatus({ success: true });
      dispatch(closeModal());
      if (modalType === 'newChannel') {
        dispatch(selectChannel(response.data.data.attributes.id));
      }
    } catch (error) {
      form.setStatus({ success: false });
      form.setSubmitting(false);
      form.setErrors({ submit: error.message });
    }
  };

  const deleteChannel = async (form) => {
    try {
      await currentModal.handler(channelId);
      form.setStatus({ success: true });
      dispatch(removeChannel(channelId));
      dispatch(closeModal());
    } catch (error) {
      form.setStatus({ success: false });
      form.setSubmitting(false);
      form.setErrors({ submit: error.message });
    }
  };

  const getErrorMessage = (error) => {
    if (!_.isEmpty(error.submit)) {
      return i18n.t(`errors.submit.${error.submit}`);
    }
    if (!_.isEmpty(error.channelName)) {
      return i18n.t(`errors.channelName.${error.channelName}`);
    }
    return '';
  };

  const renderEditForm = () => (
    <Formik
      enableReinitialize
      initialValues={{
        channelName: channelData?.name ?? '',
        authorName: userName,
      }}
      initialStatus={{
        success: true,
      }}
      validationSchema={formSchema}
      onSubmit={saveEdit}
    >
      {(form) => (
        <Modal show onHide={() => dispatch(closeModal())}>
          <Modal.Header closeButton>
            <Modal.Title>{i18n.t(currentModal?.title)}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="form-group">
                <Field
                  innerRef={channelNameInput}
                  name="channelName"
                  autoFocus
                  type="text"
                  aria-label="channel-name"
                  disabled={form.isSubmitting}
                  className={cn('mb-2', 'form-control', { 'is-invalid': !_.isEmpty(form.errors) })}
                />
                <div className="d-block invalid-feedback">
                  {!_.isEmpty(form.errors) && getErrorMessage(form.errors)}
                </div>
                <div className="d-flex justify-content-end">
                  <Button aria-label="cancel" variant="secondary" className="mr-2" onClick={() => dispatch(closeModal())}>
                    {i18n.t('cancel')}
                  </Button>
                  <Button type="submit" aria-label="channel-submit" disabled={form.isSubmitting}>{i18n.t('submit')}</Button>
                </div>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Formik>
  );

  const renderDeleteForm = () => (
    <Formik
      enableReinitialize
      initialStatus={{
        success: true,
      }}
    >
      {(form) => (
        <Modal show onHide={() => dispatch(closeModal())}>
          <Modal.Header closeButton>
            <Modal.Title>{i18n.t(currentModal?.title)}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="form-group">
                <div className="d-block invalid-feedback">
                  {!_.isEmpty(form.errors) && getErrorMessage(form.errors)}
                </div>
                <div className="d-flex justify-content-end">
                  <Button variant="secondary" className="mr-2" onClick={() => dispatch(closeModal())}>
                    {i18n.t('cancel')}
                  </Button>
                  <Button className="btn-danger" disabled={form.isSubmitting} onClick={() => deleteChannel(form)}>{i18n.t('delete')}</Button>
                </div>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Formik>
  );

  const modalRenderMapping = {
    newChannel: renderEditForm,
    editChannel: renderEditForm,
    deleteChannel: renderDeleteForm,
  };

  return modalRenderMapping[modalType]();
}

export default ChannelModal;
