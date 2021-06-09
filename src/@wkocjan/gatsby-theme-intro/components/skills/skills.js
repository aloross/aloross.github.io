import React from "react";
import Skill from "@wkocjan/gatsby-theme-intro/src/components/skills/skill";
import { ProfileType } from "@wkocjan/gatsby-theme-intro/src/types";

const Skills = ({ skills }) => (
  <>
    <h5 className="font-header font-semibold text-front text-base uppercase mb-3">
      Compétences
    </h5>
    <ul className="flex flex-wrap grid grid-cols-3 gap-2 md:gap-4">
      {skills.map((skill, i) => (
        <Skill skill={skill} key={skill} i={i + 1} />
      ))}
    </ul>
  </>
);

Skills.propTypes = {
  skills: ProfileType.skills,
};

export default Skills;
