import { Dialog, DialogContent, DialogProps, DialogTitle } from "@mui/material";

interface ResultDialogOptions extends DialogProps {
  title: string;
}

const ResultDialog = (options: ResultDialogOptions) => {
  const { children, title } = options;
  return (
    <Dialog {...options} maxWidth="xl">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
      }}>{children}</DialogContent>
    </Dialog>
  );
};

export default ResultDialog;
