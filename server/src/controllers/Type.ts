import { factories } from '@strapi/strapi';
import { DSEntities } from '../../../src/models/Entities';
import { TypeEntity } from '../../../src/models/Type';
import { EntitiesService } from '../../../src/services/Entities';
import { Entity } from '../../../src/models/Strapi';

export default factories.createCoreController(DSEntities.TYPE, ({ strapi }) => ({

	async get(ctx) {
		try {
			const nodeTypes: Entity[] = await EntitiesService.getEntities(DSEntities.TYPE);
			ctx.body = nodeTypes;
		} catch (err) {
			ctx.body = err;
		}
	},

	async add(ctx) {
		try {
			const payload = (ctx.request.body).data;
			const nodeTypes: Entity = await EntitiesService.createEntity(DSEntities.TYPE, payload)
			ctx.body = nodeTypes;
		} catch (err) {
			ctx.body = err;
		}
	},
	
	async edit(ctx) {
		try {
			const payload = (ctx.request.body);
			const nodeTypes: Entity = await EntitiesService.updateEntity(DSEntities.TYPE, payload)
			ctx.body = nodeTypes;
		} catch (err) {
			ctx.body = err;
		}
	},
	
	async cancel(ctx) {
		try {
			const url: string[] = ctx.request.url.split('/');
			const payload = url[url.length - 1];
			const nodeTypes: TypeEntity = await EntitiesService.deleteEntity(DSEntities.TYPE, payload)
			ctx.body = nodeTypes;
		} catch (err) {
			ctx.body = err;
		}
	},

}));