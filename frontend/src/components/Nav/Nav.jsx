import React from 'react';

import { Button, Container, Navbar } from 'react-bootstrap';
import { useAuth } from '../../hooks/hooks';
import { useTranslation } from 'react-i18next';

const Nav = () => {
  const { t } = useTranslation();
  const { user, logOut } = useAuth('');
  return (
    <Navbar className="shadow-sm bg-white" bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">{t('chatLogo')}</Navbar.Brand>
        {user ? (
          <Button type="button" onClick={logOut}>
            {t('exitButton')}
          </Button>
        ) : null}
      </Container>
    </Navbar>
  );
};

export default Nav;
