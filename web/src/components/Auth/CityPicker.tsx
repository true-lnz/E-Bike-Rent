import { Autocomplete, Loader, rem, type ComboboxItem, type OptionsFilter } from '@mantine/core';
import { IconMapPin } from '@tabler/icons-react';
import { useState } from 'react';

interface CityPickerProps {
	value: string;
	onChange: (value: string) => void;
}

export function CityPicker({ value, onChange }: CityPickerProps) {
	const [loading, setLoading] = useState(false);
	const [cities, setCities] = useState<string[]>([]);

	// Функция для рекурсивного парсинга городов из структуры hh.ru
	const parseCities = (areas: any[]): string[] => {
		let result: string[] = [];

		areas.forEach(area => {
			if (area.areas.length === 0 || (area.parent_id && area.parent_id !== "113")) {
				const cityName = area.name.replace(/\([^)]*\)/g, '').trim();
				result.push(cityName);
			} else {
				result = [...result, ...parseCities(area.areas)];
			}
		});

		return [...new Set(result)];
	};

	const fetchCities = async (query: string) => {
		try {
			setLoading(true);

			const response = await fetch('https://api.hh.ru/areas');
			const data = await response.json();

			// Парсим все города из полученных данных
			const allCities = parseCities(data[0].areas);

			// Фильтруем по запросу
			const filtered = allCities.filter(city =>
				city.toLowerCase().includes(query.toLowerCase())
			);

			setCities(filtered);
		} catch (e) {
			console.error('Ошибка загрузки городов:', e);
			setCities([
				'Москва', 'Санкт-Петербург', 'Новосибирск',
				'Екатеринбург', 'Казань', 'Нижний Новгород', 'Уфа'
			]);
		} finally {
			setLoading(false);
		}
	};

	const optionsFilter: OptionsFilter = ({ options, search }) => {
		const splittedSearch = search.toLowerCase().trim().split(' ');
		return (options as ComboboxItem[]).filter((option) => {
			const words = option.label.toLowerCase().trim().split(' ');
			return splittedSearch.every((searchWord) =>
				words.some((word) => word.includes(searchWord))
			);
		});
	};

	const handleChange = (val: string) => {
		onChange(val);
		if (val.trim().length >= 2) {
			fetchCities(val);
		} else {
			setCities([]);
		}
	};

	return (
		<Autocomplete
			value={value}
			onChange={handleChange}
			placeholder="Например, Уфа"
			label="Населенный пункт"
			required
			leftSection={<IconMapPin style={{ width: rem(18), height: rem(18) }} />}
			rightSection={loading ? <Loader size="1rem" /> : null}
			data={cities}
			limit={5}
			comboboxProps={{
				transitionProps: { transition: 'pop', duration: 200 },
			}}
			styles={{
				dropdown: {
					borderRadius: 'var(--mantine-radius-md)',
					boxShadow: 'var(--mantine-shadow-md)',
				},
				option: {
					borderRadius: 'var(--mantine-radius-sm)',
					'&[data-combobox-active]': {
						backgroundColor: 'var(--mantine-color-green-light)',
					},
				},
			}}
			filter={optionsFilter}
			clearable
			aria-label="Выбор города"
		/>
	);
}