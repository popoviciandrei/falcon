import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

export const HtmlHead = ({ htmlLang }) => <Helmet htmlAttributes={{ lang: htmlLang }} />;
HtmlHead.propTypes = {
  htmlLang: PropTypes.string.isRequired
};
