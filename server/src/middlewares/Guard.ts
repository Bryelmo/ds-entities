import { DSEntities } from "../../../src/models/Entities";
import { StrapiFilterTypes } from "../../../src/models/Strapi";
import { DSEntityReferenceTypes } from "../../../src/models/Type";
import { EntitiesService } from "../../../src/services/Entities";
import { EntityTypeService } from "../../../src/services/EntityType";
import { PermissionsService } from "../../../src/services/Permissions";

/**
 *  @description A Global middleware guard for block and filter DSEntities permission entities.
 */
export default (config, { strapi }) => {

	return async (ctx, next) => {
	
		const { request, query } = ctx;
		const { url, method } = request;
		const isAuthenticated = PermissionsService.existJwt(request);
		const isGetRequest: boolean = method === 'GET';
		const isAction: boolean = isGetRequest && url.includes('/actions/');
		const isHomePageEndpoint: boolean = isGetRequest && url.includes('/admin/homepage/');
		const isPermissionEndpoint: boolean = isGetRequest && url.includes('/users/me/permissions');
		const isContentTypeEndpoint: boolean = isGetRequest && url.includes('/content-type-builder/content-types');

		const isRegionEntityEndpoint: boolean = isGetRequest && url.includes(`/content-manager/collection-types/${DSEntities.REGION}`);
		const isTypeEntityEndpoint: boolean = isGetRequest && url.includes(`/content-manager/collection-types/${DSEntities.TYPE}`);
		const isNodeTypesRequest: boolean = isGetRequest && request.url.includes(`/content-manager/collection-types/${DSEntities.NODE}?page`);
		const isNodeTypeRequest: boolean = isGetRequest && request.url.includes(`/content-manager/collection-types/${DSEntities.NODE}/`);
		
		const isTypeEntityRelationEndpoint: boolean = isGetRequest && url.includes(`/content-manager/relations/`);
		const isTypeEntityRelation: boolean = isTypeEntityRelationEndpoint && url.includes('/Type');
		const isNodeTypeEntityRelation: boolean = (isTypeEntityRelationEndpoint && url.includes(`/dsentities.view/NodeTypes`)) ||
											  (isTypeEntityRelationEndpoint && url.includes(`/dsentities.references/NodeTypes`));

		// I return the type entities list filtered by their reference with other entities (node, block, view);
		if (isTypeEntityRelation || isNodeTypeEntityRelation) {
			const isSuperAdmin: boolean = await PermissionsService.isSuperAdmin(request);
			const reference:DSEntities = EntityTypeService.getEntityFromRequestUrl(url); 
			const names = await PermissionsService.getTypeNamePerAdminRole(strapi, ctx);
			const filterEntity = `&filters[Reference][$eq]=${DSEntityReferenceTypes[reference]}`;
			const filterNames = names.map(name => `&filters[Name][$eq]=${name}`).join('');
			request.url += isSuperAdmin ? filterEntity : filterNames;
		}

		// I filter node entities for each admin roles permissions
		if (isNodeTypesRequest && isAuthenticated) {
			const isSuperAdmin: boolean = await PermissionsService.isSuperAdmin(request);
			const names = await PermissionsService.getTypeNamePerAdminRole(strapi, ctx);
			const filter = names.map(name => `&filters[Type][Name][$eq]=${name}`).join('');
			if (names && !isSuperAdmin) { request.url += filter; }
		}

		// I consent node entity data for each admin roles permissions
		if (isNodeTypeRequest && isAuthenticated && !isAction) {
			const isSuperAdmin: boolean = await PermissionsService.isSuperAdmin(request);
			const names = await PermissionsService.getTypeNamePerAdminRole(strapi, ctx);
			if (names && !isSuperAdmin) {
				const documentId: string = EntitiesService.getSubstringInString(request.url, `${DSEntities.NODE}/`, `?`);
				const filter = { documentId: documentId, populate: "*", locale: query.locale };
				const node = await EntitiesService.getEntity(DSEntities.NODE, filter);
				if (!names.includes(node?.Type.Name)) {
					return ctx.badRequest(null, [{ messages: [{ id: 'Unauthorized' }] }])
				}
			}
		}
	
		await next();
	
		// I remove the Region and Type menu items from Content builder side menu
		if (isPermissionEndpoint || isContentTypeEndpoint) {
			if (ctx.body.data) {
				const key = isPermissionEndpoint ? 'subject' : 'uid';
				const results = ctx.body?.data?.filter(
								data => data[key] !== DSEntities.REGION
								&& data[key] !== DSEntities.TYPE) || ctx.body;
				ctx.body = { data: results };
				return ctx;
			}
		}

		// I filter node entities for each admin roles permissions
		if (isHomePageEndpoint && isAuthenticated) {
			if (ctx.body.data?.length > 0) {
				const isSuperAdmin: boolean = await PermissionsService.isSuperAdmin(request);
				const names = await PermissionsService.getTypeNamePerAdminRole(strapi, ctx);
				if (names && !isSuperAdmin) {
					const filters = { [StrapiFilterTypes.OR]: [ ...names.map(name => ({ Type: { Name: { $eq: name } } }))]};
					const filter = { filters: filters,  populate: "*" };
					const nodes = await EntitiesService.getEntities(DSEntities.NODE, filter);
					const nodesIds: string[] = nodes.map(node => node.documentId);
					ctx.body.data = [...ctx.body.data].filter(document => nodesIds.includes(document.documentId));
					return ctx;
				}
			}
		}
	}
};