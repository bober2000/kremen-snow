// React
import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Modal, Box } from 'components/Bulma';
import Brands from 'components/Brands';

// Prop types
const propTypes = {
  
};

// DefaultProps
const defaultProps = {
  
};

// AboutModal
function AboutModal({
  visible,
  onRequestClose,
}){
  // Render
  return (
    <Modal 
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <Box>
        <div className="content">
          <h1 style={styles.title}>Снігоочисна техніка</h1>
          <p>Даний додаток призначений для відслідковування руху снігоприбиральників, посипальників, тракторів в Кременчуці та збір аналітики про їх переміщення.</p>
          <p>Додаток не є комерційним та розроблений винятково силами волонтерів.</p>
          <p>Вихідний код проекту на GitHub: <br/> 
            <a href="https://github.com/snipter/kremen-snow-removing" target="blank">
              https://github.com/snipter/kremen-snow-removing
            </a>
          </p>
          <p><strong>Контакти:</strong></p>
          <p>
            <a href="https://fb.me/snipter" target="blank">https://fb.me/snipter</a><br/>
            <a href="mailto:websnitper@gmail.com" target="blank">websnitper@gmail.com</a>
          </p>
          <Brands />
        </div>
      </Box>
    </Modal>
  );
}

// Style
const styles = {
  title: {
    textAlign: 'center',
  },
}

// Attach prop types
AboutModal.propTypes = propTypes;
AboutModal.defaultProps = defaultProps;

export default AboutModal;