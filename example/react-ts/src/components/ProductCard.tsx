import { Box, Card, CardContent, CardMedia, Rating, Typography } from "@mui/material";
import { ProductInfo } from "../types/product.type";
import { useCallback } from "react";

const ProductCard = ({ value }: { value: ProductInfo }) => {
  const { title, description, image, price, rating } = value;
  const { rate } = rating;

  const trimText = useCallback((title: string, start = 20) => {
    let _title = title.substring(start, -1);

    if (_title !== title) _title += "...";

    return _title;
  }, []);

  return (
    <Card sx={{ maxWidth: 320 }}>
      <CardMedia component="img" height="250" src={image} />
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {trimText(title)}
        </Typography>
        <Typography variant="body2" gutterBottom>
          {trimText(description, 150)}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "inline-block",
              mr: 1,
            }}
          >
            $ {price}
          </Typography>
          <Rating size="small" value={rate} precision={0.1} readOnly />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
