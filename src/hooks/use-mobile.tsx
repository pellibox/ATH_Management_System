
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(window.innerWidth < MOBILE_BREAKPOINT)

  React.useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check on mount and window resize
    window.addEventListener("resize", checkIfMobile)
    checkIfMobile()
    
    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return isMobile
}

// Add an alias for backward compatibility
export const useMobile = useIsMobile;
