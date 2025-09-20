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
  type AddendComponent = {
    negative: boolean;
    absString: string;
  };

  type AddendGroups = {
    dieRolls: Map<number, number>;
    constant: number;
  };

  function getAddendGroups(expr: SumExpr): AddendGroups {
    let result: AddendGroups = {
      dieRolls: new Map(),
      constant: 0,
    };

    for (const childExpr of expr.children) {
      switch (childExpr.kind) {
        case 'constant':
          result.constant += childExpr.value;
          break;
        case 'dieRoll':
          {
            const die = childExpr.die;
            if (result.dieRolls.has(die)) {
              result.dieRolls.set(die, 1 + result.dieRolls.get(die)!);
            } else {
              result.dieRolls.set(die, 1);
            }
          }
          break;
        case 'multiDieRoll':
          {
            const die = childExpr.die;
            const mul = childExpr.numDie;
            if (result.dieRolls.has(die)) {
              result.dieRolls.set(die, mul + result.dieRolls.get(die)!);
            } else {
              result.dieRolls.set(die, mul);
            }
          }
          break;
        case 'sumExpr':
          const subResult = getAddendGroups(childExpr);
          subResult.dieRolls.forEach((mul, die) => {
            const prevMul = result.dieRolls.has(die)
              ? result.dieRolls.get(die)!
              : 0;
            result.dieRolls.set(die, prevMul + mul);
          });
          result.constant += subResult.constant;
      }
    }

    return result;
  }

  const groups = getAddendGroups(expr);

  const dice = [...groups.dieRolls.keys()];
  dice.sort((a, b) => b - a);

  let addends: Array<AddendComponent> = [];

  for (const die of dice) {
    const mul = groups.dieRolls.get(die)!;
    let negative: boolean = mul < 0;
    let prefix: string = '';
    if (Math.abs(mul) === 1) {
      prefix = 'd';
    } else {
      prefix = `${Math.abs(mul)}d`;
    }

    addends.push({
      negative: negative,
      absString: `${prefix}${die}`,
    });
  }

  if (groups.constant !== 0) {
    addends.push({
      negative: groups.constant < 0,
      absString: Math.abs(groups.constant).toString(),
    });
  }

  return addends
    .map((addend, index) => {
      if (index === 0) {
        if (addend.negative) {
          return '-' + addend.absString;
        } else {
          return addend.absString;
        }
      } else {
        if (addend.negative) {
          return ' - ' + addend.absString;
        } else {
          return ' + ' + addend.absString;
        }
      }
    })
    .join('');
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
