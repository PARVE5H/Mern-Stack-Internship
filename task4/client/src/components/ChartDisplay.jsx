import React, { useMemo, memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Box,
  Text,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

const generateColorFromDomain = (domain) => {
  // Simple hash function to generate consistent colors for each domain
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert to HSL (using hue rotation)
  // Using 50% saturation and 60% lightness for good visibility
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 50%, 60%)`;
};

const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const ChartDisplay = ({ data }) => {
  // Ensure data is valid
  const validData = Array.isArray(data) ? data : [];

  if (!validData.length) {
    return (
      <Text color="gray.400" mt={4} textAlign="center">
        No activity recorded yet. Start browsing to track your time!
      </Text>
    );
  }

  // Sort data by time spent (descending)
  const sortedData = [...validData].sort((a, b) => b.timeSpent - a.timeSpent);

  return (
    <VStack spacing={4} width="100%" align="stretch">
      <Tabs variant="soft-rounded" colorScheme="gray" size="sm">
        <TabList>
          <Tab>Bar Chart</Tab>
          <Tab>Pie Chart</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box
              height="400px"
              width="100%"
              sx={{
                "::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis type="number" tickFormatter={formatTime} />
                  <YAxis
                    type="category"
                    dataKey="website"
                    width={100}
                    tick={{ fill: "#A0AEC0", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2D3748",
                      border: "none",
                      borderRadius: "4px",
                      color: "#A0AEC0",
                    }}
                    formatter={(value) => [formatTime(value), "Time Spent"]}
                  />
                  <Bar
                    dataKey="timeSpent"
                    fill={generateColorFromDomain(
                      sortedData[0]?.website || "default"
                    )}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4}>
              <Box
                height="250px"
                width="100%"
                sx={{
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sortedData}
                      dataKey="timeSpent"
                      nameKey="website"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill={generateColorFromDomain("default")}
                    >
                      {sortedData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={generateColorFromDomain(entry.website)}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => formatTime(value)}
                      contentStyle={{
                        backgroundColor: "#2D3748",
                        border: "none",
                        borderRadius: "4px",
                        color: "#A0AEC0",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>

              <Box
                width="100%"
                overflowX="auto"
                sx={{
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <Table size="sm" variant="simple">
                  <Thead>
                    <Tr>
                      <Th color="gray.400">Website</Th>
                      <Th color="gray.400">Time Spent</Th>
                      <Th color="gray.400">Color</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedData.map((item, index) => (
                      <Tr key={item.website}>
                        <Td color="gray.300">{item.website}</Td>
                        <Td color="gray.300">{formatTime(item.timeSpent)}</Td>
                        <Td>
                          <Box
                            width="20px"
                            height="20px"
                            borderRadius="4px"
                            backgroundColor={generateColorFromDomain(
                              item.website
                            )}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};

export default ChartDisplay;
