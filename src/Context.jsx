import { createContext, useState } from "react";

// Create a new context for music-related data
export const MusicContext = createContext();

// Define a context provider component
export const ContextProvider = ({ children }) => {
  // State to track loading status
  const [isLoading, setIsLoading] = useState(false);

  // State to manage liked music
  const [likedMusic, setLikedMusic] = useState([]);

  // State to manage pinned music
  const [pinnedMusic, setPinnedMusic] = useState([]);

  // State to manage the offset for search results (useful for pagination)
  const [resultOffset, setResultOffset] = useState(0);

  return (
    // Provide the state values and setters to the context
    <MusicContext.Provider
      value={{
        isLoading,
        setIsLoading,
        likedMusic,
        setLikedMusic,
        resultOffset,
        setResultOffset,
        pinnedMusic,
        setPinnedMusic,
      }}
    >
      {/* Render the child components that consume this context */}
      {children}
    </MusicContext.Provider>
  );
};
