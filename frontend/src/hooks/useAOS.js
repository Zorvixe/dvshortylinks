import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function useAOS() {
  useEffect(() => {
    // Delay AOS init slightly to let layout stabilize
    const timeout = setTimeout(() => {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
      });
      AOS.refresh();
    }, 300); // You can adjust this timing based on your actual load

    return () => clearTimeout(timeout);
  }, []);
}
