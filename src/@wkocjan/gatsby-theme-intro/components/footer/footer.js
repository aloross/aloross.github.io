import { bool } from "prop-types";
import React from "react";
import { ProfileType } from "@wkocjan/gatsby-theme-intro/src/types";

const Footer = ({ name }) => (
  <footer className="bg-front mt-16 pt-8 pb-16">
    <div className="md:max-w-screen-sm lg:max-w-screen-xl mx-auto px-4 flex items-center">
      <div className="w-2/3 text-back-light font-header text-xs">
        <b>
          &copy; {new Date().getFullYear()} {name}.
        </b>{" "}
        Tous droits réservés
      </div>
      <div className="w-1/3 text-right text-back-light text-xs">
        Site réalisé avec{" "}
        <a
          aria-label="Gatsby website"
          className="text-back-light"
          href="https://www.gatsbyjs.com/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <b>Gatsby</b>
        </a>{" "}
        et le thème{" "}
        <a
          aria-label="Intro theme"
          className="text-back-light"
          href="https://weeby.studio/intro"
          rel="noopener noreferrer"
          target="_blank"
        >
          <b>Intro</b>
        </a>
      </div>
    </div>
  </footer>
);

Footer.propTypes = {
  name: ProfileType.name,
  showThemeLogo: bool,
};

export default Footer;
