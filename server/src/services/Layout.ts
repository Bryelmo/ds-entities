import { BlockEntity } from "../../../src/models/Block";
import { DSEntities } from "../../../src/models/Entities";
import { EntityProperties } from "../../../src/models/Entities";
import { BlockService } from "../../../src/services/Block";
import { RegionService } from "../../../src/services/Region";
import { TagService } from "../../../src/services/Tag";
import { EntityTypeService } from "../../../src/services/EntityType";
import { LocaleService } from "../../../src/services/Locale";
import { EntitiesService } from "../../../src/services/Entities";

const options = {
	status: 'published',
	fields: '*',
	populate: {
		Type: { fields: EntityTypeService.fields },
		Region: { fields: RegionService.fields },
		Context: { 
			populate: {
				Nodes: { fields: [EntityProperties.SLUG, EntityProperties.UID ] },
				NodeTypes: { fields: EntityTypeService.fields }
			}
		},
		Views: {
			fields: '*',
			populate: {
				Type: { fields: EntityTypeService.fields },
				Header: { populate: { Blocks: { populate: { Type: { fields: EntityTypeService.fields } } } } },
				Body: { 
					populate: {
						Nodes: { 
							fields: '*',
							populate: {
								Type: { fields: EntityTypeService.fields },
								Image: { fields: '*' },
								Tags: { fields: TagService.fields },
								localizations: { fields: '*' },
							}
						},
						NodeTypes: { populate: '*' }
					}
				},
				Footer: { populate: { Blocks: { populate: { Type: { fields: EntityTypeService.fields } } } } }
			}
		},
	}
}

export default ({ strapi }) => {
	
	const getLayout = async (query) => {
		let response = undefined;
		const defaultLocale = await LocaleService.getDefaultLocale();
		const populate_options = EntitiesService.getMappedPopulateOptions(query);
		const filters_options = EntitiesService.getFilterOptions(query);

		const _options = { 
			...options, 
			populate: { 
				...options.populate, 
				...populate_options.blocks,
				Views: { 
					...options.populate.Views, 
					populate: { 
						...options.populate.Views.populate, 
						...populate_options.views,
						Body: {
							...options.populate.Views.populate.Body, 
							populate: {
								...options.populate.Views.populate.Body.populate,
								Nodes: {
									...options.populate.Views.populate.Body.populate.Nodes,
									populate: {
										...options.populate.Views.populate.Body.populate.Nodes.populate,
										...populate_options.nodes
									},
									filters: { ...filters_options.nodes }
								} 
							}
						}
					},
					filters: { ...filters_options.views }
				}
			},
			filters: { ...filters_options.blocks }
		};

		const filter = { ..._options, locale: query?.locale || defaultLocale };

		const blocks = strapi.documents(DSEntities.BLOCK).findMany(filter)
						.then((blocks:BlockEntity[]) => BlockService.composeResponse(blocks)
						.then((blocks: BlockEntity[]) => BlockService.groupBlocksByRegion(blocks)) );
		try { response = await blocks }
		catch (exp) { throw new Error(`Help Service: An error occured when get help: ${exp.message}`); }
		return response;
	}
	
	return { getLayout }

};
