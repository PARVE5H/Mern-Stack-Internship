let activeTab = null;
let startTime = null;
let isTracking = false;
let windowFocused = true;
let syncQueue = [];
let isSyncing = false;

// Initialize when extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("TimeTracker extension installed/updated");
  chrome.storage.local.get(["activity"], (result) => {
    if (!result.activity) {
      chrome.storage.local.set({ activity: [] });
    }
  });

  // Start initial tracking
  setTimeout(initializeTracking, 1000);
});

// Initialize tracking on startup
async function initializeTracking() {
  try {
    const tab = await getCurrentTab();
    if (tab?.url && tab.active) {
      startTracking(tab.url);
    }
  } catch (error) {
    console.error("Error initializing tracking:", error);
  }
}

// Function to get the current active tab
async function getCurrentTab() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  } catch (error) {
    console.error("Error getting current tab:", error);
    return null;
  }
}

// Start tracking for a tab
function startTracking(url) {
  if (!url || url === "about:blank" || !windowFocused) return;

  try {
    const urlObj = new URL(url);
    // Skip chrome extensions, local files, and data URLs
    if (
      urlObj.protocol === "chrome-extension:" ||
      urlObj.protocol === "chrome:" ||
      urlObj.protocol === "file:" ||
      urlObj.protocol === "data:"
    )
      return;

    const domain = urlObj.hostname;
    if (!domain) return;

    // Stop previous tracking if any
    if (isTracking && activeTab && activeTab.domain !== domain) {
      stopTrackingSync();
    }

    activeTab = { url, domain };
    startTime = Date.now();
    isTracking = true;
    console.log(`Started tracking: ${domain}`);
  } catch (error) {
    console.error("Invalid URL:", url, error);
  }
}

// Synchronous version for immediate cleanup
function stopTrackingSync() {
  if (!isTracking || !activeTab || !activeTab.domain || !startTime) return;

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  if (elapsed < 1) {
    resetTracking();
    return;
  }

  console.log(`Stopped tracking: ${activeTab.domain}, elapsed: ${elapsed}s`);

  // Update local storage synchronously
  chrome.storage.local.get(["auth", "activity"], (result) => {
    const activity = result.activity || [];
    const index = activity.findIndex(
      (item) => item && item.website === activeTab.domain
    );

    if (index > -1) {
      activity[index].timeSpent += elapsed;
      activity[index].lastVisited = new Date().toISOString();
    } else {
      activity.push({
        website: activeTab.domain,
        timeSpent: elapsed,
        lastVisited: new Date().toISOString(),
      });
    }

    chrome.storage.local.set({ activity });

    // Try to update server asynchronously if user is logged in
    if (result.auth?.user?.id) {
      updateServerActivity(result.auth.user.id, activeTab.domain, elapsed);
    }
  });

  resetTracking();
}

// Async server update function
async function updateServerActivity(userId, website, timeSpent) {
  try {
    const response = await fetch("http://localhost:5000/api/activity/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
      credentials: "include",
      body: JSON.stringify({
        userId,
        website,
        timeSpent,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error:", response.status, errorText);
      if (response.status === 401) {
        chrome.storage.local.remove(["auth"]);
      }
    }
  } catch (error) {
    console.error("Failed to update server:", error);
  }
}

// Reset tracking variables
function resetTracking() {
  isTracking = false;
  activeTab = null;
  startTime = null;
}

// Stop tracking and update time (async version for cleanup)
async function stopTracking() {
  return new Promise((resolve) => {
    stopTrackingSync();
    resolve();
  });
}

// Track when switching tabs
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    await stopTracking();
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab?.url && tab.active) {
      startTracking(tab.url);
    }
  } catch (error) {
    console.error("Error in onActivated listener:", error);
  }
});

// Track when URL changes in the same tab
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    if (changeInfo.url && tab.active) {
      await stopTracking();
      startTracking(changeInfo.url);
    }
  } catch (error) {
    console.error("Error in onUpdated listener:", error);
  }
});

// Track when window focus changes
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  try {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
      windowFocused = false;
      await stopTracking();
    } else {
      windowFocused = true;
      const tab = await getCurrentTab();
      if (tab?.url) {
        startTracking(tab.url);
      }
    }
  } catch (error) {
    console.error("Error in onFocusChanged listener:", error);
  }
});

// Clean up when browser is closing
chrome.runtime.onSuspend.addListener(async () => {
  console.log("Extension suspending, cleaning up...");
  await stopTracking();
});

// Initialize tracking when extension starts
chrome.runtime.onStartup.addListener(async () => {
  try {
    console.log("Extension starting up...");
    const tab = await getCurrentTab();
    if (tab?.url) {
      startTracking(tab.url);
    }
  } catch (error) {
    console.error("Error in onStartup listener:", error);
  }
});

// Handle messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getTrackingStatus") {
    sendResponse({
      isTracking,
      activeTab: activeTab && activeTab.domain ? activeTab.domain : null,
      timeElapsed: startTime ? Math.floor((Date.now() - startTime) / 1000) : 0,
    });
  }
  return true;
});
