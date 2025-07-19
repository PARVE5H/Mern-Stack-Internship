/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Box,
  Button,
  Field,
  Fieldset,
  Group,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import { toaster } from "../components/ui/toaster";
import logo from "../assets/logo.png";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { Copy, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const [roomdId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toaster.create({
      title: "New Room Created!",
      description: "Your CodeSanvaad session is ready. Invite others to join!",
      type: "info",
      duration: 6000,
      closable: true,
    });
  };

  const joinRoom = () => {
    setLoading(true);
    if (!roomdId || !username) {
      toaster.create({
        title: "Incomplete Information",
        description: "Please provide all the fields.",
        type: "warning",
        duration: 5000,
        closable: true,
      });
      setLoading(false);
      return;
    }
    navigate(`/editor/${roomdId}`, {
      state: {
        username,
      },
    });
    setLoading(false);
    toaster.create({
      title: "Room Joined Successfully!",
      description: "Entering Room.....",
      type: "success",
      duration: 2000,
      closable: true,
    });
  };

  const handleCopyRoom = () => {
    if (!roomdId) return;
    navigator.clipboard.writeText(roomdId);
    toaster.create({
      title: "ROOM ID copied successfully!",
      type: "success",
      duration: 2000,
      closable: true,
    });
  };
  return (
    <>
      {/* Homepage Box  */}
      <Box
        width={"100%"}
        height={"100vh"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        bgGradient="to-br"
        gradientFrom="#4b2324ff"
        gradientTo="#0a0a0a"
      >
        {/* Form Box */}
        <Box
          m={3}
          display={"flex"}
          flexDirection={"column"}
          maxWidth={"2xl"}
          bg={"gray.800"}
          shadow={"xl"}
          borderRadius={"lg"}
          padding={5}
          gap={4}
        >
          {/* Form Header ---> Logo, Name and Tagline */}
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"start"}
            overflow={"hidden"}
            padding={1}
          >
            <Image
              width={"120px"}
              rounded={"md"}
              src={logo}
              alt="logo"
              aspectRatio={4 / 3}
              objectFit={"contain"}
            ></Image>
            {/* Sitename + Tagline Box  */}
            <Box display={"flex"} flexDirection={"column"} borderRadius={"md"}>
              {/* Sitename Box  */}
              <Box display={"flex"} flexDirection={"row"}>
                <Text fontSize={"3xl"} color={"#fff"} fontWeight={"semibold"}>
                  Code
                </Text>
                <Text
                  fontSize={"3xl"}
                  color={"#924a4c"}
                  fontWeight={"semibold"}
                >
                  Sanvaad
                </Text>
              </Box>
              <Text fontSize={{ base: "xs", sm: "sm" }} color={"#fff"}>
                Code Together. Create Together.
              </Text>
            </Box>
          </Box>

          {/* Input Form  */}
          <Fieldset.Root size={"md"} maxW={"lg"}>
            <Fieldset.Legend
              color={"#fff"}
              fontSize={"xl"}
              textAlign={"center"}
            >
              Join the Sanvaad
            </Fieldset.Legend>
            <Fieldset.Content>
              <Field.Root>
                <Group attached w="full">
                  <Input
                    flex={1}
                    type="text"
                    value={roomdId}
                    onChange={(e) => setRoomId(e.target.value)}
                    variant={"subtle"}
                    placeholder="ROOM ID"
                    overflow={"hidden"}
                    bg={"gray.900"}
                    color={"gray.100"}
                  ></Input>{" "}
                  <Button
                    bg={"gray.900"}
                    color={"gray.500"}
                    variant={"subtle"}
                    onClick={handleCopyRoom}
                    p={0}
                    m={0}
                  >
                    <Copy />
                  </Button>
                  <Button
                    bg={"gray.900"}
                    color={"gray.500"}
                    variant={"subtle"}
                    onClick={() => {
                      setRoomId("");
                    }}
                    p={0}
                    m={0}
                  >
                    <X />
                  </Button>
                </Group>
              </Field.Root>
              <Field.Root>
                <Group attached w="full">
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                    }}
                    variant={"subtle"}
                    placeholder="USERNAME"
                    bg={"gray.900"}
                    color={"gray.100"}
                  ></Input>
                  <Button
                    bg={"gray.900"}
                    color={"gray.500"}
                    variant={"subtle"}
                    onClick={() => {
                      setUsername("");
                    }}
                    p={0}
                    m={0}
                  >
                    <X />
                  </Button>
                </Group>
              </Field.Root>
            </Fieldset.Content>
            <Button
              variant={"plain"}
              bg={"#924a4c"}
              fontSize={"larger"}
              _hover={{
                bg: "#6a3031ff",
                boxShadow: "sm",
                color: "#e5e1e1ff",
              }}
              onClick={joinRoom}
              loading={loading}
              color={"#fff"}
            >
              Join
            </Button>
            <Text
              display={"flex"}
              gap={1}
              justifyContent={"end"}
              fontSize={"md"}
              color={"#fff"}
              marginRight={2}
            >
              Create a{" "}
              <a onClick={createNewRoom} href="#" style={{ color: "#924a4c" }}>
                new room
              </a>
            </Text>
          </Fieldset.Root>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;
