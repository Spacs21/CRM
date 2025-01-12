import { useState } from "react";
import {  useMutation } from "@tanstack/react-query";
import { request } from "@/api/";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slice/auth-slice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const mutation = useMutation({
    mutationFn: (data: { username: string; password: string }) => {
      return request
        .post("/admin/sign-in", data)
        .then((res) => res.data)
        .catch((err) => {
          throw err; 
        });
    },
    onSuccess: (data) => {
      dispatch(login(data.innerData.token))
      navigate("/")
    },
    onError: () => {
    },
  });


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    mutation.mutate({ username, password });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: 3,
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {mutation.isError && (
            <Alert severity="error" >
              {(mutation.error as any)?.response.data.msg}
            </Alert>
          )}
          <Button
            type="submit" 
            variant="contained"
            color="primary"
            fullWidth
            disabled={mutation.isPending}
            startIcon={mutation.isPending && <CircularProgress size={20} />}
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
