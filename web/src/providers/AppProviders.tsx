// src/providers/AppProviders.tsx
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { AuthProvider } from './AuthProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
	return (
		<MantineProvider withGlobalClasses withCssVariables>
			<DatesProvider settings={{ locale: 'ru' }}>
				<Notifications position="top-right" />
				<AuthProvider>
					<ModalsProvider>
						{children}
					</ModalsProvider>
				</AuthProvider>
			</DatesProvider>
		</MantineProvider>
	);
}
