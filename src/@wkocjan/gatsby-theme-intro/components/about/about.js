import React from "react";
import { ProfileType } from "@wkocjan/gatsby-theme-intro/src/types";
import { FaEnvelope } from "react-icons/fa";

const About = ({ about }) => (
  <>
    <h5 className="font-header font-semibold text-front text- uppercase mb-3">
      À propos
    </h5>
    <div className="font-text text-base pb-12 leading-normal whitespace-pre-line">
      {about}
      <a
        className="flex w-14 h-14 font-header font-semibold px-2 bg-lead rounded-full text-lead-text justify-center items-center leading-tight lg:w-auto lg:h-auto lg:px-6 lg:py-2 lg:rounded-lg lg:self-start lg:mt-4 hover:opacity-75 transition-opacity duration-150"
        href="mailto:adrien.louis.r@gmail.com"
      >
        <FaEnvelope className="inline-block h-6 w-6 lg:hidden" />
        <span className="hidden lg:block">Contactez moi</span>
      </a>
    </div>
  </>
);

About.propTypes = {
  about: ProfileType.about,
};

export default About;
