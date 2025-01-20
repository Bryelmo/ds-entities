import { factories } from '@strapi/strapi'
import { DSEntities } from '../../../src/models/Entities';
import { EntitiesService } from '../../../src/services/Entities';
import { Entity } from '../../../src/models/Strapi';

export default factories.createCoreController(DSEntities.REGION, ({ strapi }) => ({

	async get(ctx) {
		try {
			const regionTypes: Entity[] = await EntitiesService.getEntities(DSEntities.REGION);
			ctx.body = regionTypes;
		} catch (err) {
			ctx.body = err;
		}
	},

	async add(ctx) {
		try {
			const payload = (ctx.request.body).data;
			const regionTypes: Entity = await EntitiesService.createEntity(DSEntities.REGION, payload)
			ctx.body = regionTypes;
		} catch (err) {
			ctx.body = err;
		}
	},

	async edit(ctx) {
		try {
			const payload = (ctx.request.body);
			const regionTypes: Entity = await EntitiesService.updateEntity(DSEntities.REGION, payload)
			ctx.body = regionTypes;
		} catch (err) {
			ctx.body = err;
		}
	},

	async cancel(ctx) {
		try {
			const url: string[] = ctx.request.url.split('/');
			const payload = url[url.length - 1];
			const regionTypes: Entity = await EntitiesService.deleteEntity(DSEntities.REGION, payload)
			ctx.body = regionTypes;
		} catch (err) {
			ctx.body = err;
		}
	},

}));
