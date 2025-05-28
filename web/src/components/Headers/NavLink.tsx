import { Text } from '@mantine/core';
import { useHover } from "@mantine/hooks";
import { Link } from 'react-router-dom';

export function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
	const { hovered, ref } = useHover();
	return (
		<Text
			ref={ref}
			component={Link}
			to={to}
			fw={500}
			style={{
				color: hovered ? 'var(--mantine-color-orange-5)' : 'inherit',
				transition: 'color 0.3s ease'
			}}
		>
			{children}
		</Text>
	);
}