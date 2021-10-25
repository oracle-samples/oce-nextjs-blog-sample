/**
 * Copyright (c) 2021, Oracle and/or its affiliates.
 * Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
 */
import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

import getConfig from 'next/config';
import filterXSS from 'xss';
import Breadcrumbs from '../../components/Breadcrumbs';

import { fetchAllArticlesSimple, fetchArticleDetails } from '../../scripts/services';
import { dateToMDY } from '../../scripts/utils';

const { publicRuntimeConfig } = getConfig();

/**
 * Component for the Article Details Page.
 */
const ArticleDetailsPage = ({ data }) => {
  if (!data) {
    return <div>Loading...</div>;
  }

  const {
    name,
    title,
    date,
    content,
    imageCaption,
    topicId,
    topicName,
  } = data;

  // Breadcrumbs :  Home > topicName > articleName (read only)
  // - "Home" url      =  "/"
  // - "topicName" url =  "/articles/topicId"
  // Prefix the link with the basePath to work in environments where
  // a reverse proxy is adding a base path to the application
  const breadcrumbsData = [
    {
      linkParamsHref: { pathname: `${publicRuntimeConfig.basePath || ''}/` },
      text: 'Home',
    },
    {
      linkParamsHref: {
        pathname: `${publicRuntimeConfig.basePath || ''}/articles/${topicId}`,
      },
      text: topicName,
    },
    {
      linkParamsHref: {},
      text: name,
    },
  ];

  const formattedDate = (date && date.value) ? `Posted on ${dateToMDY(date.value)}` : '';
  // sanitize the content for html display
  const options = {
    stripIgnoreTag: true, // filter out all HTML not in the whitelist
    stripIgnoreTagBody: ['script'], // the script tag is a special case, we need
    // to filter out its content
  };
  const cleancontent = filterXSS(content, options);

  return (
    <>
      <Head>
        <title>Article</title>
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <meta name="description" content="Sample Blog app created in NextJs that utilizes the content sdk library" />
      </Head>
      <div>
        <Breadcrumbs breadcrumbsData={breadcrumbsData} />
        <div id="article">
          <div className="author">
            {/* Avatar */}
            {data.authorRenditionUrls && (
              <picture>
                <source
                  type="image/webp"
                  srcSet={data.authorRenditionUrls.srcset}
                  sizes="80px"
                />
                <source srcSet={data.authorRenditionUrls.jpgSrcset} sizes="80px" />
                <img src={data.authorRenditionUrls.small} alt="Author Avatar" />
              </picture>
            )}

            {/*  Author Name / Date */}
            <div className="name_date">
              <h4 className="title">{title}</h4>
              <div className="date">
                {formattedDate}
                {' '}
              </div>
            </div>
          </div>

          {/* Article Image and caption */}
          <figure>
            {data.renditionUrls && (
              <picture>
                <source type="image/webp" srcSet={data.renditionUrls.srcset} />
                <source srcSet={data.renditionUrls.jpgSrcset} />
                <img
                  src={data.renditionUrls.large}
                  alt="Article"
                  width={data.renditionUrls.width}
                  height={data.renditionUrls.height}
                />
              </picture>
            )}
            <figcaption>{imageCaption}</figcaption>
          </figure>

          {/* Article Content */}
          <div className="content">
            { cleancontent.indexOf('</') !== -1
              ? (
                // eslint-disable-next-line react/no-danger
                <div dangerouslySetInnerHTML={{ __html: cleancontent }} />
              )
              : cleancontent}
          </div>
        </div>
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
export async function getStaticProps(context) {
  const { params } = context;
  const { id } = params;
  const data = await fetchArticleDetails(id);
  return {
    props: {
      data,
    },
  };
}

/**
 * Called during build to generate all paths to this .
 * This is never called when the application is running,
 */
export async function getStaticPaths() {
  const articles = await fetchAllArticlesSimple();

  // Generate the paths we want to pre-render based on posts
  return {
    paths: articles.map((article) => ({
      params: { id: article.id },
    })),
    fallback: true,
  };
}

export default withRouter(ArticleDetailsPage);

/*
 * Define the type of data used in this component.
 */
ArticleDetailsPage.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string.isRequired,
    date: PropTypes.shape({
      value: PropTypes.string.isRequired,
    }).isRequired,
    content: PropTypes.string.isRequired,
    imageCaption: PropTypes.string.isRequired,
    renditionUrls: PropTypes.shape().isRequired,
    authorRenditionUrls: PropTypes.shape().isRequired,
    topicName: PropTypes.string.isRequired,
    topicId: PropTypes.string.isRequired,
  }).isRequired,
};
