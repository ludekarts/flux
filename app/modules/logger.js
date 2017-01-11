import events from "./events";

// Display information about fired events and their payload.
export default function Logger (event, payload) {
  // Show only content from the _bucket.
  if (event === events.content.selection && payload)
    payload = payload.content();
  // Log evevt output.
  console.log(`[Evt]: "${event}" -->`, payload);
};
