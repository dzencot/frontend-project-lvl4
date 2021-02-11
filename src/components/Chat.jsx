// /* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { connect, useSelector, useState } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { sendMessage } from '../api';

const mapStateToProps = (state) => {
  // const props = {
  //   messages: state.messages,
  // };
  return state;
};

class Chat extends React.Component {
  createMessage = (values, store) => {
    const { selectedChannelId } = store.getState();
    sendMessage(selectedChannelId, values)(store.dispatch);
  };

  renderMessages = (messages) => {
    // const { messages } = store.getState();
    // const messages = useSelector((state) => state.messages);

    return messages.map((message, index) => (
      <div key={{ index }}>
        <b>{message.author}</b>: {message.text}
      </div>
    ));
  }


  render() {
    const { messages, store } = this.props;
    // const { messages } = store.getState();
    // const messages = useSelector((state) => state.messages);
    // const messages = [
    //   { author: 'test1', text: 'my text 1' },
    //   { author: 'test2', text: 'my text 2' },
    // ];
    // const dispatch = useDispatch();
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
              }}
              onSubmit={(values) => this.createMessage(values, store)}
            >
              <Form>
                <div className="input-group">
                  <Field name="message">
                    {({ field }) => (
                      <input type="text" className="mr-2 form-control" {...field} />
                    )}
                  </Field>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Chat);
