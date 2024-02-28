import React, { createContext, useContext } from 'react';
import { useJupyterKernelManager } from 'src/utils/kernel/managerHook';

// Create a context
const KernelManagerContext = createContext();

// Context provider component
export const KernelManagerProvider = ({ children }) => {
  const kernelManagerHook = useJupyterKernelManager();
  return (
    <KernelManagerContext.Provider value={kernelManagerHook}>
      {children}
    </KernelManagerContext.Provider>
  );
};

// Custom hook to use the context
export const useSharedJupyterKernelManager = () => {
  return useContext(KernelManagerContext);
};
