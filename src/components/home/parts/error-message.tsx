import "./error-message.css";

export interface ErrorMessage {
  msg: undefined | string;
  isInputError?: boolean;
}

export const ErrorMessage = ({ msg, isInputError }: ErrorMessage) => {
  const classNames: string[] = ["error-message"];

  if (isInputError) {
    classNames.push("input-error-message");
  }

  return <span className={classNames.join(" ")}>{msg || null}</span>;
};
