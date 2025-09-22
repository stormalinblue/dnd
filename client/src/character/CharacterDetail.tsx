import type React from 'react';
import { AbilityScoreTable } from './AbilityScoreTable';
import { CHARACTER } from './character';
import { SkillTable } from './SkillTable';
import { WeaponTable } from './WeaponTable';

import './CharacterDetail.scss';

function CharacterDetailSection(props: { children: React.ReactNode }) {
  return <div className="character-detail-section">{props.children}</div>;
}

export function CharacterDetail() {
  const character = CHARACTER;

  let classTable = <>No classes</>;
  if (character.classList.length > 0) {
    const classRows = character.classList.map((klass) => {
      return (
        <tr key={klass.name}>
          <td>{klass.name}</td>
          <td className="align-right">{klass.level}</td>
        </tr>
      );
    });
    classTable = (
      <table>
        <thead>
          <tr>
            <th>Class</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>{classRows}</tbody>
      </table>
    );
  }

  return (
    <>
      <h1>{character.name}</h1>
      <CharacterDetailSection>
        <h2>Classes</h2>
        {classTable}
      </CharacterDetailSection>
      <CharacterDetailSection>
        <h2>Ability Scores</h2>
        <AbilityScoreTable character={CHARACTER} />
      </CharacterDetailSection>
      <CharacterDetailSection>
        <h2>Skills</h2>
        <SkillTable character={CHARACTER} />
      </CharacterDetailSection>
      <CharacterDetailSection>
        <h2>Weapons</h2>
        <WeaponTable character={CHARACTER} />
      </CharacterDetailSection>
    </>
  );
}
