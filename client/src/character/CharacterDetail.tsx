import type React from 'react';
import { AbilityScoreTable } from './AbilityScoreTable';
import {
  abilityModifier,
  CHARACTER,
  type Character,
  type CharacterClass,
} from './character';
import { SkillTable } from './SkillTable';
import { WeaponTable } from './WeaponTable';

import './CharacterDetail.scss';
import { EvaluateButton } from './common';
import { d12, d10, d20, d4, d6, d8 } from '../expr/expr';

function hitDie(cl: CharacterClass): number {
  switch (cl.name) {
    case 'Paladin':
      return 10;
    default:
      throw new Error('Unrecognized class');
  }
}

function maxHitPoints(character: Character): number {
  const constitutionModifier = abilityModifier(character, 'constitution');

  let hitPoints: number = 0;

  for (const cl of character.classList) {
    const die = hitDie(cl);
    if (cl.initial) {
      hitPoints += die + constitutionModifier;
    }
    hitPoints += cl.level * (constitutionModifier + Math.ceil(die / 2));
  }

  return hitPoints;
}

function HitPoints(props: { character: Character }): React.ReactNode {
  return <>Maximum Hit Points: {maxHitPoints(props.character).toString()}</>;
}

function AllDieButtons(): React.ReactNode {
  return (
    <CharacterDetailSection>
      <EvaluateButton expr={d4()} tag={'d4'} />
      <EvaluateButton expr={d6()} tag={'d6'} />
      <EvaluateButton expr={d8()} tag={'d8'} />
      <EvaluateButton expr={d12()} tag={'d12'} />
      <EvaluateButton expr={d10()} tag={'d10'} />
      <EvaluateButton expr={d20()} tag={'d20'} />
    </CharacterDetailSection>
  );
}

function CharacterDetailSection(props: { children?: React.ReactNode }) {
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
      <HitPoints character={character} />
      <AllDieButtons />
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
