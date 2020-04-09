/**
 * Webpage model events
 */

import {EventEmitter} from 'events';
var WebpageEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
WebpageEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
function registerEvents(Webpage) {
  for(var e in events) {
    let event = events[e];
    Webpage.post(e, emitEvent(event));
  }
}

function emitEvent(event) {
  return function(doc) {
    WebpageEvents.emit(event + ':' + doc._id, doc);
    WebpageEvents.emit(event, doc);
  };
}

export {registerEvents};
export default WebpageEvents;
