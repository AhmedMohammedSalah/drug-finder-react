import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

const PortalModal = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(children, document.getElementById('portal-root'));
};

export default PortalModal;
