import { useContext } from "react";
import { ScoreContext } from "./ScoreManager";

export const useScoreManager = () => useContext(ScoreContext);
