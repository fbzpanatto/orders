export const person = {
  'person.observation': {
    optional: true,
    isLength: { options: { min: 3, max: 45 } },
    escape: true
  },
  'person.first_field': {
    optional: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  'person.second_field': {
    optional: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  'person.third_field': {
    optional: true,
    isLength: { options: { min: 3, max: 100 } },
    escape: true
  },
  'person.company_id': {
    optional: true,
    escape: true,
    isInt: true,
    toInt: true
  },
}