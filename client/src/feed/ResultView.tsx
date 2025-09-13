import type React from "react";

import './ResultView.scss'
import type { ConstantResult, DieRollResult, MultiDieRollResult, SumResult, Result } from "../expr/expr";

function ResultCard(props: { children: React.ReactNode, level: number }): React.ReactNode {
    const levelClass = props.level % 2 === 0 ? 'roller-even-level-card' : 'roller-odd-level-card';

    return <div className={['roller-result-card', levelClass].join(' ')}>
        {props.children}
    </div>
}

function ExprAssignLabel(props: { name?: string, rhs: string }): React.ReactNode {
    if (props.name) {
        return <>{props.name + ' '} = {props.rhs}</>
    } else {
        return <>{props.rhs}</>
    }
}

function ConstantResultView(props: { result: ConstantResult, level: number }): React.ReactNode {
    return <ResultCard level={props.level}>
        <ExprAssignLabel
            name={props.result.name}
            rhs={props.result.value.toString()} />
    </ResultCard>
}

function DieRollResultView(props: { result: DieRollResult, level: number }) {
    return <ResultCard level={props.level}>
        <ExprAssignLabel
            name={props.result.name}
            rhs={`Roll d${props.result.die} \u2192 ${props.result.value}`} />
    </ResultCard>
}

function MultiDieRollResultView(props: { result: MultiDieRollResult, level: number }) {
    let sumStringComponents: Array<string> = props.result.dieResults.map((result) => {
        return result.toString()
    })

    return <ResultCard level={props.level}>
        <ExprAssignLabel
            name={props.result.name}
            rhs={`Roll ${props.result.dieResults.length}d${props.result.die} \u2192 ${sumStringComponents.join(' + ')} = ${props.result.value}`} />
    </ResultCard>
}

function SumResultView(props: { result: SumResult, level: number }) {
    let sumStringComponents: Array<string> = props.result.children.map((result) => {
        return result.value.toString()
    })

    return <div>
        <div style={{ paddingLeft: '1rem' }}>
            {
                props.result.children.map((result) => {
                    return <ResultView result={result} level={props.level + 1} />
                })
            }
        </div>
        <ResultCard level={props.level}>
            <ExprAssignLabel
                name={props.result.name}
                rhs={sumStringComponents.join(' + ') + ' = ' + props.result.value.toString()} />
        </ResultCard>
    </div>
}

export function ResultView(props: { result: Result, level: number }): React.ReactNode {
    const result = props.result;

    switch (result.kind) {
        case 'constant':
            return <ConstantResultView result={result} level={props.level} />
        case 'sumExpr':
            return <SumResultView result={result} level={props.level} />
        case 'dieRoll':
            return <DieRollResultView result={result} level={props.level} />
        case 'multiDieRoll':
            return <MultiDieRollResultView result={result} level={props.level} />
    }
}
