export default {
	
	find: async (ctx, next) => {

		const layoutService = strapi.plugin('ds-entities').service('layout');
		try {
			const layout = await layoutService.getLayout(ctx.query);
			ctx.body = layout;
		} catch (err) {
			ctx.body = err;
		}
	}
};
