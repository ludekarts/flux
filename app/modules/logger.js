import events from "./events";

// Display information about fired events and their payload.
export default function Logger (event, payload) {

  // Show only content from the _bucket.
  if (event === events.content.selection && payload)
    payload = payload.content();

  // Cut HTML content 125 characters.
  if (event === events.content.ready && payload)
    payload = payload.slice(0, 125) + ' [...]';

  // Log evevt output.
  console.log(`[Evt]: "${event}" -->`, payload);
};
