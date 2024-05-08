export const objectResponse = (status: number, message: string, object = {}) => {
  return {
    status,
    message,
    ...object,
  }
}


export const setResponse = (status: number, message: string, affectedOrInsertedRows: number | undefined) => {
  return affectedOrInsertedRows ?
    objectResponse(status, message) :
    objectResponse(400, 'Não foi possível processar sua solicitação.')
};