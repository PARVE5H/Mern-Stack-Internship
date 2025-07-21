import React, { useState, useEffect, useCallback, useRef } from "react";
import "./popup.css";
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  Text,
  Divider,
  useToast,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import ChartDisplay from "./components/ChartDisplay";
import Auth from "./components/Auth";
import InfoModal from "./components/InfoModal";
import { useAuthStore } from "./store/authStore";

const App = () => {
  const [activityData, setActivityData] = useState([]);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const { isAuthenticated, user, logout, init, isLoading } = useAuthStore();
  const lastDataRef = useRef("");
  const fetchTimeoutRef = useRef(null);
  const intervalRef = useRef(null);

  // Stable data comparison function
  const compareActivityData = (newData, oldData) => {
    if (newData.length !== oldData.length) return false;
    return newData.every((item, index) => {
      const oldItem = oldData[index];
      return oldItem && 
             item.website === oldItem.website && 
             item.timeSpent === oldItem.timeSpent;
    });
  };

  const fetchUserActivity = useCallback(async (userId) => {
    if (isDataLoading) return; // Prevent concurrent fetches
    
    try {
      setIsDataLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/activity/daily/${userId}`,
        {
          credentials: "include",
          cache: "no-cache",
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const activities = await response.json();
      
      // Sort and stabilize the data
      const sortedData = Array.isArray(activities) 
        ? activities
            .filter(item => item.website && item.timeSpent > 0)
            .sort((a, b) => b.timeSpent - a.timeSpent)
        : [];
      
      // Create a stable data hash to prevent unnecessary updates
      const dataHash = JSON.stringify(sortedData.map(item => `${item.website}:${item.timeSpent}`));
      
      // Only update if data actually changed
      if (dataHash !== lastDataRef.current) {
        lastDataRef.current = dataHash;
        setActivityData(sortedData);
        console.log(`Updated activity data: ${sortedData.length} items`);
      }
    } catch (error) {
      console.error("Error fetching user activity:", error);
      // Don't clear data on error, keep showing last known state
    } finally {
      setIsDataLoading(false);
    }
  }, [isDataLoading]);

  const fetchLocalActivity = useCallback(() => {
    chrome.storage.local.get(["activity"], (result) => {
      if (result.activity) {
        try {
          const localActivity = Array.isArray(result.activity)
            ? result.activity
                .filter(item => item.website && item.timeSpent > 0)
                .sort((a, b) => b.timeSpent - a.timeSpent)
            : [];
          
          const dataHash = JSON.stringify(localActivity.map(item => `${item.website}:${item.timeSpent}`));
          
          if (dataHash !== lastDataRef.current) {
            lastDataRef.current = dataHash;
            setActivityData(localActivity);
            console.log(`Updated local activity data: ${localActivity.length} items`);
          }
        } catch (error) {
          console.error("Error parsing activity data:", error);
          setActivityData([]);
        }
      } else {
        setActivityData([]);
      }
    });
  }, []);

  // Set up data fetching with stable intervals
  useEffect(() => {
    // Clear any existing intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
      fetchTimeoutRef.current = null;
    }

    if (user?.id && isAuthenticated) {
      // Initial fetch with a small delay to prevent rapid calls
      fetchTimeoutRef.current = setTimeout(() => {
        fetchUserActivity(user.id);
      }, 1000);

      // Set up less frequent interval to prevent fluctuations
      intervalRef.current = setInterval(() => {
        fetchUserActivity(user.id);
      }, 60000); // Increased to 60 seconds
    } else if (!isAuthenticated && !isLoading) {
      // Use local storage with less frequent updates
      fetchLocalActivity();
      intervalRef.current = setInterval(fetchLocalActivity, 30000);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
    };
  }, [user?.id, isAuthenticated, isLoading, fetchUserActivity, fetchLocalActivity]);

  // Initialize auth state
  useEffect(() => {
    init();
  }, [init]);

  if (isLoading) {
    return (
      <Box p={4} width="400px" height="600px" color="white" bg="#1A202C">
        <VStack spacing={4} justify="center" height="100%">
          <Text>Loading TimeTracker...</Text>
        </VStack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box p={4} width="400px" height="600px" color="white" bg="#1A202C">
        <VStack spacing={6} align="stretch">
          <VStack spacing={1} align="center" pt={4}>
            <Heading size="lg" color="gray.100">
              TimeTracker
            </Heading>
            <Text fontSize="sm" color="gray.100" textAlign="center">
              Track your online activity, stay mindful of your time.
            </Text>
          </VStack>
          <Divider />
          <Auth />
        </VStack>
      </Box>
    );
  }

  return (
    <Box p={4} width="400px" height="600px" color="white" bg="#1A202C">
      <VStack spacing={4} height="100%">
        <VStack spacing={1} width="100%" align="center">
          <HStack justifyContent="space-between" width="100%" align="center">
            <VStack align="flex-start" spacing={0}>
              <Heading size="md" color="gray.100">
                TimeTracker
              </Heading>
              <Text fontSize="sm" color="gray.100">
                Track your online activity
              </Text>
            </VStack>
            <HStack spacing={2}>
              <Tooltip label="How it works" placement="bottom">
                <IconButton
                  icon={<InfoOutlineIcon />}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => setIsInfoOpen(true)}
                />
              </Tooltip>
              <Button
                size="sm"
                colorScheme="red"
                variant="solid"
                onClick={logout}
              >
                Logout
              </Button>
            </HStack>
          </HStack>
        </VStack>

        <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />

        <Divider />

        <VStack
          spacing={4}
          width="100%"
          flex={1}
          overflow="auto"
          sx={{
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Box
            width="100%"
            overflow="auto"
            flex={1}
            sx={{
              "::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <ChartDisplay data={activityData} />
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
};

export default App;
