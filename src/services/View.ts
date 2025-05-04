
import { ViewBody, ViewBodyProperties, ViewEntity, ViewRegion } from '../models/View';
import { BlockEntity } from '../models/Block';
import { EntitiesService } from './Entities';
import { NodeEntity, NodesQueryFilter } from '../models/Node';
import { NodeService } from './Node';
import { TypeEntity } from '../models/Type';
import { StrapiFilterTypes } from '../models/Strapi';
import { EntityTypeService } from './EntityType';

export const ViewService = {

	/**
	 *  @description I remove useless properties from the view data for response
	 *  @param {ViewEntity} view
	 *  @return {ViewEntity}
	 */
	async composeData(view: ViewEntity | undefined | null): Promise<ViewEntity | null> {
		if (!view) { return null }
		let cleaned: Partial<ViewEntity> = {
			...view,
			Type: view.Type ? EntityTypeService.removeUselessData(view.Type) : null,
			Header: view.Header ? await this.composeViewRegionData(view.Header) : null,
			Body: view.Body ? await this.composeViewBodyData(view.Body) : null,
			Footer: view.Footer ? await this.composeViewRegionData(view.Footer) : null,
		};
		delete cleaned.id;
		delete cleaned.createdAt;
		delete cleaned.updatedAt;
		delete cleaned.publishedAt;
		delete cleaned.locale;
		return cleaned as ViewEntity;
	},

	/**
	 *  @description I remove useless properties from the view region data for response
	 *  @param {ViewRegion} region
	 *  @return {ViewRegion}
	 */
	async composeViewRegionData(region: ViewRegion): Promise<ViewRegion> {
		let cleaned: Partial<ViewRegion> = {
			...region,
			Blocks: region?.Blocks?.length > 0 ? 
			(await Promise.all(region.Blocks?.map((block: BlockEntity) => (
				ViewService.composeViewRegionBlockData(block)
			)))) : []
		};
		delete cleaned.id;
		return EntitiesService.cleanNullData(cleaned) as ViewRegion;
	},
	
	/**
	 *  @description I compose view data getting related nodes
	 *  @param {ViewBody} body
	 *  @return {Promise<ViewRegion>}
	 */
	async composeViewBodyData(body: ViewBody): Promise<ViewRegion> {
		let cleaned: Partial<ViewBody> = { ...body, Nodes: await this.getViewNodes(body) };
		delete cleaned.id;
		delete cleaned.NodeTypes;
		delete cleaned.Tags;
		return cleaned as ViewRegion;
	},

	/**
	 *  @description I get the node list attached to the view Body 
	 *  @param {ViewBody} body
	 *  @return {Promise<NodeEntity[]>}
	 */
	async getViewNodes(body: ViewBody): Promise<NodeEntity[]> {
		const referenced_nodes: NodeEntity[] = body.Nodes?.map((node: NodeEntity) => (NodeService.removeUselessData(node))) || [];
		const exist_nodetypes: boolean = body?.NodeTypes && body?.NodeTypes.length > 0 || false;
		const exist_tags: boolean = body?.Tags && body?.Tags.length > 0 || false;
		let typed_nodes: NodeEntity[] = [];
		let tagged_nodes: NodeEntity[] = [];
		if (exist_nodetypes) {
			typed_nodes = await this.getViewNodesByEntityType(ViewBodyProperties.NODETYPES, body.NodeTypes);
			typed_nodes = [...typed_nodes]?.map((node: NodeEntity) => (NodeService.removeUselessData(node))) || [];
		}
		if (exist_tags) {
			tagged_nodes = await this.getViewNodesByEntityType(ViewBodyProperties.TAGS, body.Tags);
			tagged_nodes = [...tagged_nodes]?.map((node: NodeEntity) => (NodeService.removeUselessData(node))) || [];
		}
		return [ ...referenced_nodes,  ...typed_nodes, ...tagged_nodes ];
	},

	/**
	 *  @description I get the node list filtered per specific entity type
	 *  @param {ViewBodyProperties} entity_type
	 *  @param {TypeEntity[]} type_entities
	 *  @return {Promise<NodeEntity[]>}
	 */
	async getViewNodesByEntityType(entity_type: ViewBodyProperties, type_entities: any[]): Promise<NodeEntity[]> {
		const entity_types: string[] = this.getViewBodyTypeEntity(type_entities);
		const filters: NodesQueryFilter = { [entity_type]: { values: entity_types, type: StrapiFilterTypes.AND } };
		const query: any = NodeService.composeQuery(filters);
		return await NodeService.getNodes(query)
	},

	/**
	 *  @description I return a clean list of type entity (Nodetype or Tags)
	 *  @param {EntityType[] | nul} EntityType
	 *  @return {string[]}
	 */
	getViewBodyTypeEntity(EntityType: TypeEntity[]  | null): string[] {
		return EntityType?.map((type: TypeEntity) => type.Name) || []
	},

	/**
	 *  @description I clean the block object data from API from useless data
	 *  @param {BlockEntity} block
	 *  @return {BlockEntity}
	 */
	async composeViewRegionBlockData(block: BlockEntity): Promise<BlockEntity> {
		let _block: Partial<BlockEntity> = {
			...block,
			Type: block.Type ? EntityTypeService.removeUselessData(block.Type) : null,
			Views: block.Views ? await ViewService.composeData(block.Views) : null,
		};
		delete _block.id;
		delete _block.Weight;
		delete _block.Context;
		delete _block.Region;
		delete _block.locale;
		return { ...EntitiesService.cleanNullData(_block) }
	},

	/**
	 *  @description I clean the node object data from API from useless data
	 *  @param {ViewEntity} view
	 *  @return {ViewEntity}
	 */
	async removeUselessData(view: ViewEntity): Promise<ViewEntity> {
		const body_view: NodeEntity[] = view.Body ? await this.getViewNodes(view.Body) : null;
		const body_adapted: any = body_view?.map(node => ({ id: node?.id, documentId: node?.documentId, Uid: node?.Uid })) || [];
		let _view: Partial<ViewEntity> = {
			...view,
			Type: EntityTypeService.removeUselessData(view.Type),
			Body: this.mountAdaptedBody(view.Body, body_adapted)
		};
		return { ...EntitiesService.cleanNullData(_view) }
	},

	/**
	 *  @description I mount the view body keeping nodes and adding extended fields
	 *  @param {Any} view_body
	 *  @param {Any} adapted_body
	 *  @return {Any}
	 */
	mountAdaptedBody(view_body:any, adapted_body:any):any {
		let adapted = { ...view_body, Nodes: adapted_body };
		delete adapted.id;
		delete adapted.NodeTypes;
		return adapted
	}

}