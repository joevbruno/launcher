import notifier from 'node-notifier';
import colors from 'colors/safe';

type NotificationOptions = {
  title: string,
  message: string,
  notify?: boolean,
  level?: 'info'|'warn'|'error'
};

export function log(options: NotificationOptions) {
  const title = `${options.title.toUpperCase()}`;

  if (options.notify) {
    notifier.notify({
      title,
      message: options.message,
    });
  }

  const level = options.level || 'info';
  const msg = `==> ${title} -> ${options.message}`;

  switch (level) {
    case 'warn': console.log(colors.red(msg)); break;
    case 'error': console.log(colors.bgRed.white(msg)); break;
    case 'info':
    default: console.log(colors.green(msg));
  }
}
