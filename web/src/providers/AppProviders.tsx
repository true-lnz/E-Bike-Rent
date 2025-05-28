// src/providers/AppProviders.tsx
import { MantineProvider } from '@mantine/core';
// import { Notifications } from '@mantine/notifications';
// import { AuthProvider } from '../contexts/AuthContext';
import { ModalProvider } from '../contexts/ModalContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider withGlobalClasses withCssVariables>
      {/* <Notifications position="top-right" /> */}
        {/* <AuthProvider> */}
          <ModalProvider>
            {children}
          </ModalProvider>
        {/* </AuthProvider> */}
    </MantineProvider>
  );
}
