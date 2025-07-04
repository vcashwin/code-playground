import * as React from "react";

export function useMediaQuery(query: string) {
  const getMatches = (q: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== "undefined") {
      return window.matchMedia(q).matches;
    }
    return false;
  };

  const [matches, setMatches] = React.useState<boolean>(getMatches(query));

  function handleChange() {
    setMatches(getMatches(query));
  }

  React.useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    handleChange();

    // Listen matchMedia
    if (matchMedia.addEventListener) {
      matchMedia.addEventListener("change", handleChange);
    } else if (matchMedia.addListener) {
      // Safari <14
      // @ts-ignore – deprecated but still needed for older browsers
      matchMedia.addListener(handleChange);
    }

    return () => {
      if (matchMedia.removeEventListener) {
        matchMedia.removeEventListener("change", handleChange);
      } else if (matchMedia.removeListener) {
        // Safari <14
        // @ts-ignore – deprecated but still needed for older browsers
        matchMedia.removeListener(handleChange);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return matches;
}