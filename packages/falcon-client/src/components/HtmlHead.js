import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

export default function HtmlHead({ htmlLang }) {
  return <Helmet htmlAttributes={{ lang: htmlLang }} />;
}

HtmlHead.propTypes = {
  htmlLang: PropTypes.string.isRequired
};
