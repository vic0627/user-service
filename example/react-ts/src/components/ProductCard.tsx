import { Box, Card, CardContent, CardMedia, Rating, Typography } from "@mui/material";
import { ProductInfo } from "../types/product.type";
import { useCallback } from "react";
import styled from "styled-components";

const imageHeight = 220;

const StyledCardText = styled(CardContent)`
  padding-bottom: 0;
  height: calc(100% - 2rem);
`;

const StyledCardBody = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100% - ${imageHeight}px);
`;

const StyledCardFooter = styled(Box)`
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  margin-bottom: 1rem;
`;

const ProductCard = ({ value }: { value: ProductInfo }) => {
  const { title, description, image, price, rating } = value;
  const { rate } = rating;

  const trimText = useCallback((title: string, start = 30) => {
    let _title = title.substring(start, -1);

    if (_title !== title) _title += "...";

    return _title;
  }, []);

  return (
    <Card sx={{ maxWidth: 300, m: 2 }}>
      <CardMedia component="img" height={imageHeight} src={image} />
      <StyledCardBody>
        <StyledCardText sx={{ pb: 0 }}>
          <Typography variant="h5" gutterBottom>
            {trimText(title)}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {trimText(description, 150)}
          </Typography>
        </StyledCardText>
        <StyledCardFooter>
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
        </StyledCardFooter>
      </StyledCardBody>
    </Card>
  );
};

export default ProductCard;
