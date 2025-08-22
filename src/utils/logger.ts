const logPrefix = "HHD-Decky";

export const log = (...args: any[]) => {
  console.log(
    `%c ${logPrefix} %c`,
    "background: #16a085; color: black;",
    "background: #1abc9c; color: black;",
    "background: transparent;",
    ...args,
  );
};

export const debug = (...args: any[]) => {
  console.debug(
    `%c ${logPrefix} %c`,
    "background: #16a085; color: black;",
    "background: #1abc9c; color: black;",
    "color: blue;",
    ...args,
  );
};

export const error = (...args: any[]) => {
  console.error(
    `%c ${logPrefix} %c`,
    "background: #16a085; color: black;",
    "background: #FF0000;",
    "background: transparent;",
    ...args,
  );
};
