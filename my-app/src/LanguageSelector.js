import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSelector({ setLanguage }) {
  const { t } = useTranslation();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setDropdownVisible(false);
  };

  return (
    <div className="language-selector">
      <button onClick={toggleDropdown}>{t('languages')}</button>
      {dropdownVisible && (
        <ul className="language-dropdown">
          <li onClick={() => handleLanguageChange('sk')}>{t('slovak')}</li>
          <li onClick={() => handleLanguageChange('cs')}>{t('czech')}</li>
          <li onClick={() => handleLanguageChange('en')}>{t('english')}</li>
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;
