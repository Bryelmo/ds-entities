import { factories } from '@strapi/strapi';
import { DSEntities } from "../../../src/models/Entities";

export const region = factories.createCoreRouter(DSEntities.REGION);

export const customRegionRoutes = {
	type: 'admin',
	routes: [
		{
			method: 'GET',
			path: '/regions',
			handler: 'region.get',
			config: {
				auth: false
			},
		},
		{
			method: 'POST',
			path: '/regions',
			handler: 'region.add',
			config: {
				auth: false
			},
		},
		{
			method: 'PUT',
			path: '/regions/:id',
			handler: 'region.edit',
			config: {
				auth: false
			},
		},
		{
			method: 'DELETE',
			path: '/regions/:id',
			handler: 'region.cancel',
			config: {
				auth: false
			},
		},
	],
};