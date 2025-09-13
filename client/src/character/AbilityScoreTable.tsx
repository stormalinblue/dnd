import { constant, sum, d20, type Expression } from "../expr/expr";
import { type Character, type AbilityKey, ABILITY_NAMES, scoreModifier, mapAbilityMap } from "./character";
import { D20RollButton, ModifierLabel } from "./common";

function AbilityScoreTableRow(props: { character: Character, abilityKey: AbilityKey }): React.ReactNode {

  const abilityCharacteristic = props.character.abilities[props.abilityKey];
  const abilityName = ABILITY_NAMES[props.abilityKey];

  const modifier = scoreModifier(abilityCharacteristic.score);
  const modifierExpr = constant(modifier, `${abilityName} Modifier`);
  const rollExpr = sum([d20(), modifierExpr], `${abilityName} Roll`);

  let saveModifier: number = 0;
  let saveExpression: Expression = constant(0);
  let saveExprName = `${abilityName} Save`
  if (abilityCharacteristic.saveProficient) {
    saveModifier = modifier + props.character.proficiencyBonus;
    const proficiencyExpr = constant(props.character.proficiencyBonus, 'Proficiency Bonus');
    saveExpression = sum([d20(), modifierExpr, proficiencyExpr], saveExprName)
  } else {
    saveModifier = modifier;
    saveExpression = sum([d20(), modifierExpr], saveExprName);
  }

  const arrow = '\u2192';

  const saveModifierLabel = (
    (saveModifier === modifier)
      ? <ModifierLabel modifier={saveModifier} />
      : <><ModifierLabel modifier={modifier} /> {arrow} <ModifierLabel modifier={saveModifier} /></>);

  return <tr>
    <td>{abilityName}</td>
    <td className='align-right'>{abilityCharacteristic.score}</td>
    <td className='align-right'><ModifierLabel modifier={modifier} /></td>
    <td>
      <D20RollButton tag={abilityName} expr={rollExpr} />
    </td>
    <td>
      {abilityCharacteristic.saveProficient ? 'Yes' : 'No'}
    </td>
    <td className='align-right'>
      {saveModifierLabel}
    </td>
    <td>
      <D20RollButton tag={saveExprName} expr={saveExpression} />
    </td>
  </tr>
}

export function AbilityScoreTable(props: { character: Character }): React.ReactNode {
  return <table>
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
      {
        mapAbilityMap(props.character.abilities, (_, abilityKey) => {
          return <AbilityScoreTableRow
            character={props.character}
            abilityKey={abilityKey} />
        })
      }
    </tbody>
  </table>
}