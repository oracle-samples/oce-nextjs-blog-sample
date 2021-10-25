/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';

import Header from '../components/Header';
import TopicsListItem from '../components/TopicsListItem';

import { getTopicsListPageData } from '../scripts/services';

/**
 * Component for the home page which is the Topics List Page.
 */
const Index = ({ data }) => {
  const {
    companyTitle,
    companyThumbnailRenditionUrls,
    aboutUrl,
    contactUrl,
    topics,
  } = data;

  return (
    <>
      <Head>
        <title>Topics</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="description" content="Sample Blog app created in NextJs that utilizes the content sdk library" />
      </Head>
      <div data-testid="TopicsListContainer">
        <Header
          companyTitle={companyTitle}
          companyThumbnailRenditionUrls={companyThumbnailRenditionUrls}
          aboutUrl={aboutUrl}
          contactUrl={contactUrl}
        />
        {topics && (
        <div id="topics">
          {topics.map(
            (topic) => (
              <TopicsListItem topic={topic} key={topic.id} />
            ),
          )}
        </div>
        )}
      </div>
    </>
  );
};

/**
 * Called during build to generate this page.
 *
 * This is never called when the application is running,
 * i.e. its not called on the server when a request comes in or on the client side.
 */
export async function getStaticProps() {
  const data = await getTopicsListPageData();
  return { props: { data } };
}

export default Index;

/*
 * Define the type of data used in this component.
 */
Index.propTypes = {
  data: PropTypes.shape({
    companyTitle: PropTypes.string,
    companyThumbnailRenditionUrls: PropTypes.shape().isRequired,
    aboutUrl: PropTypes.string,
    contactUrl: PropTypes.string,
    topics: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  }).isRequired,
};
