import type React from 'react';
import {
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
      <td>{weapon.name}</td>
      <td>{weapon.damage.type}</td>
      <td>{weapon.proficient.toString()}</td>
      <td>
        <EvaluateButton expr={weapon.attack} tag="Attack" />
      </td>
      <td>
        <EvaluateButton expr={weapon.damage.total} tag="Damage" />
      </td>
      <td>{weapon.description !== undefined ? weapon.description : <></>}</td>
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
          <th>Proficient?</th>
          <th>Attack Rolls</th>
          <th>Damage Rolls</th>
          <th>Description</th>
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
