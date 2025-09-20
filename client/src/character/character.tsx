import type React from 'react';
import {
  constant,
  d20,
  d4,
  d6,
  d8,
  multiDieRoll,
  sum,
  type Expression,
} from '../expr/expr';

interface AbilityMap<T> {
  strength: T;
  dexterity: T;
  constitution: T;
  intelligence: T;
  wisdom: T;
  charisma: T;
}

export type AbilityKey = keyof AbilityMap<any>;

export const ABILITY_NAMES: AbilityMap<string> = {
  strength: 'Strength',
  dexterity: 'Dexterity',
  constitution: 'Constitution',
  intelligence: 'Intelligence',
  wisdom: 'Wisdom',
  charisma: 'Charisma',
};

interface SkillMap<T> {
  acrobatics: T;
  animalHandling: T;
  arcana: T;
  athletics: T;
  deception: T;
  history: T;
  insight: T;
  intimidation: T;
  investigation: T;
  medicine: T;
  nature: T;
  perception: T;
  performance: T;
  persuasion: T;
  religion: T;
  sleightOfHand: T;
  stealth: T;
  survival: T;
}

export type SkillKey = keyof SkillMap<any>;

export interface SkillCharacteristic {
  name: string;
  ability: AbilityKey;
}

export const SKILL_ATTRIBUTES: SkillMap<SkillCharacteristic> = {
  acrobatics: { name: 'Acrobatics', ability: 'dexterity' },
  animalHandling: { name: 'Animal Handling', ability: 'wisdom' },
  arcana: { name: 'Arcana', ability: 'intelligence' },
  athletics: { name: 'Athletics', ability: 'strength' },
  deception: { name: 'Deception', ability: 'charisma' },
  history: { name: 'History', ability: 'intelligence' },
  insight: { name: 'Insight', ability: 'wisdom' },
  intimidation: { name: 'Intimidation', ability: 'charisma' },
  investigation: { name: 'Investigation', ability: 'intelligence' },
  medicine: { name: 'Medicine', ability: 'wisdom' },
  nature: { name: 'Nature', ability: 'intelligence' },
  perception: { name: 'Perception', ability: 'wisdom' },
  performance: { name: 'Performance', ability: 'charisma' },
  persuasion: { name: 'Persuasion', ability: 'charisma' },
  religion: { name: 'Religion', ability: 'intelligence' },
  sleightOfHand: { name: 'Sleight of Hand', ability: 'dexterity' },
  stealth: { name: 'Stealth', ability: 'dexterity' },
  survival: { name: 'Survival', ability: 'wisdom' },
};

export type AbilityCharacteristic = {
  score: number;
  saveProficient: boolean;
};

export function scoreModifier(score: number) {
  return Math.floor((score - 10) / 2);
}

export type AbilityScoreMap = AbilityMap<AbilityCharacteristic>;

const CHARACTER_SKILL_PROFICIENCIES: SkillMap<boolean> = {
  acrobatics: false,
  animalHandling: false,
  arcana: false,
  athletics: true,
  deception: false,
  history: false,
  insight: true,
  intimidation: true,
  investigation: false,
  medicine: false,
  nature: false,
  perception: true,
  performance: false,
  persuasion: true,
  religion: false,
  sleightOfHand: false,
  stealth: false,
  survival: false,
};

export type CharacterClass = {
  name: string;
  level: number;
};

type WeaponDamage = {
  type: string;
  total: Expression;
};

export type WeaponCharacteristic = {
  name: string;
  attack: Expression;
  damage: WeaponDamage;
  ability: AbilityKey | null;
  proficient: boolean;
  description?: React.ReactNode;
};

export type Character = {
  name: string;
  species: string;
  classList: Array<CharacterClass>;
  abilities: AbilityMap<AbilityCharacteristic>;
  proficiencyBonus: number;
  saveBonus: number;
  skills: SkillMap<boolean>;
};

export const CHARACTER: Character = {
  name: 'Nemo',
  species: 'Half-Orc',
  classList: [{ name: 'Paladin', level: 8 }],
  abilities: {
    strength: { score: 18, saveProficient: false },
    dexterity: { score: 10, saveProficient: false },
    constitution: { score: 14, saveProficient: false },
    intelligence: { score: 11, saveProficient: false },
    wisdom: { score: 8, saveProficient: true },
    charisma: { score: 14, saveProficient: true },
  },
  proficiencyBonus: 3,
  saveBonus: 1,
  skills: CHARACTER_SKILL_PROFICIENCIES,
};

export function abilityModifier(
  character: Character,
  abilityKey: AbilityKey
): number {
  return scoreModifier(character.abilities[abilityKey].score);
}

export function characterWeapons(
  character: Character
): Array<WeaponCharacteristic> {
  function attackExpression(
    name: string,
    abilityKey: AbilityKey | null,
    proficient: boolean,
    weaponBonus?: Expression
  ) {
    let parts: Array<Expression> = [d20()];

    if (abilityKey !== null) {
      const abilityModifierExpr = constant(
        abilityModifier(character, abilityKey),
        ABILITY_NAMES[abilityKey] + ' Modifier'
      );

      parts.push(abilityModifierExpr);
    }

    if (proficient) {
      const proficiencyBonusExpr = constant(
        character.proficiencyBonus,
        'Proficiency Bonus'
      );
      parts.push(proficiencyBonusExpr);
    }

    if (weaponBonus !== undefined) {
      parts.push(weaponBonus);
    }

    return sum(parts, `${name} Attack Roll`);
  }

  function damageExpression(
    name: string,
    abilityKey: AbilityKey | null,
    dmgDie: Expression | null,
    weaponBonus?: Expression
  ) {
    let parts: Array<Expression> = [];

    if (dmgDie !== null) {
      parts.push(dmgDie);
    }

    if (abilityKey !== null) {
      const abilityModifierExpr = constant(
        abilityModifier(character, abilityKey),
        ABILITY_NAMES[abilityKey] + ' Modifier'
      );

      parts.push(abilityModifierExpr);
    }

    if (weaponBonus !== undefined) {
      parts.push(weaponBonus);
    }

    return sum(parts, `${name} Damage`);
  }

  function weaponCharacteristic(
    name: string,
    damageType: string,
    proficient: boolean,
    abilityKey: AbilityKey | null,
    dmgDie: Expression | null,
    description?: React.ReactNode,
    atkBonus?: Expression,
    dmgBonus?: Expression
  ): WeaponCharacteristic {
    return {
      name: name,
      proficient: proficient,
      attack: attackExpression(name, abilityKey, proficient, atkBonus),
      damage: {
        type: damageType,
        total: damageExpression(name, abilityKey, dmgDie, dmgBonus),
      },
      ability: abilityKey,
      description: description,
    };
  }

  const magicBonus1 = constant(1, 'Magic Weapon Bonus');

  return [
    weaponCharacteristic(
      'Giant Slayer Sword',
      'Piercing',
      true,
      'strength',
      d8(),
      <></>,
      magicBonus1,
      magicBonus1
    ),
    weaponCharacteristic(
      'Giant Slayer Sword (vs Giants)',
      'Piercing',
      true,
      'strength',
      d8(),
      <p>
        Giants must score 15 or higher on a strength save or be knocked prone.
      </p>,
      magicBonus1,
      sum(
        [multiDieRoll(6, 2, 'Giant Slaying Bonus'), magicBonus1],
        'Weapon Bonus'
      )
    ),
    weaponCharacteristic(
      'Javelin',
      'Piercing',
      true,
      'strength',
      d6(),
      <p>Range up to 120 ft. Disadvantage if throwing more than 60 ft.</p>
    ),
    weaponCharacteristic(
      'Improvised Weapon',
      'Unknown',
      false,
      'strength',
      d4(),
      <p>Range up to 60 ft. Disadvantage if throwing more than 20 ft.</p>
    ),
    weaponCharacteristic(
      'Improvised Weapon',
      'Unknown',
      false,
      'dexterity',
      d4(),
      <p>Range up to 60 ft. Disadvantage if throwing more than 20 ft.</p>
    ),
    weaponCharacteristic(
      'Unarmed Strike',
      'Bludgeoning',
      true,
      'strength',
      null,
      undefined,
      undefined,
      constant(1, 'Unarmed Strike Bonus')
    ),
  ];
}

export function mapSkillMap<T, V>(
  map: SkillMap<T>,
  cb: (elem: T, key: SkillKey) => V
): Array<V> {
  let result: Array<V> = [];
  for (const key of Object.keys(map) as SkillKey[]) {
    result.push(cb(map[key], key));
  }
  return result;
}

export function mapAbilityMap<T, V>(
  map: AbilityMap<T>,
  cb: (elem: T, key: AbilityKey) => V
): Array<V> {
  let result: Array<V> = [];
  for (const key of Object.keys(map) as AbilityKey[]) {
    result.push(cb(map[key], key));
  }
  return result;
}
