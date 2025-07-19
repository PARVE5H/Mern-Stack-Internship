import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Image, Text } from "@chakra-ui/react";
import logo from "../assets/logo.png";
import Clients from "../components/Clients";
import EditorArea from "../components/Editor";
import { initSocket } from "../socket.config";
import { ACTIONS } from "../Action";
import {
  useLocation,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { toaster } from "../components/ui/toaster";
import { AlignJustify } from "lucide-react";

const EditorPage = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [showSideBar, setShowSideBar] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        socketRef.current = await initSocket();

        //  connection
        socketRef.current.on("connect", () => {
          // Join the room
          socketRef.current.emit(ACTIONS.JOIN, {
            roomId,
            username: location.state?.username || "Anonymous",
          });
        });

        // Listening for joined event
        socketRef.current.on(
          ACTIONS.JOINED,
          ({ clients, username, socketId }) => {
            if (username !== location.state?.username) {
              toaster.create({
                title: `${username} joined the room`,
                type: "success",
                duration: 5000,
                closable: true,
              });
            }
            setClients(clients);
          }
        );

        // Listening for disconnected
        socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
          toaster.create({
            title: `${username} left the room`,
            type: "info",
            duration: 5000,
            closable: true,
          });
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        });

        // Listening for errors
        socketRef.current.on("connect_error", (error) => {
          handleErrors(error);
        });
        socketRef.current.on("connect_failed", (error) => {
          handleErrors(error);
        });
      } catch (error) {
        console.error("Socket initialization error:", error);
      }
    };

    init();

    // Cleanup on unmount
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLeaveRoom = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    toaster.create({
      title: "You left the room",
      type: "info",
      duration: 2000,
      closable: true,
    });
    navigate("/");
  };

  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    toaster.create({
      title: "ROOM ID copied successfully!",
      type: "success",
      duration: 2000,
      closable: true,
    });
  };

  const handleErrors = (err) => {
    toaster.create({
      title: "Socket connection failed",
      description: err.message,
      type: "error",
      duration: 5000,
      closable: true,
    });
    navigate("/");
  };

  if (!location.state) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Box
        display={"flex"}
        width="100%"
        height={"100vh"}
        gap={1}
        bg={"gray.950"}
      >
        {" "}
        <Box
          cursor={"pointer"}
          position="fixed"
          top="10px"
          right="20px"
          zIndex={9999}
          borderRadius={"lg"}
          bg={"gray.600"}
          padding={1}
          onClick={() => {
            setShowSideBar(!showSideBar);
          }}
        >
          <AlignJustify />
        </Box>
        {showSideBar && (
          <Box
            width={{ base: "50%", md: "20%" }}
            maxWidth={{ base: "150px", md: "180px" }}
            bg={"gray.700"}
            borderRightRadius={"xl"}
          >
            <Box
              m={1}
              p={2}
              id="aside-inner"
              height={"100%"}
              display={"flex"}
              flexDirection={"column"}
            >
              <Box
                m={1}
                p={1}
                display={"flex"}
                justifyContent={"start"}
                flexWrap={"wrap"}
                gap={2}
                alignItems={"center"}
                overflow={"hidden"}
              >
                <Image
                  height={"50px"}
                  width={"50px"}
                  src={logo}
                  alt="logo"
                ></Image>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  justifyContent={"center"}
                  alignItems={"start"}
                >
                  <Text
                    m={0}
                    mb={-3}
                    fontSize={"xl"}
                    color={"#ffffff"}
                    fontWeight={"semibold"}
                  >
                    Code
                  </Text>
                  <Text
                    fontSize={"xl"}
                    color={"#924a4c"}
                    fontWeight={"semibold"}
                  >
                    Sanvaad
                  </Text>
                </Box>
              </Box>
              <Box as={"hr"} height={"2px"} background={"#fff"}></Box>

              <Box
                display={"flex"}
                justifyContent={"center"}
                flexDir={"column"}
                marginTop={2}
                marginBottom={2}
              >
                <Button
                  variant={"solid"}
                  size={"md"}
                  colorPalette={"white"}
                  m={2}
                  overflow={"hidden"}
                  onClick={handleCopyRoomId}
                  bg={"teal.500"}
                  color={"#fff"}
                >
                  Copy ROOM ID
                </Button>
                <Button
                  color={"#fff"}
                  size={"md"}
                  colorPalette={"red"}
                  m={2}
                  onClick={handleLeaveRoom}
                >
                  Leave
                </Button>
              </Box>
              <Box as={"hr"} height={"2px"} background={"#fff"}></Box>

              <Text m={2} fontSize={{ base: "xs", md: "lg" }} color={"#fff"}>
                Connected - Clients
              </Text>

              <Box
                display={"flex"}
                flexDirection={"row"}
                alignItems={"flex-start"}
                flexWrap={"wrap"}
                height={"auto"}
                maxHeight={"50vh"}
                overflowY={"auto"}
                gap={1}
              >
                {clients.map((client) => (
                  <Clients key={client.socketId} username={client.username} />
                ))}
              </Box>
            </Box>
          </Box>
        )}
        <Box
          flex={1}
          bg={"gray.900"}
          borderLeftRadius={"xl"}
          height={"100vh"}
          overflow={"hidden"}
        >
          <EditorArea socketRef={socketRef.current} roomId={roomId} />
        </Box>
      </Box>
    </>
  );
};

export default EditorPage;
