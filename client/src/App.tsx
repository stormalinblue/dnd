import './App.scss';

import { FeedProvider } from './feed/feed';
import { FeedView } from './feed/FeedView';
import { CharacterDetail } from './character/CharacterDetail';

function App() {
  return (
    <>
      <FeedProvider>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100vw',
            height: '100vh',
          }}
        >
          <div style={{ flex: 3, height: '100%', overflowY: 'scroll' }}>
            <CharacterDetail />
          </div>
          <div style={{ flex: 1, height: '100%' }}>
            <FeedView />
          </div>
        </div>
      </FeedProvider>
    </>
  );
}

export default App;
