import React, { useEffect, useRef, useContext } from 'react';
import { useSelector } from 'react-redux';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import axios from 'axios';

import routes from '../routes';
import AppContext from '../AppContext';

function MessageForm() {
  const { userName, i18n: i18nextInstance } = useContext(AppContext);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const { i18n } = useTranslation(['ru', 'en'], { i18n: i18nextInstance });

  const textInput = useRef(null);

  const formSchema = yup.object().shape({
    message: yup.string()
      .trim()
      .required('Required'),
  });

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
      form.setStatus({ success: false });
      form.setSubmitting(false);
      form.setErrors({ submit: error.message });
    }
    textInput.current.focus();
  };

  const isError = (form) => !form.status.success && form.errors.submit;

  return (
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
        validationSchema={formSchema}
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
                    className={cn('mr-2', 'form-control', { 'is-invalid': isError(form) })}
                    {...field} // eslint-disable-line react/jsx-props-no-spreading
                  />
                )}
              </Field>
              <button type="submit" aria-label="message-submit" disabled={form.isSubmitting} className="btn btn-primary">{i18n.t('submit')}</button>
              <div className="d-block invalid-feedback">
                {isError(form) ? i18n.t(`errors.${form.errors.submit}`) : ''}
                &nbsp;
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default MessageForm;
