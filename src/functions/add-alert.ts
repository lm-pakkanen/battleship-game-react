import { AlertQueue } from "../constructors/AlertQueue";

let alertQueue: undefined | AlertQueue;

export const addAlert = (value: unknown) => {
  if (!alertQueue) {
    return;
  }

  let msg: string;

  if (value instanceof Error) {
    msg = value.message;
  } else {
    msg = value?.toString() || "Unknown error";
  }

  alertQueue.alert(msg);
};

addAlert.createQueue = () => {
  alertQueue = new AlertQueue();
};
