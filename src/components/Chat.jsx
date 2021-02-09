/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { fetchMessages } from '../reducers.js';
import routes from '../routes';

class Chat extends React.Component {
  sendMessage = (values) => {
    const url = routes.channelMessagesPath(1);
    console.log('url:', url);
    console.log('sendMessage: ', values);
    axios.post(url, {
      data: values,
    }).then((result) => {
      console.log('result:', result);
    });
  }

  render() {
    // const dispatch = useDispatch();
    return (
      <div className="col h-100">
        <div className="d-flex flex-column h-100">
          <div id="messages-box" className="chat-messages overflow-auto mb-3">
            <div>
              <b>Hollis_Kautzer</b>
              : wd
            </div>
            <div>
              <b>Malvina.Dickinson9</b>
              : jkhkjh
            </div>
          </div>
          <div className="mt-auto">
            <Formik
              initialValues={{
                message: '',
              }}
              onSubmit={(values) => this.sendMessage(values)}
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

export default Chat;
