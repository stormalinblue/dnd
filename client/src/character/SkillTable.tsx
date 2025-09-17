import { constant, type Expression, sum, d20 } from '../expr/expr';
import {
  type Character,
  type SkillKey,
  type SkillCharacteristic,
  SKILL_ATTRIBUTES,
  type AbilityKey,
  ABILITY_NAMES,
  mapSkillMap,
  scoreModifier,
} from './character';
import { ModifierLabel, EvaluateButton } from './common';

function SkillTableRow(props: { character: Character; skillKey: SkillKey }) {
  const skillAttr: SkillCharacteristic = SKILL_ATTRIBUTES[props.skillKey];

  const abilityKey: AbilityKey = skillAttr.ability;
  const abilityScore: number = props.character.abilities[abilityKey].score;
  const abilityName: string = ABILITY_NAMES[abilityKey];

  const skillName: string = skillAttr.name;
  const rawModifier = scoreModifier(abilityScore);
  const rawModifierExpression = constant(
    rawModifier,
    `${abilityName} Modifier`
  );

  const skillProficient = props.character.skills[props.skillKey];
  const proficiencyBonus = props.character.proficiencyBonus;

  let modifier!: number;
  let expression!: Expression;
  const expressionName = `${skillName} Roll`;
  if (skillProficient) {
    modifier = rawModifier + proficiencyBonus;
    const proficiencyBonusExpression = constant(
      props.character.proficiencyBonus,
      'Proficiency Bonus'
    );
    expression = sum(
      [d20(), rawModifierExpression, proficiencyBonusExpression],
      expressionName
    );
  } else {
    modifier = rawModifier;
    expression = sum([d20(), rawModifierExpression], expressionName);
  }

  const arrow = '\u2192';

  const modifierLabel =
    modifier === rawModifier ? (
      <ModifierLabel modifier={modifier} />
    ) : (
      <>
        <ModifierLabel modifier={rawModifier} /> {arrow}{' '}
        <ModifierLabel modifier={modifier} />
      </>
    );

  return (
    <tr>
      <td>{skillName}</td>
      <td>{abilityName}</td>
      <td>{skillProficient ? 'Yes' : 'No'}</td>
      <td className="align-right">{modifierLabel}</td>
      <td>
        <EvaluateButton tag={skillName} expr={expression} />
      </td>
    </tr>
  );
}

export function SkillTable(props: { character: Character }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Skill</th>
          <th>Ability</th>
          <th>Proficient?</th>
          <th>Modifier</th>
          <th>Roll</th>
        </tr>
      </thead>
      <tbody>
        {mapSkillMap(props.character.skills, (_, skillKey) => {
          return (
            <SkillTableRow character={props.character} skillKey={skillKey} />
          );
        })}
      </tbody>
    </table>
  );
}
