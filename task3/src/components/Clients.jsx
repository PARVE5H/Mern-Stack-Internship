import {
  Avatar,
  Box,
  CloseButton,
  Dialog,
  Portal,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

const Clients = ({ username }) => {
  const [showClientDialogBox, setShowClientDialogBox] = useState(false);
  const colorPalette = ["red", "blue", "green", "yellow", "purple", "orange"];
  const pickPalette = (name) => {
    const index = name.charCodeAt(0) % colorPalette.length;
    return colorPalette[index];
  };
  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        borderRadius={"lg"}
        p={1}
        m={0}
        bg="gray.500"
        color={"#fff"}
        width={{ base: "60px", lg: "75px" }}
        height={"75px"}
        cursor={"pointer"}
        onClick={() => {
          setShowClientDialogBox(true);
        }}
      >
        <Avatar.Root
          m={0}
          colorPalette={pickPalette(username)}
          size="md"
          shape={"rounded"}
        >
          <Avatar.Fallback name={username} />
        </Avatar.Root>
        <Text
          maxLines={1}
          fontWeight={"semibold"}
          noOfLines={1}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          maxWidth="100%"
        >
          {username}
        </Text>
      </Box>

      <Dialog.Root
        open={showClientDialogBox}
        onOpenChange={() => setShowClientDialogBox(false)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner m={3} p={3}>
            <Dialog.Content
              borderRadius={"2xl"}
              bg={"gray.800"}
              maxWidth={"400px"}
            >
              <Dialog.Header>
                <Dialog.Title fontSize={"xl"} color={"#fff"}>
                  {username}'s Profile
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body
                color={"#fff"}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={3}
              >
                <Avatar.Root
                  colorPalette={pickPalette(username)}
                  shape={"full"}
                  size={"2xl"}
                  variant={"outline"}
                  marginBottom={2}
                >
                  <Avatar.Fallback name={username} />
                </Avatar.Root>
                <Text
                  fontSize={"2xl"}
                  textAlign={"center"}
                  fontWeight={"semibold"}
                >
                  {username}
                </Text>
              </Dialog.Body>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

export default Clients;
