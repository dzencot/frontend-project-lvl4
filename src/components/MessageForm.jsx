import React, { useEffect, useRef } from 'react';
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

function MessageForm(props) {
  const { userName, currentChannelId } = props;

  const { t } = useTranslation();

  const textInput = useRef(null);

  const formSchema = yup.object().shape({
    message: yup.string()
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
              <button type="submit" aria-label="message-submit" disabled={form.isSubmitting} className="btn btn-primary">{t('submit')}</button>
              <div className="d-block invalid-feedback">
                {isError(form) ? t(`errors.${form.errors.submit}`) : ''}
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
