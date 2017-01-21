/* eslint-disable no-console */
export function sendFeedback(consoleMessage, processMessage) {
  if (process.send && processMessage) {
    process.send(processMessage);
  } else if (typeof consoleMessage === 'function') {
    consoleMessage();
  } else {
    console.log(consoleMessage); // eslint-disable-line
  }
}

export function buildStartMessage(task, time, customEnding) {
  let message = `Creating ${task} files. This usually takes about ${time} seconds to complete.`; // eslint-disable-line

  if (customEnding) {
    message += customEnding;
  }
  message += ' Standby...';

  return message;
}

export function handleWebpackFeedback(stats) {
  return () => {
    const { errors, assets, time, version, hash, warnings } = stats ? stats.toJson() : {};
    const assetList = assets && assets.length > 0 ? assets.map((asset, index) => `${'\n'}
        ${index + 1}: ${asset.name.toString()}`).join(', \n') : "NONE";

    console.log(`
        Built ${assets ? assets.length : 0} assets in ${time}ms.
        Ran with Webpack v${version} - ${hash}.
        ERRORS: ${errors && errors.length > 0 ? errors : 0}
        WARNINGS: ${warnings && warnings.length > 0 ? warnings : 0}
    `
    );

    console.log('====================================');
    if (errors && errors.length === 0) {
      console.log('Created the following files: ');
    }
    console.log(assetList);

    return { errors, warnings };
  };
}
