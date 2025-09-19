
import _ from 'lodash';
import { BlockEntity } from '../models/Block';
import { DSEntities, DSEntity, DSEntityTypes, EntitiesTypeMap, EntityProperties, viewConfigs } from '../models/Entities';
import { NodeEntity } from '../models/Node';
import { Entity, StrapiStoreKeyNames, StrapiStoreNames, StrapiStoreTypes } from '../models/Strapi';
import { ViewEntity } from '../models/View';
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
				if (entity === DSEntities.NODE && data.Title) { data.Slug = NodeService.getSlug(data.Title) }
				if (entity === DSEntities.TYPE || entity === DSEntities.REGION || entity === DSEntities.TAG) { 
					data.Name = NodeService.getSlug(data.Label)
				}
			},
			async beforeUpdate(event) {
				const { data } = event.params;
				if (entity === DSEntities.NODE && data.Title) { data.Slug = NodeService.getSlug(data.Title) }
				if (entity === DSEntities.TYPE || entity === DSEntities.REGION || entity === DSEntities.TAG) { 
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
		Object.keys(object || [])?.forEach((property: string) => {
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
		const stored_config = (await pluginStore?.get({ key: StrapiStoreKeyNames[entity] })) || {};
		const default_config = viewConfigs[entity];
		const config = {
			settings: _.merge({}, stored_config?.settings, default_config.settings),
			metadatas: _.merge({}, stored_config?.metadatas, default_config.metadatas),
			layouts: _.merge({}, stored_config?.layouts, default_config.layouts),
			uid: stored_config?.uid || default_config?.uid
		}
		config.layouts.list = _.uniq(config.layouts.list);
		config.layouts.edit = _.uniqWith( config.layouts.edit.map(row => _.uniqBy(row, 'name')), _.isEqual );
		await pluginStore?.set({ key: StrapiStoreKeyNames[entity], value: config });
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
	},

	/**
	 *  @description I return the map with entities
	 *  @param {NodeEntity[] | BlockEntity[] | ViewEntity[]} entities
	 *  @return {EntitiesTypeMap}
	 */
	mapEntities(entities: NodeEntity[] | BlockEntity[] | ViewEntity[]): EntitiesTypeMap {
		let map: EntitiesTypeMap = {};
		const grouped:any = this.groupEntitiesByType(entities);
		Object.keys(grouped)?.forEach((type:string) => {
			map[type] = this.mapEntitiesByProperty(grouped[type], EntityProperties.UID);
		})
		return map;
	},

	/**
	 *  @description I organize entities for specific types
	 *  @param {NodeEntity[] | BlockEntity[] | ViewEntity[]} entities
	 *  @return {EntitiesTypeMap}
	 */
	groupEntitiesByType(entities: NodeEntity[] | BlockEntity[] | ViewEntity[]): { [uid: string]: DSEntity[] } {
		return [...entities]?.reduce((group, entity) => {
			const type: string = entity.Type.Name;
			group[type] = group[type] ?? [];
			group[type].push(entity);
			return { ...group, [type]: group[type] };
		}, {});
	},

	/**
	 *  @description I return the map base on a specific property
	 *  @param {NodeEntity[] | BlockEntity[] | ViewEntity[]} entities
	 *  @param {EntityProperties} property
	 *  @return {{ [uid: string]: DSEntity }}
	 */
	mapEntitiesByProperty(entities: NodeEntity[] | BlockEntity[] | ViewEntity[], property: EntityProperties): { [uid: string]: DSEntity } {
		let map:{[uid: string]: DSEntity } = {};
		entities?.forEach((entity) => { map[entity[property]] = entity })
		return map;
	},

	/**
	 *  @description I return the populate object configuration for map endpoint
	 *  @param {Any} query
	 *  @return {Any}
	 */
	getPopulateOptions(query: any): any {
		if (!query.hasOwnProperty('populate')) { return {} };
		const populate = query.populate;
		return populate;
	},

	/**
	 *  @description I return the filters object configuration
	 *  @param {Any} query
	 *  @return {Any}
	 */
	getFilterOptions(query): any {
		if (!query.hasOwnProperty('filters')) { return {} }
		let options = {};
		Object.keys(query.filters).forEach((entity: string) => { options[entity] = query.filters[entity] })
		return options;
	},
	
	/**
	 *  @description I return the filters object configuration
	 *  @param {Any} query
	 *  @return {Any}
	 */
	getFieldsOptions(query): any {
		if (!query.hasOwnProperty('fields')) { return {} }
		let options = {};
		Object.keys(query.fields).forEach((entity: string) => { options[entity] = query.fields[entity] })
		return options;
	}

}