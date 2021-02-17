// /* eslint-disable react/prefer-stateless-function */
import React from 'react';
import cn from 'classnames';
import { connect, useSelector, useState } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import * as actions from '../reducers';
import routes from '../routes';

const mapStateToProps = (state) => {
  // const props = {
  //   messages: state.messages,
  // };
  return state;
};

const onSubmit = async (selectedChannelId, values, { setSubmitting, setErrors, setStatus, resetForm }) => {
  const url = routes.channelMessagesPath(selectedChannelId);
  try {
    const body = {
      data: {
        attributes: {
          text: values.message,
          authorName: values.authorName,
          channelId: selectedChannelId,
        },
      },
    };
    const response = await axios.post(url, body);
    console.log('response: ', response);
    resetForm({});
    setStatus({ success: true });
  } catch (error) {
    // error.clientMessage = `Can't send message in channel id ${values.channelId}`;
    setStatus({ success: false });
    setSubmitting(false);
    setErrors({ submit: error.message });
  }
};

class Chat extends React.Component {
  renderMessages = (messages) => {
    // const { messages } = store.getState();
    // const messages = useSelector((state) => state.messages);

    return messages.map((message) => (
      <div key={message.id}>
        <b>{message.authorName}</b>
        :
        {message.text}
      </div>
    ));
  }


  render() {
    const { messages, userName, selectedChannelId } = this.props;
    return (
      <div className="col h-100">
        <div className="d-flex flex-column h-100">
          <div id="messages-box" className="chat-messages overflow-auto mb-3">
            {this.renderMessages(messages)}
          </div>
          <div className="mt-auto">
            <Formik
              initialValues={{
                message: '',
                authorName: userName,
              }}
              initialStatus={{
                success: true,
              }}
              onSubmit={(...params) => onSubmit(selectedChannelId, ...params)}
            >
              {(form) => (
                <Form>
                  <div className="input-group">
                    <Field name="message">
                      {({ field }) => (
                        <input
                          type="text"
                          disabled={form.isSubmitting}
                          className={cn('mr-2', 'form-control', { 'is-invalid': !form.status.success })}
                          {...field} // eslint-disable-line react/jsx-props-no-spreading
                        />
                      )}
                    </Field>
                    <button type="submit" disabled={form.isSubmitting} className="btn btn-primary">Submit</button>
                    <div className="d-block invalid-feedback">
                      {!form.status.success ? form.errors.submit : ''}
                      &nbsp;
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Chat);
