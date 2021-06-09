import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
import "@wkocjan/gatsby-theme-intro/src/styles/style.css";

deckDeckGoHighlightElement();
import "../css/blog-post.css";

export default function Template({ data }) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;

  return (
    <div className="antialiased bg-back leading-normal font-text text-front">
      <div className="md:max-w-screen-sm lg:max-w-screen-xl mx-auto px-4 pt-4">
        <div className="text-center">
          <h1 className="font-header font-black text-front text-5xl leading-none break-words mt-6 max-w-2xl inline-block">
            {frontmatter.title}
          </h1>
          <h2 className="mt-2">Publié le {frontmatter.date}</h2>
        </div>
        <div className="blog-post" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}

Template.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      }),
      html: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "DD/MM/YYYY")
        slug
        title
      }
    }
  }
`;
