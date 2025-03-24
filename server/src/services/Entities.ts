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
		let response = undefined;
		const defaultLocale = await LocaleService.getDefaultLocale();
		const populate_options = EntitiesService.getMappedPopulateOptions(query);
		const filters_options = EntitiesService.getFilterOptions(query);
		const _node_options = { 
			...node_options, 
			populate: { ...node_options.populate, ...populate_options.nodes },
			filters: filters_options.nodes
		};
		const _block_options = { 
			...block_options,
			populate: { ...block_options.populate, ...populate_options.blocks },
			filters: filters_options.blocks
		};
		const _view_options = { 
			...view_options,
			populate: { ...view_options.populate, ...populate_options.views },
			filters: filters_options.views
		};

		const filter = { 
			nodes: { ..._node_options, locale: query?.locale || defaultLocale },
			blocks: { ..._block_options, locale: query?.locale || defaultLocale },
			views: { ..._view_options, locale: query?.locale || defaultLocale },
		};
		
		const nodes = strapi.documents(DSEntities.NODE).findMany(filter.nodes)
			.then((nodes: NodeEntity[]) => Promise.all([...nodes]?.map(async (node) => await NodeService.removeUselessData(node))))
			.then((nodes: NodeEntity[]) => EntitiesService.mapEntities(nodes));
		
		const blocks = strapi.documents(DSEntities.BLOCK).findMany(filter.blocks)
			.then((blocks: BlockEntity[]) => Promise.all([...blocks]?.map(async (block) => {
				let _block = await BlockService.removeUselessData(block);
				if (block.Views) { _block.Views = await EntitiesService.cleanNullData(block.Views) }
				return { ..._block }
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
		let response = undefined;
		
		const defaultLocale = await LocaleService.getDefaultLocale();
		const populate_options = EntitiesService.getPopulateOptions(query);
		const filters_options = EntitiesService.getFilterOptions(query);
		const options = { 
			...node_options, 
			populate: { ...node_options.populate, ...populate_options },
			filters: filters_options.nodes
		};
		const filter = { nodes: { ...options, locale: query?.locale || defaultLocale } };	

		const nodes = strapi.documents(DSEntities.NODE).findMany(filter.nodes)
			.then((nodes: NodeEntity[]) => Promise.all([...nodes]?.map(async (node) => await NodeService.removeUselessData(node))))
			.then((nodes: NodeEntity[]) => EntitiesService.mapEntitiesByProperty(nodes, EntityProperties.SLUG));

		try { response = { nodes: await nodes } }
		catch (exp) { throw new Error(`Help Service: An error occured when get help: ${exp.message}`); }
		return response;
	}
	
	return { getMap, getSlugMap }

};
