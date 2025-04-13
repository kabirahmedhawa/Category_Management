// src/components/Profile.tsx
import React, { useEffect, useState } from "react";
import { Typography, Paper, CircularProgress, Stack } from "@mui/material";
import api from "../api";

interface User {
  username: string;
  email: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => setUser(res.data))
      .catch(() => alert("Failed to fetch profile"));
  }, []);

  if (!user)
    return (
      <Stack
        direction={"row"}
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
      >
        <CircularProgress sx={{ mt: 4 }} />
      </Stack>
    );

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 5 }}>
      <Typography variant="h5">Profile</Typography>
      <Typography>
        <strong>Username:</strong> {user.username}
      </Typography>
      <Typography>
        <strong>Email:</strong> {user.email}
      </Typography>
    </Paper>
  );
};

export default Profile;
