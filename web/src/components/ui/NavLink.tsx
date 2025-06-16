import { Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import { Link, useLocation } from 'react-router-dom';

interface NavLinkProps {
	to: string;
	children: React.ReactNode;
	active?: boolean;
	exact?: boolean;
	onClick?: () => void; // Добавляем обработчик клика
}

export function NavLink({ to, children, active, exact = false, onClick }: NavLinkProps) {
	const { hovered, ref } = useHover();
	const location = useLocation();

	const isActive = active !== undefined
		? active
		: exact
			? location.pathname === to
			: location.pathname.startsWith(to);

	const handleClick = () => {
		if (onClick) {
			onClick();
		}
	};

	return (
		<Text
			ref={ref}
			component={Link}
			to={to}
			p={0}
			fw={500}
			onClick={handleClick} // Добавляем обработчик
			style={{
				color: hovered || isActive ? 'var(--mantine-color-orange-5)' : 'inherit',
				transition: 'color 0.3s ease',
				textDecoration: 'none',
				position: 'relative',
				cursor: 'pointer',
			}}
		>
			{children}
		</Text>
	);
}