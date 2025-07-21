import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useAuthStore } from "../store/authStore";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, register, error, isLoading } = useAuthStore();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = isLogin
      ? await login(email, password)
      : await register(email, password);

    if (success) {
      toast({
        title: isLogin ? "Logged in successfully" : "Registered successfully",
        status: "success",
        duration: 3000,
      });
      if (!isLogin) {
        setIsLogin(true);
      }
    } else {
      toast({
        title: "Error",
        description: error,
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="gray.100"
            textAlign="center"
            mb={2}
          >
            {isLogin ? "Welcome Back!" : "Create Account"}
          </Text>
          <FormControl>
            <FormLabel color="gray.400">Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              borderColor="gray.600"
              _hover={{ borderColor: "gray.400" }}
              _focus={{
                borderColor: "gray.400",
                boxShadow: "0 0 0 1px #319795",
              }}
              placeholder="Enter your email"
              size="md"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="gray.400">Password</FormLabel>
            <InputGroup size="md">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                borderColor="gray.600"
                _hover={{ borderColor: "gray.400" }}
                _focus={{
                  borderColor: "gray.400",
                  boxShadow: "0 0 0 1px #319795",
                }}
                placeholder="Enter your password"
                pr="4.5rem"
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  variant="ghost"
                  colorScheme="gray"
                  onClick={() => setShowPassword(!showPassword)}
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  _hover={{ bg: "gray.600" }}
                  _active={{ bg: "gray.500" }}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button
            type="submit"
            colorScheme="gray"
            width="100%"
            isLoading={isLoading}
            size="md"
            mt={2}
          >
            {isLogin ? "Sign In" : "Create Account"}
          </Button>
          <Text
            cursor="pointer"
            color="gray.400"
            _hover={{ color: "gray.300" }}
            onClick={() => setIsLogin(!isLogin)}
            fontSize="sm"
            textAlign="center"
            mt={2}
          >
            {isLogin
              ? "New to TimeTracker? Create an account"
              : "Already have an account? Sign in"}
          </Text>
        </VStack>
      </form>
    </Box>
  );
};

export default Auth;
