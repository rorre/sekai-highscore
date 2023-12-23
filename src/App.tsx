import NewScore from "./components/NewScore";
import { ScoreManager } from "./components/ScoreManager";
import ScoreList from "./components/ScoreList";
import Settings from "./components/Settings";
import ActionArea from "./components/base/ActionArea";

function App() {
  return (
    <ScoreManager>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">Sekai Highscore Track</a>
        </div>
        <div className="navbar-end">
          <Settings />
        </div>
      </div>

      <div className="container py-8 mx-auto">
        <ActionArea
          title="Upload New Score"
          label="Got a new score? Upload it, and we'll record your score!"
          className="border-primary"
          button={<NewScore />}
        />
        <ScoreList />
      </div>
    </ScoreManager>
  );
}

export default App;
