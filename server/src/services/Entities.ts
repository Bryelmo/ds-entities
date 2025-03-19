import { BlockEntity } from "../../../src/models/Block";
import { DSEntities } from "../../../src/models/Entities";
import { NodeEntity } from "../../../src/models/Node";
import { EntityProperties } from "../../../src/models/Entities";
import { BlockService } from "../../../src/services/Block";
import { NodeService } from "../../../src/services/Node";
import { TagService } from "../../../src/services/Tag";
import { EntityTypeService } from "../../../src/services/EntityType";
import { LocaleService } from "../../../src/services/Locale";
import { EntitiesService } from "../../../src/services/Entities";
import { RegionService } from "../../../src/services/Region";
import { ViewService } from "../../../src/services/View";
import { ViewEntity } from "../../../src/models/View";

const node_options = {
	status: 'published',
	fields: '*',
	populate: {
		Type: { fields: EntityTypeService.fields },
		Image: { fields: '*' },
		Tags: { fields: TagService.fields },
		localizations: { fields: '*' },
	}
}

const block_options = {
	status: 'published',
	fields: '*',
	populate: {
		Type: { fields: EntityTypeService.fields },
		Region: { fields: RegionService.fields },
		Context: {
			populate: {
				Nodes: { fields: [EntityProperties.UID] },
				NodeTypes: { fields: EntityTypeService.fields }
			}
		},
		Views: { fields: [ EntityProperties.UID ] },
		localizations: { fields: '*' },
	}
}

const view_options = {
	status: 'published',
	fields: '*',
	populate: {
		Type: { fields: EntityTypeService.fields },
		Header: { populate: { Blocks: { fields: [EntityProperties.UID] } } },
		Body: {
			populate: {
				Nodes: { fields: [EntityProperties.UID] },
				NodeTypes: { fields: EntityTypeService.fields }
			}
		},
		Footer: { populate: { Blocks: { fields: [EntityProperties.UID] } } },
		localizations: { fields: '*' }
	}
}

export default ({ strapi }) => {
	
	const getMap = async (query) => {
		const defaultLocale = await LocaleService.getDefaultLocale();
		let response = undefined;

		const filter = { 
			nodes: { ...node_options, locale: query?.locale || defaultLocale },
			blocks: { ...block_options, locale: query?.locale || defaultLocale },
			views: { ...view_options, locale: query?.locale || defaultLocale },
		};

		const nodes = strapi.documents(DSEntities.NODE).findMany(filter.nodes)
			.then((nodes: NodeEntity[]) => Promise.all([...nodes]?.map(async (node) => await NodeService.removeUselessData(node))))
			.then((nodes: NodeEntity[]) => EntitiesService.mapEntities(nodes));
		
		const blocks = strapi.documents(DSEntities.BLOCK).findMany(filter.blocks)
			.then((blocks: BlockEntity[]) => Promise.all([...blocks]?.map(async (block) => {
				let _block = await BlockService.removeUselessData(block);
				return { ..._block, Views: await EntitiesService.cleanNullData(block.Views) }
			})))
			.then((blocks: BlockEntity[]) => EntitiesService.mapEntities(blocks));
		
		const views = strapi.documents(DSEntities.VIEW).findMany(filter.views)
			.then((views: ViewEntity[]) => Promise.all([...views]?.map(async (view) => await ViewService.removeUselessData(view))))
			.then((views: ViewEntity[]) => EntitiesService.mapEntities(views));

		try { response = { nodes: await nodes, blocks: await blocks, views: await views } }
		catch (exp) { throw new Error(`Help Service: An error occured when get help: ${exp.message}`); }
		return response;
	};

	const getSlugMap = async (query) => {
		const defaultLocale = await LocaleService.getDefaultLocale();
		let response = undefined;

		const filter = { nodes: { ...node_options, locale: query?.locale || defaultLocale } };

		const nodes = strapi.documents(DSEntities.NODE).findMany(filter.nodes)
			.then((nodes: NodeEntity[]) => Promise.all([...nodes]?.map(async (node) => await NodeService.removeUselessData(node))))
			.then((nodes: NodeEntity[]) => EntitiesService.mapEntitiesByProperty(nodes, EntityProperties.SLUG));

		try { response = { nodes: await nodes } }
		catch (exp) { throw new Error(`Help Service: An error occured when get help: ${exp.message}`); }
		return response;
	}
	
	return { getMap, getSlugMap }

};
