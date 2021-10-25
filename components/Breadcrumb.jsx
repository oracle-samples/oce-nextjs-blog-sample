/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

/**
 * Component representing a single breadcrumb to be rendered in breadcrumbs.
 *
 * @param {object} linkParamsHref
 *  contains the object to set for the "href" parameter for the "Link"
 *  component when not empty, a "Link" component is added arround the text,
 *  when empty the text is rendered on its own (i.e. no hyperlinking)
 * @param {string} text the text for the breadcrumb
 */
const Breadcrumb = (props) => {
  const { linkParamsHref, text } = props;
  const includeLinkParams = Object.keys(linkParamsHref).length > 0;
  return (
    <li>
      {includeLinkParams
        ? <Link href={linkParamsHref}>{text}</Link>
        : text}
    </li>
  );
};

export default Breadcrumb;

/*
 * Define the type of data used in this component.
 */
Breadcrumb.propTypes = {
  linkParamsHref: PropTypes.shape({}),
  linkParamsAs: PropTypes.shape({}),
  text: PropTypes.string.isRequired,
};

Breadcrumb.defaultProps = {
  linkParamsHref: {},
  linkParamsAs: {},
};
