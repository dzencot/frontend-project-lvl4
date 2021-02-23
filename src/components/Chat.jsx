// /* eslint-disable react/prefer-stateless-function */
import React from 'react';
import cn from 'classnames';
import { connect } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import routes from '../routes';

const mapStateToProps = (state) => state;

const onSubmit = async (selectedChannelId, values, form) => {
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
    form.resetForm({});
    form.setStatus({ success: true });
  } catch (error) {
    // error.clientMessage = `Can't send message in channel id ${values.channelId}`;
    form.setStatus({ success: false });
    form.setSubmitting(false);
    form.setErrors({ submit: error.message });
  }
};

class Chat extends React.Component {
  renderMessages = (messages) => { // eslint-disable-line
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
    const { messages, userName, currentChannelId } = this.props;
    const currentMessages = messages.filter(({ channelId }) => channelId === currentChannelId);
    return (
      <div className="col h-100">
        <div className="d-flex flex-column h-100">
          <div id="messages-box" className="chat-messages overflow-auto mb-3">
            {this.renderMessages(currentMessages)}
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
              onSubmit={(...params) => onSubmit(currentChannelId, ...params)}
            >
              {(form) => (
                <Form>
                  <div className="input-group">
                    <Field name="message">
                      {({ field }) => (
                        <input
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
}

export default connect(mapStateToProps)(Chat);
