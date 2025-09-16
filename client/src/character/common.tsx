import { type Expression, evaluateExpression } from "../expr/expr";
import { useFeed, feedItemFromResult } from "../feed/feed";

export function ModifierLabel(props: { modifier: number }): React.ReactNode {
  return props.modifier >= 0 ? `+${props.modifier}` : props.modifier.toString();
}

export function D20RollButton(props: { tag: string, expr: Expression }) {
  const { feedItems, addToFeed } = useFeed();

  const exprKey = feedItems.length.toString();

  return <button onClick={() => {
    addToFeed(
      feedItemFromResult(
        evaluateExpression(props.expr), exprKey))
  }}>
    Roll {props.tag}
  </button>
}