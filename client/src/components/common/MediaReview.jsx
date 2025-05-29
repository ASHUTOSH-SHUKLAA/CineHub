import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import Container from "./Container";
import reviewApi from "../../api/modules/review.api";
import TextAvatar from "./TextAvatar";

const ReviewItem = ({ review, onRemoved }) => {
  const { user } = useSelector((state) => state.user);

  const [onRequest, setOnRequest] = useState(false);

  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const { response } = await reviewApi.remove({ reviewId: review.id });

    if (response) onRemoved(review.id);
    setOnRequest(false);
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
      <TextAvatar text={review.user.displayName} />
      <Stack spacing={1} sx={{ flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="subtitle2" fontWeight="bold">
            {review.user.displayName}
          </Typography>
          <Typography variant="caption">
            {dayjs(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </Typography>
        </Stack>
        <Typography variant="body1">{review.content}</Typography>
        {user && user.id === review.user.id && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <LoadingButton
              variant="text"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              loading={onRequest}
              onClick={onRemove}
            >
              remove
            </LoadingButton>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

const MediaReview = ({ reviews, onReviewAdded }) => {
  const { user } = useSelector((state) => state.user);
  const [onRequest, setOnRequest] = useState(false);
  const [content, setContent] = useState("");

  const onAddReview = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const { response } = await reviewApi.add({ content });

    if (response) {
      setContent("");
      onReviewAdded(response);
    }
    setOnRequest(false);
  };

  return (
    <Container>
      <Stack spacing={4} sx={{ py: 4 }}>
        <Stack direction="row" spacing={2}>
          <TextAvatar text={user?.displayName} />
          <Stack spacing={2} sx={{ flex: 1 }}>
            <Typography variant="h6">Add a review</Typography>
            <TextField
              value={content}
              onChange={e => setContent(e.target.value)}
              multiline
              rows={4}
              placeholder="Write your review"
              variant="outlined"
            />
            <LoadingButton
              variant="contained"
              size="large"
              sx={{
                width: "max-content"
              }}
              startIcon={<SendOutlinedIcon />}
              loading={onRequest}
              onClick={onAddReview}
            >
              post
            </LoadingButton>
          </Stack>
        </Stack>

        <Divider />

        <Stack spacing={4}>
          {reviews.map(review => (
            <ReviewItem key={review.id} review={review} onRemoved={onReviewAdded} />
          ))}
        </Stack>
      </Stack>
    </Container>
  );
};

export default MediaReview;
