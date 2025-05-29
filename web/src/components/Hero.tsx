'use client';

import {
	Box,
	Button,
	Container,
	Group,
	rem,
	Stack,
	Title
} from '@mantine/core';
import RentStats from './RentStats';

export default function HeroWithStats() {
	return (
		<>
			{/* HERO СЕКЦИЯ */}
			<Box pos="relative" bg="white" pt="xl" >
				{/* Фоновая геометрия — наклонный прямоугольник с закруглением */}
				        <Box
          pos="absolute"
          top={0}
          right={0}
          w="650"
          h="650"
          style={{
            backgroundColor: '#1976d2',
            borderRadius: rem(80),
            transform: 'rotate(-10deg)',
            transformOrigin: 'top right',
            zIndex: 0,
          }}
        />

				<Container size="lg" pos="relative" py="xl">
					<Stack gap="0" maw={500}>
						<Title order={1} lh="1" size={90} fw={800}>
							Аренда велосипедов
						</Title>
						<Title order={1} size={70} lh="1" fw={800} c="orange">
							для курьеров в Уфе
						</Title>

						<Group mt={45} gap="xl">
							<Button color="orange" size="xl" radius="xl" w={250}>
								Оставить заявку
							</Button>

							<Group gap="md">
								<Box
									w="60"
									h="60"
									bg="orange"
									style={{ borderRadius: '50%' }}
								/>
								<Box
									w="60"
									h="60"
									bg="orange"
									style={{ borderRadius: '50%' }}
								/>
							</Group>

						</Group>
					</Stack>
				</Container>
			</Box>

			<RentStats />
		</>
	);
}
