import type React from 'react';
import {
  ABILITY_NAMES,
  characterWeapons,
  type Character,
  type WeaponCharacteristic,
} from './character';
import { EvaluateButton } from './common';

function WeaponTableRow(props: {
  character: Character;
  weapon: WeaponCharacteristic;
}) {
  const weapon = props.weapon;

  return (
    <tr>
      <td>
        {weapon.name}
        <p>
          <i>{weapon.description !== undefined ? weapon.description : <></>}</i>
        </p>
      </td>
      <td>{weapon.damage.type}</td>
      <td>{weapon.ability !== null ? ABILITY_NAMES[weapon.ability] : 'NA'}</td>
      <td>{weapon.proficient ? 'Yes' : 'No'}</td>
      <td>
        <EvaluateButton expr={weapon.attack} tag="Attack" />
      </td>
      <td>
        <EvaluateButton expr={weapon.damage.total} tag="Damage" />
      </td>
    </tr>
  );
}

export function WeaponTable(props: { character: Character }): React.ReactNode {
  const weapons = characterWeapons(props.character);

  return (
    <table>
      <thead>
        <tr>
          <th>Weapon Name</th>
          <th>Damage Type</th>
          <th>Ability</th>
          <th>Proficient?</th>
          <th>Attack Rolls</th>
          <th>Damage Rolls</th>
        </tr>
      </thead>
      <tbody>
        {weapons.map((weapon, index) => {
          return (
            <WeaponTableRow
              key={index}
              character={props.character}
              weapon={weapon}
            />
          );
        })}
      </tbody>
    </table>
  );
}
