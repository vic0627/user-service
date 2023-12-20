export interface AlertItem {
  _id: number;
  title: string;
  message: string;
  /** @default "error" */
  type?: "error" | "info" | "success" | "warning";
  /** @default "standard" */
  variant?: "filled" | "outlined" | "standard";
}
