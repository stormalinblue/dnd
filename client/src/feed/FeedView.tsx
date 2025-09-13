import React, { useRef, useLayoutEffect } from "react";
import { useFeed, type FeedItem } from "./feed";
import { ResultView } from "./ResultView";

function FeedItemView(props: {item: FeedItem}): React.ReactNode {
    
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
            feedItems.map((result) => {
                return <ResultView result={result} level={0} />
            })
        }
    </div>
}