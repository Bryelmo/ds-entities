import type { Core } from '@strapi/strapi';
import { DSEntities } from '../../src/models/Entities';
import middlewares from './middlewares'
import { ComponentsService } from '../../src/services/Component';
import { EntitiesService } from '../../src/services/Entities';

const register = async ({ strapi }: { strapi: Core.Strapi }) => {
  	
	// register phase
	ComponentsService.register(strapi);
	strapi.log.info('Init DS-Entities components');

	EntitiesService.registerFilledField(DSEntities.NODE);
	EntitiesService.registerFilledField(DSEntities.BLOCK);
	EntitiesService.registerFilledField(DSEntities.VIEW);
	EntitiesService.registerFilledField(DSEntities.TYPE);
	EntitiesService.registerFilledField(DSEntities.REGION);
	EntitiesService.registerFilledField(DSEntities.TAG);
	strapi.log.info('Registering DS-Entities Data field');
	
	strapi.server.use(middlewares.guard(null, { strapi }));
};

export default register;
