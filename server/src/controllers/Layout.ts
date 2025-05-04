export default {
	
	find: async (ctx, next) => {

		const service = strapi.plugin('ds-entities').service('layout');
		try {
			const response = await service.getLayout(ctx.query);
			ctx.body = response;
		} catch (err) {
			ctx.status = 500;
			ctx.body = {
				error: 'Internal server error',
				message: err.message,
			};
		}
	}
};
