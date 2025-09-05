import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function usePageViews() {
  const location = useLocation();
  
  useEffect(() => {
    // Use gtag (from the HTML script) instead of ReactGA
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-ZLHQETQ8H4', {
        page_path: location.pathname + location.search
      });
    }
  }, [location]);
}

export default usePageViews;
