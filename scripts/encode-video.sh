#!/usr/bin/env bash
# Encode one source clip into the files a media entry expects.
# Usage: scripts/encode-video.sh <input> <id>
# Writes public/media/<id>-mobile.webm, <id>-mobile.mp4,
# <id>-desktop.webm, <id>-desktop.mp4 and <id>-poster.jpg.
set -euo pipefail

IN="${1:?Usage: scripts/encode-video.sh <input> <id>}"
ID="${2:?Usage: scripts/encode-video.sh <input> <id>}"
OUT="public/media"
mkdir -p "$OUT"

# Mobile: vertical 9:16 crop, 720 px wide, 30 fps, no audio
ffmpeg -i "$IN" -vf "crop=ih*9/16:ih,scale=720:-2,fps=30" -an -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 "$OUT/$ID-mobile.webm"
ffmpeg -i "$IN" -vf "crop=ih*9/16:ih,scale=720:-2,fps=30" -an -c:v libx264 -profile:v high -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/$ID-mobile.mp4"
# Desktop: 1920 px wide, 30 fps, no audio
ffmpeg -i "$IN" -vf "scale=1920:-2,fps=30" -an -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 "$OUT/$ID-desktop.webm"
ffmpeg -i "$IN" -vf "scale=1920:-2,fps=30" -an -c:v libx264 -profile:v high -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart "$OUT/$ID-desktop.mp4"
# Poster from the first second
ffmpeg -ss 1 -i "$IN" -frames:v 1 -q:v 3 "$OUT/$ID-poster.jpg"

warn() {
  local file="$1" limit="$2" label="$3"
  local bytes
  bytes=$(wc -c < "$file" | tr -d ' ')
  local human
  human=$(du -h "$file" | awk '{print $1}')
  echo "$label: $human ($bytes bytes)  $file"
  if [ "$bytes" -gt "$limit" ]; then
    echo "warning: $label is over budget. Trim the clip to 8–12 s or raise the CRF."
  fi
}

echo
echo "Encoded $ID"
warn "$OUT/$ID-mobile.webm" 3145728 "mobile webm"
warn "$OUT/$ID-mobile.mp4" 3145728 "mobile mp4"
warn "$OUT/$ID-desktop.webm" 8388608 "desktop webm"
warn "$OUT/$ID-desktop.mp4" 8388608 "desktop mp4"
warn "$OUT/$ID-poster.jpg" 1048576 "poster"
echo "Files over 4 MB should be uploaded to Vercel Blob and referenced by URL in src/content/media.ts."
