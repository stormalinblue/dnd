type BaseExpression = {
  name?: string;
};

type BaseResult = {
  name?: string;
  value: number;
};

export interface Constant extends BaseExpression {
  kind: 'constant';
  value: number;
}

export interface ConstantResult extends BaseResult {
  kind: 'constant';
}

export interface DieRoll extends BaseExpression {
  kind: 'dieRoll';
  die: number;
}

export interface DieRollResult extends BaseResult {
  kind: 'dieRoll';
  die: number;
}

export interface MultiDieRoll extends BaseExpression {
  kind: 'multiDieRoll';
  die: number;
  numDie: number;
}

export interface MultiDieRollResult extends BaseResult {
  kind: 'multiDieRoll';
  die: number;
  dieResults: Array<number>;
}

export interface SumExpr extends BaseExpression {
  kind: 'sumExpr';
  children: Array<Expression>;
}

export interface SumResult extends BaseResult {
  kind: 'sumExpr';
  children: Array<Result>;
}

export type Expression = Constant | DieRoll | MultiDieRoll | SumExpr;
export type Result =
  | ConstantResult
  | DieRollResult
  | MultiDieRollResult
  | SumResult;

/**
 * Begin convenience constructors
 */

export function constant(value: number, name?: string): Constant {
  return {
    kind: 'constant',
    value: value,
    name: name,
  };
}

export function makeDieRoll(die: number, name?: string): DieRoll {
  return {
    kind: 'dieRoll',
    die: die,
    name: name,
  };
}

export function d4(name?: string): DieRoll {
  return makeDieRoll(4, name);
}

export function d6(name?: string): DieRoll {
  return makeDieRoll(6, name);
}

export function d8(name?: string): DieRoll {
  return makeDieRoll(8, name);
}

export function d20(name?: string): DieRoll {
  return makeDieRoll(20, name);
}

export function multiDieRoll(
  die: number,
  numDie: number,
  name?: string
): MultiDieRoll {
  return {
    kind: 'multiDieRoll',
    die: die,
    numDie: numDie,
    name: name,
  };
}

export function sum(children: Array<Expression>, name?: string): SumExpr {
  return {
    kind: 'sumExpr',
    children: children,
    name: name,
  };
}

/**
 * End convenience constructors
 */

/**
 * Begin display utils
 */

function summarizeConstant(expr: Constant): string {
  return expr.value.toString();
}

function summarizeDieRoll(expr: DieRoll): string {
  return `d${expr.die}`;
}

function summarizeMultiDieRoll(expr: MultiDieRoll): string {
  return `${expr.numDie}d${expr.die}`;
}

function summarizeSum(expr: SumExpr): string {
  function getConstituents(exprs: Array<Expression>): {
    dieRoll: Array<string>;
    misc: Array<string>;
    constant: number;
  } {
    let dieRollConstituents: Array<string> = [];
    let miscConstituents: Array<string> = [];
    let constantConstituent: number = 0;

    for (const childExpr of exprs) {
      switch (childExpr.kind) {
        case 'constant':
          constantConstituent += childExpr.value;
          break;
        case 'dieRoll':
        case 'multiDieRoll':
          dieRollConstituents.push(summarizeExpr(childExpr));
          break;
        case 'sumExpr':
          const subResult = getConstituents(childExpr.children);
          dieRollConstituents.push(...subResult.dieRoll);
          miscConstituents.push(...subResult.misc);
          constantConstituent += subResult.constant;
          break;
      }
    }
    return {
      dieRoll: dieRollConstituents,
      misc: miscConstituents,
      constant: constantConstituent,
    };
  }

  const allConstituents = getConstituents(expr.children);
  let constituents = [
    ...allConstituents.dieRoll,
    ...allConstituents.misc
  ];

  let constituentString = constituents.join(' + ');

  if (allConstituents.constant > 0) {
    constituentString += ' + ' + allConstituents.constant.toString()
  } else if (allConstituents.constant < 0) {
    constituentString += ' - ' + (-allConstituents.constant).toString()
  }

  return constituentString;
}

export function summarizeExpr(expr: Expression): string {
  switch (expr.kind) {
    case 'constant':
      return summarizeConstant(expr);
    case 'dieRoll':
      return summarizeDieRoll(expr);
    case 'multiDieRoll':
      return summarizeMultiDieRoll(expr);
    case 'sumExpr':
      return summarizeSum(expr);
  }
}

/**
 * End display utils
 */

/**
 * Begin evaluation functions
 */

function rollDie(die: number) {
  return Math.floor(Math.random() * die) + 1;
}

function evaluateConstant(expression: Constant): ConstantResult {
  return {
    kind: expression.kind,
    name: expression.name,
    value: expression.value,
  };
}

function evaluateDieRoll(expression: DieRoll): DieRollResult {
  const result = rollDie(expression.die);
  return {
    kind: expression.kind,
    name: expression.name,
    value: result,
    die: expression.die,
  };
}

function evaluateMultiDieRoll(expression: MultiDieRoll): MultiDieRollResult {
  let dieSum = 0;
  let dieResults: Array<number> = [];
  for (let i = 0; i < expression.numDie; i += 1) {
    const roll = rollDie(expression.die);
    dieResults.push(roll);
    dieSum += roll;
  }
  return {
    kind: expression.kind,
    name: expression.name,
    value: dieSum,
    die: expression.die,
    dieResults: dieResults,
  };
}

function evaluateSumExpr(expression: SumExpr): SumResult {
  let childrenResults: Array<Result> = [];
  let sum: number = 0;

  expression.children.forEach((childExpr) => {
    const childResult = evaluateExpression(childExpr);
    childrenResults.push(childResult);
    sum += childResult.value;
  });

  return {
    kind: expression.kind,
    name: expression.name,
    value: sum,
    children: childrenResults,
  };
}

export function evaluateExpression(expression: Expression): Result {
  switch (expression.kind) {
    case 'constant':
      return evaluateConstant(expression);
    case 'dieRoll':
      return evaluateDieRoll(expression);
    case 'multiDieRoll':
      return evaluateMultiDieRoll(expression);
    case 'sumExpr':
      return evaluateSumExpr(expression);
  }

  return { name: 'Error', kind: 'constant', value: 0 };
}
