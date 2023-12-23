import dataclasses
import inspect
import json
import requests

from dataclasses import dataclass, field
from typing import List, Literal

Difficulty = Literal["easy", "normal", "hard", "expert", "master", "append"]


@dataclass
class SongDifficulty:
    difficulty: Difficulty
    level: int
    notes: int


@dataclass
class Song:
    id: int
    seq: int
    releaseConditionId: int
    categories: List[str]
    title: str
    pronunciation: str
    creatorArtistId: int
    lyricist: str
    composer: str
    arranger: str
    dancerCount: int
    selfDancerPosition: int
    assetbundleName: str
    liveTalkBackgroundAssetbundleName: str
    publishedAt: int
    releasedAt: int
    liveStageId: int
    fillerSec: float
    isNewlyWrittenMusic: bool
    difficulty: dict[Difficulty, SongDifficulty] = field(default_factory=dict)
    enTitle: str = ""

    @classmethod
    def from_dict(cls, env: dict):
        return cls(
            **{k: v for k, v in env.items() if k in inspect.signature(cls).parameters}
        )


songs = requests.get(
    "https://sekai-world.github.io/sekai-master-db-diff/musics.json"
).json()
diffs = requests.get(
    "https://sekai-world.github.io/sekai-master-db-diff/musicDifficulties.json"
).json()
en_titles = requests.get("https://i18n-json.sekai.best/en/music_titles.json").json()

song_mapper: dict[int, Song] = {}
for song in songs:
    s = Song.from_dict(song)
    song_mapper[s.id] = s

for song_id, title in en_titles.items():
    song_mapper[int(song_id)].enTitle = title

for diff in diffs:
    d = SongDifficulty(
        diff["musicDifficulty"],
        diff["playLevel"],
        diff["totalNoteCount"],
    )
    song_mapper[diff["musicId"]].difficulty[diff["musicDifficulty"]] = d


class EnhancedJSONEncoder(json.JSONEncoder):
    def default(self, o):
        if dataclasses.is_dataclass(o):
            return dataclasses.asdict(o)
        return super().default(o)


with open("src/meta.json", "w", encoding="utf-8") as f:
    json.dump(
        list(song_mapper.values()),
        f,
        cls=EnhancedJSONEncoder,
        ensure_ascii=False,
    )
