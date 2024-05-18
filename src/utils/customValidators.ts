export const validateCustomFieldDate = (value: string) => {

  if (!value || !value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
    throw new Error('Invalid custom field value. Must be alphanumeric and contain underscores.');
  }

  return true
};