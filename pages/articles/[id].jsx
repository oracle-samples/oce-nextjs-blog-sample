/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

import getConfig from 'next/config';
import ArticlesListItem from '../../components/ArticlesListItem';
import Breadcrumbs from '../../components/Breadcrumbs';

import { fetchTopicIds, fetchTopicName, fetchTopicArticles } from '../../scripts/services';

const { publicRuntimeConfig } = getConfig();

/**
 * Component for the Articles List Page.
 */
const ArticlesListPage = ({ data, topicId, topicName }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  // Prefix the link with the basePath to work in environments where
  // a reverse proxy is adding a base path to the application
  const breadcrumbsData = [
    {
      linkParamsHref: { pathname: `${publicRuntimeConfig.basePath || ''}/` },
      text: 'Home',
    },
    {
      linkParamsHref: {},
      text: topicName,
    },
  ];

  return (
    <>
      <Head>
        <title>Articles</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="description" content="Sample Blog app created in NextJs that utilizes the content sdk library" />
      </Head>
      <div data-testid="ArticlesListContainer">
        <Breadcrumbs breadcrumbsData={breadcrumbsData} />
        {data.articles && (
        <div id="articles">
          {data.articles.map(
            (article) => (
              <ArticlesListItem
                article={article}
                key={article.id}
                topicName={topicName}
                topicId={topicId}
              />
            ),
          )}
        </div>
        )}
      </div>
    </>
  );
};

export default withRouter(ArticlesListPage);

/**
 * Called during build to generate this page.
 *
 * This is never called when the application is running,
 * i.e. its not called on the server when a request comes in or on the client side.
 */
export async function getStaticProps(context) {
  const { params } = context;
  const { id } = params;
  const [data, topicName] = await Promise.all([fetchTopicArticles(id), fetchTopicName(id)]);

  return {
    props: {
      topicId: id,
      topicName,
      data,
    },
  };
}

/**
 * Called during build to generate all paths to this .
 * This is never called when the application is running,
 */
export async function getStaticPaths() {
  const topicIds = await fetchTopicIds();

  // Generate the paths we want to pre-render based on posts
  const paths = topicIds.map((topicId) => ({
    params: { id: topicId },
  }));

  return {
    paths,
    fallback: false,
  };
}

/*
 * Define the type of data used in this component.
 */
ArticlesListPage.propTypes = {
  data: PropTypes.shape().isRequired,
  topicId: PropTypes.string.isRequired,
  topicName: PropTypes.string.isRequired,
};
