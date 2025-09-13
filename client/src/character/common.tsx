import { type Expression, evaluateExpression } from "../expr/expr";
import { useFeed } from "../feed/feed";

export function ModifierLabel(props: { modifier: number }): React.ReactNode {
  return props.modifier >= 0 ? `+${props.modifier}` : props.modifier.toString();
}

export function D20RollButton(props: { tag: string, expr: Expression }) {
  const { addToFeed } = useFeed();

  return <button onClick={() => {
    addToFeed(evaluateExpression(props.expr))
  }}>
    Roll {props.tag}
  </button>
}