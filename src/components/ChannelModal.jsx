import React, { useContext } from 'react';
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
import { closeModal, removeChannel, selectChannel } from '../reducers/channelsPanel';

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
  },
  deleteChannel: {
    title: 'remove channel',
    handler: async (channelId) => {
      const url = routes.channelPath(channelId);
      await axios.delete(url);
    },
  },
};

const isOpen = (modalType) => modalMapping[modalType] ? true : false; // eslint-disable-line

const currentChannelIdSelector = (store) => store.channelsPanel.modalChannelId;

const allChannelsSelector = (store) => store.channelsPanel.channels;

const channelDataSelector = createSelector([
  currentChannelIdSelector,
  allChannelsSelector,
], (id, channels) => channels
  .find((channel) => channel.id === id) || {});

const existChannelNamesSelector = createSelector([
  channelDataSelector,
  allChannelsSelector,
], (channelData, channels) => channels
  .filter((channel) => channel.id !== channelData.id)
  .map(({ name }) => name));

function ChannelModal() {
  const modalType = useSelector((store) => store.channelsPanel.modalType);
  const channelId = useSelector((store) => store.channelsPanel.modalChannelId);
  const channelData = useSelector(channelDataSelector);
  const existChannelNames = useSelector(existChannelNamesSelector);
  const currentChannelId = useSelector((store) => store.channelsPanel.currentChannelId);

  const { defaultChannelId } = useContext(AppContext);

  const dispatch = useDispatch();

  const userName = 'user';

  const { t } = useTranslation();

  const formSchema = yup.object().shape({
    channelName: yup.string()
      .max(15, 'Too Long!')
      .required('Required')
      .notOneOf(existChannelNames, 'Already exist'),
  });

  const currentModal = modalType ? modalMapping[modalType] : {};

  const saveEdit = async (values, form) => {
    try {
      const response = await currentModal.handler(channelId, values);
      console.log(response);
      form.resetForm({});
      form.setStatus({ success: true });
      dispatch(closeModal());
    } catch (error) {
      form.setStatus({ success: false });
      form.setSubmitting(false);
      form.setErrors({ submit: error.message });
    }
  };

  const deleteChannel = async (form) => {
    try {
      const response = await currentModal.handler(channelId);
      console.log(response);
      form.setStatus({ success: true });
      dispatch(removeChannel(channelId));
      dispatch(closeModal());
      if (channelId === currentChannelId) {
        dispatch(selectChannel(defaultChannelId));
      }
    } catch (error) {
      form.setStatus({ success: false });
      form.setSubmitting(false);
      form.setErrors({ submit: error.message });
    }
  };

  const renderEditForm = () => (
    <Formik
      enableReinitialize
      initialValues={{
        channelName: channelData.name,
        authorName: userName,
      }}
      initialStatus={{
        success: true,
      }}
      validationSchema={formSchema}
      onSubmit={saveEdit}
    >
      {(form) => (
        <Modal show={isOpen(modalType)} onHide={() => dispatch(closeModal())}>
          <Modal.Header closeButton>
            <Modal.Title>{t(currentModal.title)}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="form-group">
                <Field name="channelName">
                  {({ field }) => (
                    <input
                      type="text"
                      aria-label="channel-name"
                      disabled={form.isSubmitting}
                      className={cn('mb-2', 'form-control', { 'is-invalid': !_.isEmpty(form.errors) })}
                      {...field} // eslint-disable-line react/jsx-props-no-spreading
                    />
                  )}
                </Field>
                <div className="d-block invalid-feedback">
                  {!_.isEmpty(form.errors) ? t(`errors.channelName.${form.errors.channelName}`) : ''}
                </div>
                <div className="d-flex justify-content-end">
                  <Button aria-label="cancel" variant="secondary" className="mr-2" onClick={() => dispatch(closeModal())}>
                    {t('cancel')}
                  </Button>
                  <Button type="submit" aria-label="channel-submit" disabled={form.isSubmitting}>{t('submit')}</Button>
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
        <Modal show={isOpen(modalType)} onHide={() => dispatch(closeModal())}>
          <Modal.Header closeButton>
            <Modal.Title>{t(currentModal.title)}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="form-group">
                <div className="d-flex justify-content-end">
                  <Button variant="secondary" className="mr-2" onClick={() => dispatch(closeModal())}>
                    {t('cancel')}
                  </Button>
                  <Button className="btn-danger" disabled={form.isSubmitting} onClick={() => deleteChannel(form)}>{t('delete')}</Button>
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

  return (
    <>
      {modalRenderMapping[modalType] && modalRenderMapping[modalType]()}
    </>
  );
}

export default ChannelModal;
