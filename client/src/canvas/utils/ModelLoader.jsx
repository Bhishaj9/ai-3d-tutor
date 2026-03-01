import { useGLTF } from '@react-three/drei';

/**
 * Custom hook for loading Draco-compressed .glb models.
 * Uses useGLTF hook with a CDN standard Draco decoder path.
 *
 * @param {string} url - URL to the .glb model
 */
export function useDracoGLTF(url) {
  // If the url doesn't already have -draco, and ends with .glb, we can swap it
  const dracoUrl = url.replace('.glb', '-draco.glb');

  // Configure the useGLTF hook to use Draco decoding from the Google CDN
  return useGLTF(dracoUrl, 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
}

// Helper to preload
export function preloadDraco(url) {
  const dracoUrl = url.replace('.glb', '-draco.glb');
  useGLTF.preload(dracoUrl, 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/');
}
