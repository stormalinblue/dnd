import { constant, sum, d20, type Expression } from '../expr/expr';
import {
  type Character,
  type AbilityKey,
  ABILITY_NAMES,
  scoreModifier,
  mapAbilityMap,
} from './character';
import { EvaluateButton, ModifierLabel } from './common';

function AbilityScoreTableRow(props: {
  character: Character;
  abilityKey: AbilityKey;
}): React.ReactNode {
  const abilityCharacteristic = props.character.abilities[props.abilityKey];
  const abilityName = ABILITY_NAMES[props.abilityKey];

  const modifier = scoreModifier(abilityCharacteristic.score);
  const modifierExpr = constant(modifier, `${abilityName} Modifier`);
  const rollExpr = sum([d20(), modifierExpr], `${abilityName} Roll`);

  let saveModifier: number = modifier;
  let saveSumParts: Array<Expression> = [d20(), modifierExpr];

  if (abilityCharacteristic.saveProficient) {
    saveModifier += props.character.proficiencyBonus;
    const proficiencyExpr = constant(
      props.character.proficiencyBonus,
      'Proficiency Bonus'
    );
    saveSumParts.push(proficiencyExpr);
  }

  if (props.character.saveBonus > 0) {
    saveModifier += props.character.saveBonus;
    saveSumParts.push(constant(props.character.saveBonus, 'Save Bonus'));
  }

  const saveExpression = sum(saveSumParts, `${abilityName} Save`);

  const arrow = '\u2192';

  const saveModifierLabel =
    saveModifier === modifier ? (
      <ModifierLabel modifier={saveModifier} />
    ) : (
      <>
        <ModifierLabel modifier={modifier} /> {arrow}{' '}
        <ModifierLabel modifier={saveModifier} />
      </>
    );

  return (
    <tr>
      <td>{abilityName}</td>
      <td className="align-right">{abilityCharacteristic.score}</td>
      <td className="align-right">
        <ModifierLabel modifier={modifier} />
      </td>
      <td>
        <EvaluateButton tag={abilityName} expr={rollExpr} />
      </td>
      <td>{abilityCharacteristic.saveProficient ? 'Yes' : 'No'}</td>
      <td className="align-right">{saveModifierLabel}</td>
      <td>
        <EvaluateButton tag={saveExpression.name!} expr={saveExpression} />
      </td>
    </tr>
  );
}

export function AbilityScoreTable(props: {
  character: Character;
}): React.ReactNode {
  return (
    <>
      Save Bonus: <ModifierLabel modifier={props.character.saveBonus} />
      <table>
        <thead>
          <tr>
            <th>Ability</th>
            <th>Score</th>
            <th>Modifier</th>
            <th>Roll</th>
            <th>Save Proficient?</th>
            <th>Save Modifier</th>
            <th>Roll Save</th>
          </tr>
        </thead>
        <tbody>
          {mapAbilityMap(props.character.abilities, (_, abilityKey) => {
            return (
              <AbilityScoreTableRow
                key={abilityKey}
                character={props.character}
                abilityKey={abilityKey}
              />
            );
          })}
        </tbody>
      </table>
    </>
  );
}
