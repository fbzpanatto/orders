export const objectResponse = (status: number, message: string, object = {}) => {
  return {
    status,
    message,
    ...object,
  }
}


export const setResponse = (status: number, message: string, affecteOrInsertedRows: number | undefined) => {
  return affecteOrInsertedRows ?
    objectResponse(status, message) :
    objectResponse(400, 'Não foi possível processar sua solicitação.')
};