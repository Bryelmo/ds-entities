
import { BlockContext, BlockEntity, BlockPerRegionResponse } from '../models/Block';
import { EntitiesService } from './Entities';
import { EntityTypeService } from './EntityType';
import { RegionService } from './Region';
import { ViewService } from './View';

export const BlockService = {

	/**
	 *  @description I mount the layout response
	 *  @param {BlockEntity[]} blocks
	 *  @return {BlockPerRegionResponse}
	 */
	async composeResponse(blocks: BlockEntity[]): Promise<BlockEntity[]> { 
		return await Promise.all([...blocks]?.map(async (block) => await this.removeUselessData(block) ));
	},

	/**
	 *  @description I clean the block object data from API from useless data
	 *  @param {BlockEntity} block
	 *  @return {BlockEntity}
	 */
	async removeUselessData(block: BlockEntity): Promise<BlockEntity> {
		let _block: Partial<BlockEntity> = {
			...block,
			Type: block.Type ? EntityTypeService.removeUselessData(block.Type) : null,
			Context: block.Context ? this.getContextData(block.Context) : null,
			Region: block.Region ? RegionService.removeUselessData(block.Region) : null,
			Views: block.Views ? await ViewService.composeData(block.Views) : null,
		};
		return { ...EntitiesService.cleanNullData(_block) }
	},

	/**
	 *  @description I organize blocks for specific regions
	 *  @param {BlockEntity[]} blocks
	 *  @return {Promise<BlockPerRegionResponse>}
	 */
	groupBlocksByRegion(blocks: BlockEntity[]): BlockPerRegionResponse {
		return [...blocks]?.reduce((group, block) => {
			const region: string = block?.Region.Name || 'unassigned';
			group[region] = group[region] ?? [];
			group[region].push(block);
			return { ...group, [region]: this.sortBlockByProperty(group[region]) };
		}, {});
	},

	/**
	 *  @description I sort blocks per Weight property
	 *  @param {BlockEntity[]} blocks
	 *  @return {BlockEntity[]}
	 */
	sortBlockByProperty(blocks: BlockEntity[]): BlockEntity[] {
		return [...blocks].sort((prev, next) => (prev.Weight - next.Weight));
	},

	/**
	 *  @description I compose the context response data
	 *  @param {BlockContext} context
	 *  @return {BlockContext | null}
	 */
	getContextData(context: BlockContext | null): BlockContext | null {
		if (!context) { return null }
		const nodesNotEmpty: boolean = Boolean(context.Nodes && context.Nodes.length > 0);
		const nodeTypesNotEmpty: boolean = Boolean(context.NodeTypes && context.NodeTypes.length > 0);
		if (!nodesNotEmpty && !nodeTypesNotEmpty) { return null }
		const _context: BlockContext = {
			Nodes: nodesNotEmpty ? context.Nodes?.map((node: any) => (node.Slug)) : null,
			NodeTypes: nodeTypesNotEmpty ? context.NodeTypes?.map((type: any) => (type.Name)) : null,
		}
		return EntitiesService.cleanNullData(_context);
	},

}