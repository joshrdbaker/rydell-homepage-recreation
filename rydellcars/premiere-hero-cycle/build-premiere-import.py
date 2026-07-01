#!/usr/bin/env python3
"""Generate FCP7 XML for Premiere Pro import (File > Import)."""

from pathlib import Path
import urllib.parse

PACKAGE_DIR = Path(__file__).resolve().parent
MEDIA_DIR = PACKAGE_DIR / "media"
OUTPUT = PACKAGE_DIR / "hero-video-cycle.xml"

SEQ_FPS = 30
SEQ_RATE = f"{SEQ_FPS}/1"


def file_url(path: Path) -> str:
    return "file://" + urllib.parse.quote(path.resolve().as_posix(), safe="/:")


def frames(seconds: float, fps: float) -> int:
    return int(round(seconds * fps))


def rate_block(fps: float) -> str:
    if abs(fps - 23.976) < 0.02:
        return """          <rate>
            <timebase>24</timebase>
            <ntsc>TRUE</ntsc>
          </rate>"""
    return f"""          <rate>
            <timebase>{int(round(fps))}</timebase>
            <ntsc>FALSE</ntsc>
          </rate>"""


def file_block(file_id: str, name: str, path: Path, duration_s: float, fps: float, width: int, height: int) -> str:
    dur = frames(duration_s, fps)
    return f"""        <file id="{file_id}">
          <name>{name}</name>
          <pathurl>{file_url(path)}</pathurl>
{rate_block(fps)}
          <duration>{dur}</duration>
          <media>
            <video>
              <samplecharacteristics>
                <width>{width}</width>
                <height>{height}</height>
              </samplecharacteristics>
            </video>
          </media>
        </file>"""


def clipitem(
    clip_id: str,
    masterclip_id: str,
    file_id: str,
    name: str,
    seq_start: int,
    seq_end: int,
    src_in: int,
    src_out: int,
    fps: float,
) -> str:
    return f"""              <clipitem id="{clip_id}">
                <masterclipid>{masterclip_id}</masterclipid>
                <name>{name}</name>
{rate_block(fps)}
                <start>{seq_start}</start>
                <end>{seq_end}</end>
                <in>{src_in}</in>
                <out>{src_out}</out>
                <file id="{file_id}"/>
              </clipitem>"""


MEDIA = {
    "1950": {
        "path": MEDIA_DIR / "1950.mp4",
        "fps": 23.976,
        "duration": 37.08,
        "width": 768,
        "height": 432,
    },
    "1960": {
        "path": MEDIA_DIR / "1960.mp4",
        "fps": 23.976,
        "duration": 6.76,
        "width": 768,
        "height": 432,
    },
    "1990": {
        "path": MEDIA_DIR / "1990.mp4",
        "fps": 23.98,
        "duration": 134.61,
        "width": 768,
        "height": 432,
    },
    "bgVideo": {
        "path": MEDIA_DIR / "bgVideo.mp4",
        "fps": 30.0,
        "duration": 20.0,
        "width": 1280,
        "height": 720,
    },
}

# Matches rydellcars/js/hero-video-cycle.js
EDITS = [
    ("1950", 0, 2.5, 0, 2.5),
    ("bgVideo", 2.0, 2.0, 2.0, 4.0, "Silverado A"),
    ("1960", 0, 2.0, 0, 2.0),
    ("bgVideo", 8.0, 2.0, 8.0, 10.0, "Silverado B"),
    ("1990", 0, 2.0, 0, 2.0),
    ("bgVideo", 14.0, 2.0, 14.0, 16.0, "Equinox trio"),
]

file_blocks = []
file_ids_added = set()
clipitems = []
timeline = 0

for index, edit in enumerate(EDITS, start=1):
    key = edit[0]
    src_in_s = edit[1]
    dur_s = edit[2]
    alt_name = edit[5] if len(edit) > 5 else key
    meta = MEDIA[key]
    file_id = f"file-{key}" if key != "bgVideo" else "file-bgVideo"
    masterclip_id = f"masterclip{index}"
    clip_id = f"clipitem{index}"
    label = alt_name if alt_name != key else key

    if file_id not in file_ids_added:
        file_ids_added.add(file_id)
        file_blocks.append(
            file_block(
                file_id,
                meta["path"].name,
                meta["path"],
                meta["duration"],
                meta["fps"],
                meta["width"],
                meta["height"],
            )
        )

    seq_len = frames(dur_s, SEQ_FPS)
    src_in = frames(src_in_s, meta["fps"])
    src_out = frames(src_in_s + dur_s, meta["fps"])

    clipitems.append(
        clipitem(
            clip_id,
            masterclip_id,
            file_id,
            label,
            timeline,
            timeline + seq_len,
            src_in,
            src_out,
            meta["fps"],
        )
    )
    timeline += seq_len

sequence_duration = timeline

xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4">
  <project>
    <name>Hero Video Cycle</name>
    <children>
      <bin>
        <name>Media</name>
        <children>
{chr(10).join(file_blocks)}
        </children>
      </bin>
      <sequence id="sequence-1">
        <name>Hero Video Cycle (Web)</name>
        <duration>{sequence_duration}</duration>
        <rate>
          <timebase>{SEQ_FPS}</timebase>
          <ntsc>FALSE</ntsc>
        </rate>
        <media>
          <video>
            <format>
              <samplecharacteristics>
                <width>1280</width>
                <height>720</height>
                <rate>
                  <timebase>{SEQ_FPS}</timebase>
                  <ntsc>FALSE</ntsc>
                </rate>
              </samplecharacteristics>
            </format>
            <track>
{chr(10).join(clipitems)}
            </track>
          </video>
        </media>
      </sequence>
    </children>
  </project>
</xmeml>
"""

OUTPUT.write_text(xml, encoding="utf-8")
print(f"Wrote {OUTPUT}")
