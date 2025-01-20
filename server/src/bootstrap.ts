import type { Core } from '@strapi/strapi';
import { DSEComponentTypes, DSEntities, DSEntityTypes } from '../../src/models/Entities';
import { EntitiesService } from '../../src/services/Entities';
import { EntityTypeService } from '../../src/services/EntityType';
import { ComponentsService } from '../../src/services/Component';
import { RegionService } from '../../src/services/Region';
import { PermissionsService } from '../../src/services/Permissions';
import { TypeEntity } from '../../src/models/Type';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  	
	// bootstrap phase
	EntityTypeService.init(strapi);
	RegionService.init(strapi);
	strapi.log.info('Init default entities');

	ComponentsService.initComponentViewConfiguration(DSEComponentTypes.VIEW);
	ComponentsService.initComponentViewConfiguration(DSEComponentTypes.REFERENCES);
	ComponentsService.initComponentViewConfiguration(DSEComponentTypes.SECTIONS);
	strapi.log.info('Installing components view configurations');

	EntitiesService.initEntityViewConfiguration(DSEntityTypes.BLOCK);
	EntitiesService.initEntityViewConfiguration(DSEntityTypes.VIEW);
	EntitiesService.initEntityViewConfiguration(DSEntityTypes.NODE);
	strapi.log.info('Installing entity view configurations');

	// I init api permissions
	PermissionsService.init(strapi);
	strapi.log.info('Setting up permissions');
	// I update permissions for Node types
	const filters = { filters: { Reference: { $eq: DSEntityTypes.NODE } } };
	const typeEntities: TypeEntity[] = await EntitiesService.getEntities(DSEntities.TYPE, filters);
	PermissionsService.registerEntityPermissions(strapi, typeEntities);
	strapi.log.info('Setting default api permissions');

};

export default bootstrap;
