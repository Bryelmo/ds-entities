
import { DSEntities } from "../models/Entities";
import { NodeEntity, NodeEntityProperties, NodesQueryFilter } from "../models/Node";
import { TagEntity } from "../models/Tag";
import { EntitiesService } from "./Entities";
import { TagService } from "./Tag";
import { EntityTypeService } from "./EntityType";

export const NodeService = {

	/**
	 *  @var fields
	 *  @description Fields that needs to be available in API
	 */
	fields: [
		NodeEntityProperties.TITLE,
		NodeEntityProperties.HIDETITLE,
		NodeEntityProperties.SLUG,
		NodeEntityProperties.ENTITY,
		NodeEntityProperties.UID,
		NodeEntityProperties.CREATEDAT,
		NodeEntityProperties.UPDATEDAT,
		NodeEntityProperties.PUBLISHEDAT
	],

	query: {
		status: { $eq: 'published' },
		populate: '*'
	},

	/**
	 *  @description I return the list of node entities
	 *  @param {Any} query
	 *  @return {Promise<Any>}
	 */
	async getNodes(query: any): Promise<any> {
		return strapi.documents(DSEntities.NODE).findMany(query);
	},

	/**
	 *  @description I return the Slug value from use the node title
	 *  @param {String} title
	 *  @return {String}
	 */
	getSlug(title: string): string {
		let slug: string = '';
		if (title && title.length > 0) {
			const titleWithoutAccents: string = title?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			slug = titleWithoutAccents.replace(/['‘’"“”.,;:!?#@&$£+-/|^()%\[\]]/g, '');
			const array: string[] = slug.toLocaleLowerCase().split(' ');
			if (array.length > 0) { slug = array.join('-') }
		}
		return slug;
	},

	/**
	 *  @description I clean the node object data from API from useless data
	 *  @param {NodeEntity} node
	 *  @return {NodeEntity}
	 */
	removeUselessData(node: NodeEntity): NodeEntity {
		let _node: Partial<NodeEntity> = {
			...node,
			Type: EntityTypeService.removeUselessData(node.Type),
			Tags: node.Tags?.map((tag: TagEntity) => (TagService.removeUselessData(tag))) || null,
		};
		delete _node.createdBy;
		delete _node.updatedBy;
		return { ...EntitiesService.cleanNullData(_node) }
	},

	/**
	 *  @description I mount the Strapi query option for getting nodes
	 *  @param {NodesQueryFilter} filter
	 *  @return {Any}
	 */
	composeQuery(filter: NodesQueryFilter): any {
		let query: any = { ...this.query };
		const entity_type_name = Object.keys(filter)[0];
		const entity_filter = filter[entity_type_name];
		query = {
			...query,
			filters: {
				[entity_filter.type]: [
					...entity_filter.values.map((value: string) => ({ Type: { Name: { $eq: value }}}))
				]
			}
		}
		return query;

	}
	

}