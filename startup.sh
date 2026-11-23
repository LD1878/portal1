#!/bin/sh
# Restart contract: revive the preview by ensuring npm run dev is up on 8080.
set -eu
cd /workspace

if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi

npm run dev > /tmp/codex-dev.log 2>&1 &
pid=$!

i=0
while [ "$i" -lt 40 ]; do
  if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
    exit 0
  fi
  if ! kill -0 "$pid" 2>/dev/null; then
    echo "dev server exited" >&2
    tail -n 80 /tmp/codex-dev.log >&2 || true
    exit 1
  fi
  i=$((i + 1))
  sleep 0.5
done

echo "dev server did not become ready" >&2
tail -n 80 /tmp/codex-dev.log >&2 || true
exit 1
