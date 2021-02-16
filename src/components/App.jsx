import React, { useContext } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';
import Chat from './Chat';
import AppContext from '../AppContext';
import { selectChannel } from '../api';
import { toggleEditChannelModal } from '../reducers';
import routes from '../routes';

const mapStateToProps = state => {
  return state;
};

const closeEditChannelModal = (dispatch, form) => {
  form.resetForm();
  dispatch(toggleEditChannelModal(false));
};

const createChannel = async (authorName, channelName) => {
  const url = routes.channelsPath();
  const body = {
    data: {
      attributes: {
        name: channelName,
        createdBy: authorName,
      },
    },
  };
  const response = await axios.post(url, body);
  return response;
};

const updateChannel = async (authorName, channelName, channelId) => {
  const url = routes.channelPath(channelId);
  const body = {
    data: {
      attributes: {
        name: channelName,
        createdBy: authorName,
      },
    },
  };
  const response = await axios.put(url, body);
  return response;
};

const onSubmit = (dispatch) => async (values, { setSubmitting, setErrors, setStatus, resetForm }) => {
  const { authorName, channelName, id } = values;
  try {
    const response = !id
      ? await createChannel(authorName, channelName)
      : await updateChannel(authorName, channelName, id);
    console.log('response: ', response);
    resetForm({});
    setStatus({ success: true });
    dispatch(toggleEditChannelModal(false));
  } catch (error) {
    // error.clientMessage = `Can't send message in channel id ${values.channelId}`;
    setStatus({ success: false });
    setSubmitting(false);
    setErrors({ submit: error.message });
  }
};

class App extends React.Component {
  render() {
    const { channels, store, isEditChannel } = this.props;
    const { userName } = this.context;

    const getButtonClasses = (idChannel) => {
      const { selectedChannelId } = store.getState();
      return cn('btn', 'nav-link', 'btn-block', 'mb-2', 'text-left', {
        'btn-primary': idChannel === selectedChannelId,
        'btn-light': idChannel !== selectedChannelId,
      });
    };

    return (
      <>
        <div className="row h-100 pb-3">
          <div className="col-3 border-right">
            <div className="d-flex mb-2">
              <span>Channels</span>
              <button type="button" className="ml-auto p-0 btn btn-link" onClick={() => store.dispatch(toggleEditChannelModal(true))}>+</button>
            </div>
            <ul className="nav flex-column nav-pills nav-fill">
              {channels.map(({ name, id }) => (
                <li key={id} className="nav-item">
                  <button type="button" className={getButtonClasses(id)} onClick={() => selectChannel(id)(store.dispatch)}>{name}</button>
                </li>
              ))}
            </ul>
          </div>
          <Chat userName={userName} store={store} />
        </div>
        <Formik
          initialValues={{
            channelName: '',
            authorName: userName,
          }}
          initialStatus={{
            success: true,
          }}
          onSubmit={onSubmit(store.dispatch)}
        >
          {(form) => (
            <Modal show={isEditChannel} onHide={() => closeEditChannelModal(store.dispatch, form)}>
              <Modal.Header closeButton>
                <Modal.Title>Add channel</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <div className="form-group">
                    <Field name="channelName">
                      {({ field }) => (
                        <input
                          type="text"
                          disabled={form.isSubmitting}
                          className={cn('mb-2', 'form-control', { 'is-invalid': !form.status.success })}
                          {...field} // eslint-disable-line react/jsx-props-no-spreading
                        />
                      )}
                    </Field>
                    <div className="d-block invalid-feedback">
                      {!form.status.success ? form.errors.submit : ''}
                    </div>
                    <div className="d-flex justify-content-end">
                      <Button variant="secondary" className="mr-2" onClick={() => closeEditChannelModal(store.dispatch, form)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={form.isSubmitting}>Submit</Button>
                    </div>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          )}
        </Formik>
      </>
    );
  }
}
App.contextType = AppContext;

export default connect(mapStateToProps)(App);
