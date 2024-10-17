import * as figlet from 'figlet';

export const consoleAppName = (name: string, submoduleName?: string) => {
  let text = name;

  if (submoduleName) {
    text = name + '  ' + submoduleName;
  }

  figlet.text(
    text,
    { font: 'slant', horizontalLayout: 'default', verticalLayout: 'default' },
    (error, text) => {
      console.log(text);
    },
  );
};
