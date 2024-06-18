import { objectResponse } from '../utils/response';
import { CONFIGURABLE_RESOURCES_AND_FIELDS } from '../enums/resources';

export const getResources = async () => {
  try { return objectResponse(200, 'Consulta realizada com sucesso.', { data: CONFIGURABLE_RESOURCES_AND_FIELDS, meta: 1 }) }
  catch (error) { return objectResponse(400, 'Não foi possível processar sua solicitação.', {}) }
}