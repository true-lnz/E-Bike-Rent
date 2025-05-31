import {
	Box,
	Button,
	Container,
	FileInput,
	Flex,
	Group,
	Image,
	LoadingOverlay,
	Modal,
	NumberInput,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	Title
} from "@mantine/core";
import { useEffect, useState } from "react";
import { BASE_IMAGE_URL } from "../../constants";
import { getAllAccessories } from "../../services/accessoryService";
import type { Accessory } from "../../types/accessory";
import AccessoryCard from "../Accessory/AccessoryCard";

export default function AdminAccessoriesList() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);
  const [newAccessory, setNewAccessory] = useState<Partial<Accessory> | null>(null);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    loadAccessories();
  }, []);

  const loadAccessories = () => {
    setLoading(true);
    getAllAccessories()
      .then(([fetchedAccessories]) => {
        setAccessories(fetchedAccessories);
      })
      .catch((error) => console.error("Ошибка загрузки:", error))
      .finally(() => setLoading(false));
  };

  const handleCardClick = (accessory: Accessory) => {
    setSelectedAccessory(accessory);
    setNewImage(null);
    setEditModalOpened(true);
  };

  const handleAddClick = () => {
    setNewAccessory({
      name: '',
      quantity: 0,
      available_quantity: 0,
      image_url: ''
    });
    setNewImage(null);
    setAddModalOpened(true);
  };

  const handleSave = async () => {
    try {
      if (selectedAccessory) {
        console.log("Обновление аксессуара:", selectedAccessory);
        // await updateAccessory(selectedAccessory);
      }
      setEditModalOpened(false);
      loadAccessories();
    } catch (error) {
      console.error("Ошибка сохранения:", error);
    }
  };

  const handleCreate = async () => {
    if (!newAccessory?.name) return;
    
    try {
      const formData = new FormData();
      formData.append('name', newAccessory.name);
      formData.append('quantity', String(newAccessory.quantity || 0));
      formData.append('available_quantity', String(newAccessory.quantity || 0));
      if (newImage) {
        formData.append('image', newImage);
      }

      // await createAccessory(formData);
      setAddModalOpened(false);
      loadAccessories();
    } catch (error) {
      console.error("Ошибка создания:", error);
    }
  };

  const handleDeleteConfirm = () => {
    setDeleteModalOpened(true);
  };

  const handleDelete = async () => {
    try {
      console.log("Удаление аксессуара:", selectedAccessory?.id);
      // await deleteAccessory(selectedAccessory.id);
      setEditModalOpened(false);
      setDeleteModalOpened(false);
      loadAccessories();
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  };

  if (loading) return <LoadingOverlay visible={true} zIndex={101} />;

  return (
    <Container id="accessories" py="xl" size="lg">
      <Group gap="xl" mb="xl">
        <Title fz={45}>Все аксессуары</Title>
        <Button variant="outline" radius="xl" mt={12} onClick={handleAddClick}>
          Добавить новый аксессуар
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4, xl: 5 }} spacing="sm">
        {accessories.map((accessory) => (
          <div key={accessory.id} onClick={() => handleCardClick(accessory)} style={{ cursor: 'pointer' }}>
            <AccessoryCard accessory={accessory} showQuantity={true} />
          </div>
        ))}
      </SimpleGrid>

      {/* Модальное окно редактирования */}
      <Modal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        title={`Редактирование: ${selectedAccessory?.name || ''}`}
        size="lg"
        radius="xl"
        centered
      >
        {selectedAccessory && (
          <Stack gap="md">
            <Box>
              <Text size="sm" fw={500} mb="xs">Текущее изображение:</Text>
              <Image
                src={newImage ? URL.createObjectURL(newImage) : `${BASE_IMAGE_URL}${selectedAccessory.image_url}`}
                alt={selectedAccessory.name}
                height={160}
                fit="contain"
                style={{ border: '1px solid #dee2e6', borderRadius: 'var(--mantine-radius-lg)' }}
              />
            </Box>

            <TextInput
              label="Название"
              value={selectedAccessory.name}
              radius="md"
              onChange={(e) => setSelectedAccessory({
                ...selectedAccessory,
                name: e.target.value
              })}
            />
            
            <NumberInput
              label="Количество"
              value={selectedAccessory.quantity}
              radius="md"
              onChange={(value) => setSelectedAccessory({
                ...selectedAccessory,
                quantity: Number(value)
              })}
            />

            <FileInput
              label="Новое изображение"
              placeholder="Выберите файл"
              accept="image/*"
              radius="md"
              onChange={setNewImage}
            />

            <Flex justify="space-between" mt="md">
              <Button 
                color="red" 
                variant="outline" 
                onClick={handleDeleteConfirm}
                radius="md"
              >
                Удалить аксессуар
              </Button>
              <Group>
                <Button variant="outline" radius="md" onClick={() => setEditModalOpened(false)}>
                  Отмена
                </Button>
                <Button radius="md" onClick={handleSave}>
                  Сохранить изменения
                </Button>
              </Group>
            </Flex>
          </Stack>
        )}
      </Modal>

      {/* Модальное окно подтверждения удаления */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Подтверждение удаления"
        size="md"
        radius="xl"
        centered
      >
        <Stack>
          <Text>Вы уверены, что хотите удалить "{selectedAccessory?.name}"?</Text>
          <Text size="sm" c="dimmed">Это действие нельзя отменить.</Text>
          
          <Group justify="flex-end" mt="md">
            <Button 
              variant="outline" 
              radius="md" 
              onClick={() => setDeleteModalOpened(false)}
            >
              Отмена
            </Button>
            <Button 
              color="red" 
              radius="md" 
              onClick={handleDelete}
            >
              Удалить
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Модальное окно добавления */}
      <Modal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
        title="Добавление нового аксессуара"
        size="lg"
        radius="xl"
        centered
      >
        <Stack gap="md">
          <TextInput
            radius="md"
            label="Название"
            placeholder="Введите название"
            value={newAccessory?.name || ''}
            onChange={(e) => setNewAccessory({
              ...newAccessory,
              name: e.target.value
            })}
          />
          
          <NumberInput
            label="Количество"
            radius="md"
            value={newAccessory?.quantity || 0}
            onChange={(value) => setNewAccessory({
              ...newAccessory,
              quantity: Number(value),
              available_quantity: Number(value)
            })}
            min={0}
          />

          <FileInput
            label="Изображение"
            radius="md"
            placeholder="Выберите файл"
            accept="image/*"
            onChange={setNewImage}
          />

          {newImage && (
            <Box>
              <Text size="sm" fw={500} mb="xs">Предпросмотр:</Text>
              <Image
                src={URL.createObjectURL(newImage)}
                height={160}
                fit="contain"
                style={{ border: '1px solid #dee2e6', borderRadius: 'var(--mantine-radius-lg)' }}
              />
            </Box>
          )}

          <Group justify="flex-end" mt="md">
            <Button radius="md" variant="outline" onClick={() => setAddModalOpened(false)}>
              Отмена
            </Button>
            <Button radius="md" onClick={handleCreate} disabled={!newAccessory?.name}>
              Создать аксессуар
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}