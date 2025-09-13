import { AbilityScoreTable } from "./AbilityScoreTable";
import { CHARACTER } from "./character";
import { SkillTable } from "./SkillTable";

export function CharacterDetail() {
  const character = CHARACTER;

  let classTable = <>No classes</>
  if (character.classList.length > 0) {
    const classRows = character.classList.map((klass) => {
      return <tr key={klass.name}>
        <td>{klass.name}</td>
        <td className='align-right'>{klass.level}</td>
      </tr>
    })
    classTable = <table>
      <thead>
        <tr>
          <th>Class</th>
          <th>Level</th>
        </tr>
      </thead>
      <tbody>
        {classRows}
      </tbody>
    </table>
  }

  return <>
    <h1>{character.name}</h1>
    <h2>Classes</h2>
    {classTable}
    <h2>Ability Scores</h2>
    <AbilityScoreTable character={CHARACTER} />
    <h2>Skills</h2>
    <SkillTable character={CHARACTER} />
    <h2>Weapons</h2>

  </>
}