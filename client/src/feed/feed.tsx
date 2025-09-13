import { createContext, useContext, useState } from "react";
import type { Result } from "../expr/expr";

export interface FeedItemOf<T> {
  date: Date,
  data: T
}

export type FeedItem = FeedItemOf<Result>;

export type FeedContextType = {
  feedItems: Array<FeedItem>;
  addToFeed: (feedItem: FeedItem) => void;
};

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<FeedItem[]>([]);

  const addItem = (item: FeedItem) => setItems(prev => [item, ...prev]);

  return (
    <FeedContext.Provider value={{ feedItems: items, addToFeed: addItem }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) throw new Error('useList must be used within a ListProvider');
  return context;
};