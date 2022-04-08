/**
 * Copyright (c) 2022, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

/**
 * Component representing a Topic displayed in the list of topics.
 *
 * @param {string} topic The topic to display
 */
const TopicsListItem = (props) => {
  const { topic } = props;
  const {
    id,
    name,
    description,
    renditionUrls,
  } = topic;

  return (
    // Prefix the link with the basePath to work in environments where
    // a reverse proxy is adding a base path to the application
    <Link
      href={{
        pathname: `${publicRuntimeConfig.basePath || ''}/articles/[id]`,
      }}
      as={{
        pathname: `${publicRuntimeConfig.basePath || ''}/articles/${id}`,
      }}
      passHref
    >
      <div className="topic">
        <div className="button-wrapper">
          <div className="button">{name}</div>
        </div>

        {renditionUrls && (
          <picture>
            <source type="image/webp" srcSet={renditionUrls.srcset} sizes="300px" />
            <source srcSet={renditionUrls.jpgSrcset} sizes="300px" />
            <img src={renditionUrls.thumbnail} alt="Topic Thumbnail" />
          </picture>
        )}
        <div className="desc-wrapper">
          <div className="description">{description}</div>
        </div>
      </div>
    </Link>
  );
};

export default TopicsListItem;

/*
 * Define the type of data used in this component.
 */
TopicsListItem.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    renditionUrls: PropTypes.shape().isRequired,
  }).isRequired,
};
