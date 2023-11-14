import React from "react";
import { FaCompass } from "react-icons/fa";
import { shape, ProfileType } from "@wkocjan/gatsby-theme-intro/src/types";

const Summary = ({ profile }) => (
  <div className="flex pb-8">
    <div className="w-1/2 pr-4 lg:pr-12 border-r border-line">
      <h5 className="font-header font-semibold text-front text-base uppercase">
        Développeur Web Freelance
      </h5>
      {profile.for_hire && (
        <div className="font-header font-semibold text-xs uppercase pt-2">
          <span className="inline-block w-2 h-2 rounded-full mr-1 bg-green-500"></span>
          Disponible
        </div>
      )}
    </div>
    <div className="w-1/2 pl-4 lg:pl-12">
      <h5 className="font-header font-semibold text-front text-base uppercase">
        Objectif du moment
      </h5>
      <div className="font-header font-light text-xl text-front leading-tight">
        <div>
          Découvrir Rust
          <a
            aria-label="Rust website"
            className="inline-block text-front opacity-50 hover:opacity-75 ml-2 h-4 w-4 transition-opacity duration-150"
            href="https://www.rust-lang.org/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaCompass />
          </a>
        </div>
        <div>
          Maîtriser Temporal
          <a
            aria-label="Temporal website"
            className="inline-block text-front opacity-50 hover:opacity-75 ml-2 h-4 w-4 transition-opacity duration-150"
            href="https://temporal.io/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaCompass />
          </a>
        </div>
      </div>
    </div>
  </div>
);

Summary.propTypes = {
  profile: shape(ProfileType),
};

export default Summary;
