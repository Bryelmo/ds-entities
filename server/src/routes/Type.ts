import { factories } from "@strapi/strapi";
import { DSEntities } from "../../../src/models/Entities";

export const customEntityTypeRoutes = {
	type: 'admin',
	routes: [
		{
			method: 'GET',
			path: '/entitytypes',
			handler: 'entitytype.get',
			config: {
				auth: false
			},
		},
		{
			method: 'POST',
			path: '/entitytypes',
			handler: 'entitytype.add',
			config: {
				auth: false
			},
		},
		{
			method: 'PUT',
			path: '/entitytypes/:id',
			handler: 'entitytype.edit',
			config: {
				auth: false
			},
		},
		{
			method: 'DELETE',
			path: '/entitytypes/:id',
			handler: 'entitytype.cancel',
			config: {
				auth: false
			},
		},
	],
};

export const typeentity = factories.createCoreRouter(DSEntities.TYPE);

export default { typeentity, customEntityTypeRoutes }