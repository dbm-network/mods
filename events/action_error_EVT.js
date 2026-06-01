module.exports = {
  name: 'Action Error',
  isEvent: true,

  fields: [
    'Temp Variable Name (stores error message):',
    'Temp Variable Name (stores action name):',
    'Temp Variable Name (stores error stack trace):',
  ],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;

    // Store original displayError function
    const originalDisplayError = Actions.displayError;

    // Override displayError to emit event
    Actions.displayError = function displayErrorWithEvent(actionData, cache, error) {
      // Call original function first
      if (originalDisplayError) {
        originalDisplayError.call(this, actionData, cache, error);
      }

      // Emit error event if it exists
      if (Bot.$evts && Bot.$evts['Action Error']) {
        const server = cache.server;
        const errorMessage = error?.message || String(error) || 'Unknown error';
        const actionName = actionData?.name || 'Unknown Action';
        const stackTrace = error?.stack || 'No stack trace available';

        for (const event of Bot.$evts['Action Error']) {
          const temp = {};
          if (event.temp) temp[event.temp] = errorMessage;
          if (event.temp2) temp[event.temp2] = actionName;
          if (event.temp3) temp[event.temp3] = stackTrace;
          Actions.invokeEvent(event, server, temp);
        }
      }
    };
  },
};
