import type React from "react";
import type { Character } from "./character";
import type { Expression } from "../expr/expr";

type WeaponDamage = {
    bludgeoning?: Expression,
    piercing?: Expression
}

type WeaponProperties = {
    finesse: boolean,
    improvised: boolean,
    damage: WeaponDamage
}

function WeaponTableRow(
    props: {
        character: Character,
        damageClass: string,
        }) {
    return <tr>
        
    </tr>
}

export function WeaponTable(props: {character: Character}): React.ReactNode {
    return <table>
        <thead>
          <tr>
            <th>Weapon Name</th>
            <th>Damage Type</th>
            <th>Proficient?</th>
            <th>Attack Rolls</th>
            <th>Damage Rolls</th>
          </tr>
        </thead>
        <tbody>
          
        </tbody>
    </table>
}