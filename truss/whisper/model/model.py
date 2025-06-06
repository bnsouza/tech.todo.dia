import base64
from tempfile import NamedTemporaryFile
from typing import Any, Dict

import requests
from faster_whisper import WhisperModel


class Model:
    def __init__(self, **kwargs) -> None:
        self._data_dir = kwargs["data_dir"]
        self._config = kwargs["config"]
        self._secrets = kwargs["secrets"]
        self._model = None

    def load(self):
        self._model = WhisperModel(self._config["model_metadata"]["model_id"])

    def preprocess(self, request: Dict) -> Dict:
        audio_base64 = request.get("audio")
        url = request.get("url")

        if audio_base64 and url:
            return {
                "error": "Only a base64 audio file OR a URL can be passed to the API, not both of them.",
            }
        if not audio_base64 and not url:
            return {
                "error": "Please provide either an audio file in base64 string format or a URL to an audio file.",
            }

        language = request.get("language", "en")

        binary_data = None

        if audio_base64:
            binary_data = base64.b64decode(audio_base64)
        elif url:
            resp = requests.get(url)
            binary_data = resp.content

        return {"data": binary_data, "language": language}

    def predict(self, request: Dict) -> Dict:
        if request.get("error"):
            return request

        audio_data = request.get("data")
        language = request.get("language")
        result_segments = []

        with NamedTemporaryFile() as fp:
            fp.write(audio_data)
            segments, info = self._model.transcribe(
                fp.name,
                language=language,
                temperature=0,
                best_of=5,
                beam_size=5,
                word_timestamps=True,
            )

            for segment in segments:
                for word in segment.words:
                    result_segments.append(
                        {
                            "text": word.word,
                            "startMs": word.start * 1000,
                            "endMs": word.end * 1000,
                        }
                    )

        return {
            "language": info.language,
            "duration": info.duration,
            "segments": result_segments,
        }
