
import { Core, Schema } from '@strapi/strapi';
import BlockViewComponent from '../../server/src/components/View';
import BlockReferencesComponent from '../../server/src/components/Reference';
import ViewSectionsComponent from '../../server/src/components/Section';
import { ComponentReferences, ComponentsUids } from '../models/Component';
import { DSEComponentTypes, viewConfigs } from '../models/Entities';
import { StrapiStoreKeyNames, StrapiStoreNames, StrapiStoreTypes } from '../models/Strapi';

export const ComponentsService = {

	/**
	 *  @description I register DSEntities components
	 *  @param {Core.Strapi} strapi
	 *  @return {Core.Strapi}
	 */
	register(strapi: Core.Strapi): Core.Strapi {
		strapi.components[ComponentsUids.BLOCK_VIEW] = this.getExtendedComponent(ComponentsUids.BLOCK_VIEW);
		strapi.components[ComponentsUids.VIEW_REFERENCES] = this.getExtendedComponent(ComponentsUids.VIEW_REFERENCES);
		strapi.components[ComponentsUids.VIEW_SECTIONS] = this.getExtendedComponent(ComponentsUids.VIEW_SECTIONS);
		return strapi
	},

	/**
	 *  @description I handle the component extensions for custom project
	 *  @param {ComponentsUids} component_uid
	 *  @return {Schema.Component}
	 */
	getExtendedComponent(component_uid: ComponentsUids): Schema.Component {
		const exist_component_extension = strapi.components.hasOwnProperty(component_uid);
		const component_extension_attributes = exist_component_extension ? strapi.components[component_uid].attributes : {};
		const extended_component = {
			...ComponentReferences[component_uid],
			attributes: {
				...ComponentReferences[component_uid].attributes,
				...component_extension_attributes
			},
			__schema__: {
				...ComponentReferences[component_uid].__schema__,
				attributes: {
					...ComponentReferences[component_uid].__schema__.attributes,
					...component_extension_attributes
				}
			}
		}
		return extended_component as Schema.Component;
	},

	/**
	 *  @description I init the view configuration for the specific component
	 *  @param {DSEComponentTypes} component
	 *  @return {Promise<any>}
	 */
	async initComponentViewConfiguration(component: DSEComponentTypes): Promise<any> {
		const pluginStore: Partial<any> = strapi.store?.({
			type: StrapiStoreTypes.PLUGIN,
			name: StrapiStoreNames.CONTENT_MANAGER
		});
		const stored_config = await pluginStore?.get({ key: StrapiStoreKeyNames[component] });
		const default_config = viewConfigs[component];
		const config = {
			settings: { ...stored_config.settings, ...default_config.settings },
			metadatas: { ...stored_config.metadatas, ...default_config.metadatas },
			layouts: { ...stored_config.layouts, ...default_config.layouts },
			uid: stored_config.uid
		}
		await pluginStore?.set({ key: StrapiStoreKeyNames[component], value: config });
	}

}