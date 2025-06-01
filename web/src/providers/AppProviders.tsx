// src/providers/AppProviders.tsx
import { MantineProvider } from '@mantine/core';
// import { Notifications } from '@mantine/notifications';
// import { AuthProvider } from '../contexts/AuthContext';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { ModalProvider } from '../contexts/ModalContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<MantineProvider withGlobalClasses withCssVariables>
			<Notifications
				position="top-right"
				zIndex={9999}
			/>
			{/* <AuthProvider> */}
			<ModalsProvider>
				<ModalProvider>
					{children}
				</ModalProvider>
			</ModalsProvider>
			{/* </AuthProvider> */}
		</MantineProvider>
	);
}
