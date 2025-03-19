import { BlockEntity } from "../../../src/models/Block";
import { DSEntities } from "../../../src/models/Entities";
import { EntityProperties } from "../../../src/models/Entities";
import { BlockService } from "../../../src/services/Block";
import { RegionService } from "../../../src/services/Region";
import { TagService } from "../../../src/services/Tag";
import { EntityTypeService } from "../../../src/services/EntityType";
import { LocaleService } from "../../../src/services/Locale";

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
		const defaultLocale = await LocaleService.getDefaultLocale();
		let layout = undefined;
		const filter = { ...options, locale: query?.locale || defaultLocale };
		const blocks = strapi.documents(DSEntities.BLOCK).findMany(filter)
						.then((blocks:BlockEntity[]) => BlockService.composeResponse(blocks)
						.then((blocks: BlockEntity[]) => BlockService.groupBlocksByRegion(blocks)) );
		try { layout = await blocks }
		catch (exp) { throw new Error(`Help Service: An error occured when get help: ${exp.message}`); }
		return layout;
	}
	
	return { getLayout }

};
