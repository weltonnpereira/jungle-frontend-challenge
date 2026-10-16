export type TypeMessage = "success" | "error";

export interface NotificationItem {
  message: string;
  typeMessage: TypeMessage;
}
