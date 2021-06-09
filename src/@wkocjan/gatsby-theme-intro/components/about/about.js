import React from "react";
import { ProfileType } from "@wkocjan/gatsby-theme-intro/src/types";

const About = ({ about }) => (
  <>
    <h5 className="font-header font-semibold text-front text- uppercase mb-3">
      À propos
    </h5>
    <div className="font-text text-base pb-12 leading-normal whitespace-pre-line">
      {about}
      <div className="text-center pt-4">
        <a
          className="inline-flex font-header font-semibold bg-lead text-lead-text justify-center items-center leading-tight w-60 h-auto px-6 py-2 rounded-lg self-start mt-4 hover:opacity-75 transition-opacity duration-150"
          href="mailto:adrien.louis.r@gmail.com"
        >
          <span>Contactez moi</span>
        </a>
      </div>
    </div>
  </>
);

About.propTypes = {
  about: ProfileType.about,
};

export default About;
