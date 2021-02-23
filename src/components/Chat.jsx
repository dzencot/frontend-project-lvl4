// /* eslint-disable react/prefer-stateless-function */
import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import axios from 'axios';
import routes from '../routes';

const mapStateToProps = (state) => state;

function Chat(props) {
  const { messages, userName, currentChannelId } = props;
  const currentMessages = messages.filter(({ channelId }) => channelId === currentChannelId);

  const textInput = useRef(null);

  useEffect(() => {
    textInput.current.focus();
  }, [currentChannelId]);

  const onSubmit = async (values, form) => {
    const url = routes.channelMessagesPath(currentChannelId);
    try {
      const body = {
        data: {
          attributes: {
            text: values.message,
            authorName: values.authorName,
            channelId: currentChannelId,
          },
        },
      };
      await axios.post(url, body);
      form.resetForm({});
      form.setStatus({ success: true });
    } catch (error) {
      // error.clientMessage = `Can't send message in channel id ${values.channelId}`;
      form.setStatus({ success: false });
      form.setSubmitting(false);
      form.setErrors({ submit: error.message });
    }
    textInput.current.focus();
  };

  return (
    <div className="col h-100">
      <div className="d-flex flex-column h-100">
        <div id="messages-box" className="chat-messages overflow-auto mb-3">
          {currentMessages.map((message) => (
            <div key={message.id}>
              <b>{message.authorName}</b>
              :
              {message.text}
            </div>
          ))}
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
            onSubmit={onSubmit}
          >
            {(form) => (
              <Form>
                <div className="input-group">
                  <Field name="message">
                    {({ field }) => (
                      <input
                        ref={textInput}
                        type="text"
                        aria-label="message"
                        disabled={form.isSubmitting}
                        className={cn('mr-2', 'form-control', { 'is-invalid': !form.status.success })}
                        {...field} // eslint-disable-line react/jsx-props-no-spreading
                      />
                    )}
                  </Field>
                  <button type="submit" aria-label="message-submit" disabled={form.isSubmitting} className="btn btn-primary">Submit</button>
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

export default connect(mapStateToProps)(Chat);
