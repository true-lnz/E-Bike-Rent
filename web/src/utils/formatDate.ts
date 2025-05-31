export const formatBirthday = (dateString?: string | null): string => {
  if (!dateString) return 'Не указана';
  
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};