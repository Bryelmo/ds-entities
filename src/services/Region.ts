import { Core } from '@strapi/strapi';
import { DSEntities } from '../models/Entities';
import { RegionEntity, RegionEntityProperties } from '../models/Region';
import { EntitiesService } from './Entities';
import { Entity } from '../models/Strapi';

export const RegionService = {

	/**
	 *  @var fields
	 *  @description Fields that needs to be available in API
	 */
	fields: [
		RegionEntityProperties.NAME
	],

	/**
	 *  @description I init the region entity creating a default one
	 *  @param {Strapi} strapi
	 *  @return {Promise<any>}
	 */
	async init(strapi: Core.Strapi):Promise<any> {
		const regions: any[] = (await strapi.db?.query(DSEntities.REGION).findMany()) || [];
		if (regions.length === 0) {
			const defaultRegion: Partial<RegionEntity> = { Label: 'Unassigned', Name: 'unassigned', Default: true };
			await EntitiesService.createEntity(DSEntities.REGION, defaultRegion as Entity);
		}
	},

	/**
	 *  @description I remove useless properties from the region data for response
	 *  @param {RegionEntity} region
	 *  @return {RegionEntity}
	 */
	removeUselessData(region:RegionEntity): RegionEntity {
		let cleaned: Partial<RegionEntity> = { ...region };
		delete cleaned.id;
		delete cleaned.Label;
		delete cleaned.documentId;
		delete cleaned.createdAt;
		delete cleaned.updatedAt;
		return cleaned as RegionEntity;
	}

}