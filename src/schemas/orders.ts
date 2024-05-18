import { Schema } from 'express-validator'

export const ordersPOST = {
  person_id: {
    exists: true,
    isNumeric: true,
    escape: true
  },
  started_at: {
    exists: true,
    escape: true
  },
  ended_at: {
    optional: true,
    escape: true
  }
}

const validateCustomField = (value: string, { req }: any) => {
  // Perform custom validation logic here, accessing request data if needed
  // For example, check if the value exists in a database or matches a specific pattern

  if (!value || !value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
    throw new Error('Invalid custom field value. Must be alphanumeric and contain underscores.');
  }

  return true; // Return true if validation passes, false otherwise
};

export const ordersPATCH: Schema = {
  person_id: {
    optional: true,
    isNumeric: true,
    escape: true
  },
  started_at: {
    optional: true,
    escape: true
  },
  ended_at: {
    exists: true,
    escape: true,
    custom: {
      options: validateCustomField
    }
  }
}