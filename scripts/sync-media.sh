#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="${RCLUB_MEDIA_SOURCE:-$HOME/Documents/Rclub}"
TARGET_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/media"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Source introuvable: $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$TARGET_DIR/events"

cp "$SOURCE_DIR/logo.png" "$TARGET_DIR/logo.png"
cp "$SOURCE_DIR/hero.mp4" "$TARGET_DIR/hero.mp4"
cp "$SOURCE_DIR/bg.png" "$TARGET_DIR/hero-poster.png"
cp "$SOURCE_DIR/mobile-bg.png" "$TARGET_DIR/hero-poster-mobile.png"
cp "$SOURCE_DIR/Embleme OR 1.png" "$TARGET_DIR/emblem.png"

cp "$SOURCE_DIR/events/ADULTS ONLY V5.png" "$TARGET_DIR/events/adults-only-v5.png"
cp "$SOURCE_DIR/events/LEGEND R.png" "$TARGET_DIR/events/legend-r.png"
cp "$SOURCE_DIR/events/R FAMILY.png" "$TARGET_DIR/events/r-family.png"
cp "$SOURCE_DIR/events/TAKE ME BACK 15 MAI.png" "$TARGET_DIR/events/take-me-back-15-mai.png"
cp "$SOURCE_DIR/events/VEN 8 MAI post.png" "$TARGET_DIR/events/ven-8-mai.png"

echo "Medias synchronises vers $TARGET_DIR"
