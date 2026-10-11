/** At most two canvases run a frame loop at once. Each canvas keeps a single loop. */

type Entry = {
  priority: number;
  cancelled: boolean;
  grant: () => void;
};

const MAX = 2;
const queue: Entry[] = [];
let active = 0;

function pump() {
  queue.sort((a, b) => b.priority - a.priority);
  while (active < MAX && queue.length > 0) {
    const next = queue.shift();
    if (!next || next.cancelled) continue;
    active += 1;
    next.grant();
  }
}

export function acquireCanvas(priority: number, onGrant: () => void): () => void {
  const entry: Entry = {
    priority,
    cancelled: false,
    grant: onGrant,
  };
  queue.push(entry);
  pump();

  let released = false;
  return () => {
    if (released) return;
    released = true;
    entry.cancelled = true;
    const index = queue.indexOf(entry);
    if (index >= 0) {
      queue.splice(index, 1);
      return;
    }
    active = Math.max(0, active - 1);
    pump();
  };
}
