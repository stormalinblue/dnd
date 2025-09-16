import React, { useRef, useLayoutEffect } from "react";
import { useFeed, type FeedItem } from "./feed";
import { ResultView } from "./ResultView";

function DateTag(props: {date: Date}) {
    const iso = props.date.toISOString()

    return <time dateTime={iso}>{props.date.toLocaleString()}</time>
}

function FeedItemView(props: {item: FeedItem}): React.ReactNode {
    switch (props.item.kind) {
        case 'result':
            return <div>
                <ResultView result={props.item.data} level={0} />
                <DateTag date={props.item.date} />
            </div>
    }
   
}

export function FeedView(): React.ReactNode {
    const { feedItems } = useFeed();
    const feedRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (feedRef.current !== null) {
            feedRef.current.scrollTop = 0;
        }
    }, [feedItems])

    return <div ref={feedRef} style={{ display: 'flex', flexDirection: 'column-reverse', height: '100%', overflowY: 'auto', scrollBehavior: 'smooth' }}>
        {
            feedItems.map((item) => {
                return <FeedItemView item={item} />
            })
        }
    </div>
}