import { factories } from '@strapi/strapi';
import { DSEntities } from '../../../src/models/Entities';

export default factories.createCoreService(DSEntities.TYPE);
