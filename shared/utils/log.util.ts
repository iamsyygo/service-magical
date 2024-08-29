import * as figlet from 'figlet';
import BigFont from 'figlet/importable-fonts/Big.js';
figlet.parseFont('Big', BigFont);

export const consoleAppName = (name: string, submoduleName?: string) => {
  let text = name;

  if (submoduleName) {
    text = name + '  ' + submoduleName;
  }

  figlet.text(
    text,
    { font: 'Big', horizontalLayout: 'default', verticalLayout: 'default' },
    (error, text) => {
      console.log(text);
    },
  );
};
