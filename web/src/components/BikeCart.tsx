import { Button, Card, Text } from '@mantine/core'

interface Bike {
  id: string
  model: string
  price: number
}

export function BikeCard({ bike }: { bike: Bike }) {
  return (
    <Card shadow="sm" padding="lg">
      <Text fw={500}>{bike.model}</Text>
      <Text>Цена: {bike.price}₽/час</Text>
      <Button variant="light" fullWidth mt="md">
        Арендовать
      </Button>
    </Card>
  )
}