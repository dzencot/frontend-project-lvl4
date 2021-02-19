import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import cn from 'classnames';
import Chat from './Chat';
import AppContext from '../AppContext';
import * as actions from '../reducers';
import routes from '../routes';
import pencilIcon from '../../assets/icons/pencil.svg';
import trashIcon from '../../assets/icons/trash.svg';

const mapStateToProps = (state) => state;

const closeEditChannelModal = (dispatch, form) => {
  form.resetForm();
  dispatch(actions.closeEditChannelModal());
};

const closeDeleteChannelModal = (dispatch, form) => {
  form.resetForm();
  dispatch(actions.closeDeleteChannelModal());
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
        id: channelId,
        name: channelName,
        editedBy: authorName,
      },
    },
  };
  const response = await axios.patch(url, body);
  return response;
};

const onSubmit = (dispatch, editChannelId) => async (values, form) => {
  const { authorName, channelName } = values;
  try {
    const response = !editChannelId
      ? await createChannel(authorName, channelName)
      : await updateChannel(authorName, channelName, editChannelId);
    console.log('response: ', response);
    form.resetForm({});
    form.setStatus({ success: true });
    dispatch(actions.closeEditChannelModal());
  } catch (error) {
    // error.clientMessage = `Can't send message in channel id ${values.channelId}`;
    form.setStatus({ success: false });
    form.setSubmitting(false);
    form.setErrors({ submit: error.message });
  }
};

const deleteChannel = (dispatch, deleteChannelId) =>
  async (values, form) => { // eslint-disable-line
    const url = routes.channelPath(deleteChannelId);
    try {
      await axios.delete(url);
      form.resetForm({});
      form.setStatus({ success: true });
      dispatch(actions.closeDeleteChannelModal());
    } catch (error) {
      form.setStatus({ success: false });
      form.setSubmitting(false);
      form.setErrors({ submit: error.message });
    }
  };

class App extends React.Component {
  render() {
    const {
      channels,
      store,
      isEditChannel,
      isDeleteChannel,
      editChannelId,
      deleteChannelId,
      currentChannelId,
    } = this.props;
    const { userName } = this.context;

    const getButtonClasses = (idChannel) => { // eslint-disable-line
      // const { currentChannelId } = store.getState();
      return cn('btn', 'nav-link', 'btn-block', 'mb-2', 'text-left', {
        'btn-primary': idChannel === currentChannelId,
        'btn-light': idChannel !== currentChannelId,
      });
    };

    return (
      <>
        <div className="row h-100 pb-3">
          <div className="col-3 border-right">
            <div className="d-flex mb-2">
              <span>Channels</span>
              <Button type="button" aria-label="add-modal" className="ml-auto" onClick={() => store.dispatch(actions.openEditChannelModal())}>+</Button>
            </div>
            <ul className="nav flex-column nav-pills nav-fill">
              {channels.map(({ name, id, removable }) => (
                <li key={id} className="nav-item d-flex">
                  <Button type="button" className={getButtonClasses(id)} onClick={() => store.dispatch(actions.selectChannel(id))}>{name}</Button>
                  {removable ? (
                    <>
                      <Button
                        type="button"
                        aria-label="edit-modal"
                        className="mb-2 ml-2 btn-light"
                        onClick={() => store.dispatch(actions.openEditChannelModal(id))}
                      >
                        <img src={pencilIcon} alt="Edit shannel" />
                      </Button>
                      <Button
                        variant="secondary"
                        aria-label="delete-modal"
                        className="mb-2 ml-2 btn-light"
                        onClick={() => store.dispatch(actions.openDeleteChannelModal(id))}
                      >
                        <img src={trashIcon} alt="Delete shannel" />
                      </Button>
                    </>
                  ) : ''}
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
          onSubmit={onSubmit(store.dispatch, editChannelId)}
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
                          aria-label="channel-name"
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
                      <Button aria-label="cancel" variant="secondary" className="mr-2" onClick={() => closeEditChannelModal(store.dispatch, form)}>
                        Cancel
                      </Button>
                      <Button type="submit" aria-label="channel-submit" disabled={form.isSubmitting}>Submit</Button>
                    </div>
                  </div>
                </Form>
              </Modal.Body>
            </Modal>
          )}
        </Formik>
        <Formik
          initialValues={{
            channelId: deleteChannelId,
            authorName: userName,
          }}
          initialStatus={{
            success: true,
          }}
          onSubmit={deleteChannel(store.dispatch, deleteChannelId)}
        >
          {(form) => (
            <Modal
              show={isDeleteChannel}
              onHide={() => closeDeleteChannelModal(store.dispatch, form)}
            >
              <Modal.Header closeButton>
                <Modal.Title>Delete channel</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <div className="form-group">
                    <Button variant="secondary" className="mr-2" onClick={() => closeDeleteChannelModal(store.dispatch, form)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={form.isSubmitting}>Delete</Button>
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
