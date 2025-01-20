
import { DSEntities, DSEntityTypes, viewConfigs } from '../models/Entities';
import { Entity, StrapiStoreKeyNames, StrapiStoreNames, StrapiStoreTypes } from '../models/Strapi';
import { LocaleService } from './Locale';
import { NodeService } from './Node';

export const EntitiesService = {

	/**
	 *  @description I return the entity list
	 *  @param {DSEntities} entity
	 *  @param {Any} filters
	 *  @return {Promise<any[]>}
	 */
	async getEntities(entity: DSEntities, filters?: any): Promise<any[]> {
		return strapi.documents(entity).findMany(filters) as Promise<any[]>;
	},
	
	/**
	 *  @description I return the entity
	 *  @param {DSEntities} entity
	 *  @param {Any} filters
	 *  @return {Promise<any>}
	 */
	async getEntity(entity: DSEntities, filters?: any): Promise<any> {
		return strapi.documents(entity).findOne(filters) as Promise<any>;
	},

	/**
	 *  @description I create a specific entity
	 *  @param {DSEntities} entity
	 *  @param {Entity} body
	 *  @return {Promise<any>}
	 */
	async createEntity(entity: DSEntities, body: Entity): Promise<any> {
		return strapi.documents(entity).create({ data: body } as any) as Promise<any>;
	},

	/**
	 *  @description I update a specific entity
	 *  @param {DSEntities} entity
	 *  @param {any} body
	 *  @return {Promise<any>}
	 */
	async updateEntity(entity: DSEntities, body: any): Promise<any> {
		return strapi.documents(entity).update({ documentId: body.documentId, data: body, status: 'published' } as any) as Promise<Entity>;
	},

	/**
	 *  @description I delete a specific entity
	 *  @param {DSEntities} entity
	 *  @param {String} documentId
	 *  @return {Promise<any>}
	 */
	async deleteEntity(entity: DSEntities, documentId: string): Promise<any> {
		return strapi.documents(entity).delete({ documentId: documentId });
	},

	/**
	 *  @description I fill the Uid entity field with a custom value
	 *  @param {DSEntities} entity
	 *  @return {Promise<void>}
	 */
	registerFilledField(entity:DSEntities):Promise<void> {
		const contentTypeEntity: any = strapi.contentType(entity);
		const { lifecycles } = contentTypeEntity as any;
		return contentTypeEntity.lifecycles = {
			...lifecycles,
			async beforeCreate(event) {
				const { data } = event.params;
				const defaultLocale = await LocaleService.getDefaultLocale();
				if (data.locale === defaultLocale) { data.Uid = EntitiesService.getUid(data.Entity, data.Title) }
				if (entity === DSEntities.NODE) { data.Slug = NodeService.getSlug(data.Title) }
				if (entity === DSEntities.TYPE || entity === DSEntities.REGION) { data.Name = NodeService.getSlug(data.Label) }
			},
			async beforeUpdate(event) {
				const { data } = event.params;
				if (entity === DSEntities.TYPE || entity === DSEntities.REGION) { 
					data.Name = NodeService.getSlug(data.Label)
				}
			},
			async afterCreate(event) {
				const { data } = event.params;
				const isNodeEntityType: boolean = data.Reference === DSEntityTypes.NODE;
				const isDevelopment: boolean = process.env.NODE_ENV === 'development';
				if (entity === DSEntities.TYPE && isNodeEntityType && isDevelopment) { strapi.reload(); }
			},
			async afterUpdate(event) {
				const { data } = event.params;
				const isNodeEntityType: boolean = data.Reference === DSEntityTypes.NODE;
				const isDevelopment: boolean = process.env.NODE_ENV === 'development';
				if (entity === DSEntities.TYPE && isNodeEntityType && isDevelopment) { strapi.reload(); }
			},
		};
	},

	/**
	 *  @description I return the Uid value from use the entity title
	 *  @param {String} title
	 *  @return {String}
	 */
	getUid(entity_type: string, title: string): string {
		let uid: string = '';
		if (title && title.length > 0) {
			const titleWithoutAccents: string = title?.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			uid = titleWithoutAccents.replace(/['‘’"“”.,;:!?#@&$£+-/|^()%\[\]]/g, '');
			const array: string[] = uid.toLocaleLowerCase().split(' ');
			if (array.length > 0) { uid = `${entity_type}_${array.join('-')}` }
		}
		return uid;
	},

	/**
	 *  @description I delete null properties from the block object
	 *  @param {Any} object
	 *  @return {Any}
	 */
	cleanNullData(object: any): any {
		let _object: any = { ...object };
		Object.keys(object)?.forEach((property: string) => {
			if (object[property] === null) { delete _object[property] }
		})
		return { ..._object }
	},

	/**
	 *  @description I init the view configuration for the specific entity
	 *  @param {DSEntityTypes} entity
	 *  @return {Promise<any>}
	 */
	async initEntityViewConfiguration(entity:DSEntityTypes):Promise<any> {
		const pluginStore: Partial<any> = strapi.store?.({
			type: StrapiStoreTypes.PLUGIN,
			name: StrapiStoreNames.CONTENT_MANAGER
		});
		await pluginStore?.set({ key: StrapiStoreKeyNames[entity], value: viewConfigs[entity] });
	},

	/**
	 *  @description I return a substring included in two strings
	 *  @param {String} string
	 *  @param {String} start
	 *  @param {String} end
	 *  @return {String}
	 */
	getSubstringInString(string: string, start:string, end:string):string {
		const position = string.indexOf(start) + start.length;
		return string.substring(position, string.indexOf(end, position));
	}

}