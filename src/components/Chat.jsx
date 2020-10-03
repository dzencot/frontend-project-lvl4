/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchMessages } from '../reducers.js';

class Chat extends React.Component {
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
            <form noValidate="" className="">
              <div className="form-group">
                <div className="input-group">
                  <input name="body" className="form-control" value="" />
                  <div className="d-block invalid-feedback">&nbsp;</div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Chat;
