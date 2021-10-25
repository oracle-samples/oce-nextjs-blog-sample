/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import getConfig from 'next/config';
import { dateToMDY } from '../scripts/utils';

const { publicRuntimeConfig } = getConfig();

/**
 * Component representing an Article List Item displayed in the list of articles.
 *
 * @param {string} topicId The Topic to which the Article belongs, used when creating
 *                         the link to the article details
 * @param {string} topicName The Topic name, used to render breadcrumbs
 * @param {object} article The Article to display
 */
const ArticlesListItem = (props) => {
  const { article } = props;
  const formattedDate = `Posted on ${dateToMDY(article.fields.published_date.value)}`;

  // whole view is wrapped in a "Link" component with the URL of the format
  // articles/articleId?topicName=name&topicId=id
  // Prefix the link with the basePath to work in environments where
  // a reverse proxy is adding a base path to the application
  return (
    <Link
      href={{
        pathname: `${publicRuntimeConfig.basePath || ''}/article/[id]`,
      }}
      as={{
        pathname: `${publicRuntimeConfig.basePath || ''}/article/${article.id}`,
      }}
    >

      <div className="article">

        <div className="title-date">
          <h4 className="title">{article.name}</h4>
          <div className="date">{formattedDate}</div>
        </div>

        {article.renditionUrls && (
          <picture>
            <source
              type="image/webp"
              srcSet={article.renditionUrls.srcset}
              sizes="80px"
            />
            <source srcSet={article.renditionUrls.jpgSrcset} sizes="80px" />
            <img
              src={article.renditionUrls.small}
              alt="Article thumbnail"
              width={article.renditionUrls.width}
              height={article.renditionUrls.height}
            />
          </picture>
        )}

        <div className="description">
          {article.description}
        </div>
      </div>
    </Link>
  );
};

export default ArticlesListItem;

ArticlesListItem.propTypes = {
  article: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    renditionUrls: PropTypes.shape().isRequired,
    fields: PropTypes.shape({
      published_date: PropTypes.shape({
        value: PropTypes.string.isRequired,
      }),
    }),
  }).isRequired,
};
