import { Core } from '@strapi/strapi';
import { DSEntities } from '../models/Entities';
import { DSEntityReferenceTypes, TypeEntity, TypeEntityProperties } from '../models/Type';

export const EntityTypeService = {

	/**
	 *  @var fields
	 *  @description Fields that needs to be available in API
	 */
	fields: [
		TypeEntityProperties.NAME  
	],

	/**
	 *  @description I init the type entity creating a default one
	 *  @param {Strapi} strapi
	 *  @return {Promise<any>}
	 */
	async init(strapi: Core.Strapi):Promise<any> {
		const entityTypes: any[] = (await strapi.db?.query(DSEntities.TYPE).findMany()) || [];
		const dsEntities: DSEntities[] = [DSEntities.BLOCK, DSEntities.NODE, DSEntities.VIEW ];
		if (entityTypes.length === 0) {
			for (const entity of dsEntities) {
				const defaultType: Partial<TypeEntity> = {
					Label: entity === DSEntities.NODE ? 'Article' : 'Default',
					Name: entity === DSEntities.NODE ? 'article' : 'default',
					Default: true,
					Reference: entity === DSEntities.NODE ? DSEntityReferenceTypes[DSEntities.NODE] : DSEntityReferenceTypes[entity]
				};
				strapi.db?.query(DSEntities.TYPE).create({ data: defaultType });
			}
		}
	},

	/**
	 *  @description I return the DSEntity uid from the request url
	 *  @param {String} url
	 *  @return {DSEntities}
	 */
	getEntityFromRequestUrl(url: string): DSEntities {
		let entity: DSEntities;
		const isTypeEntityRelationEndpoint: boolean = url.includes(`/content-manager/relations/`);
		const isTypeEntityBlockRelated: boolean = isTypeEntityRelationEndpoint && url.includes(DSEntities.BLOCK);
		const isTypeEntityViewRelated: boolean = isTypeEntityRelationEndpoint && url.includes(DSEntities.VIEW);
		if (isTypeEntityBlockRelated) { entity = DSEntities.BLOCK }
		else if (isTypeEntityViewRelated) { entity = DSEntities.VIEW }
		else { entity = DSEntities.NODE }
		return entity
	},

	/**
	 *  @description I remove useless properties from the type data for response
	 *  @param {TypeEntity} type
	 *  @return {TypeEntity}
	 */
	removeUselessData(type: TypeEntity): TypeEntity {
		let cleaned: Partial<TypeEntity> = { ...type };
		delete cleaned.id;
		delete cleaned.documentId;
		delete cleaned.Reference;
		delete cleaned.Default;
		delete cleaned.Label;
		delete cleaned.createdAt;
		delete cleaned.updatedAt;
		delete cleaned.publishedAt;
		delete cleaned.locale;
		return cleaned as TypeEntity;
	},

}