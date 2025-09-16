import { ComponentsUids } from "../../../src/models/Component";
import { DSEntities, DSEntityTypes } from "../../../src/models/Entities";

export default {
	kind: 'collectionType',
	collectionName: 'views',
	info: {
		singularName: 'view',
		pluralName: 'views',
		displayName: 'Views',
		description: 'Drupal Style View entity type',
	},
	options: {
		draftAndPublish: true
	},
	pluginOptions: {
		'content-manager': {
			visible: true,
		},
		'content-type-builder': {
			visible: true,
		},
		'users-permissions': {
			visible: true
		},
		i18n: {
			localized: true
		}
	},
	attributes: {
		Title: {
			type: 'string',
			required: true,
			pluginOptions: {
				i18n: {
					localized: true
				}
			}
		},
		HideTitle: {
			type: 'boolean',
			required: false,
			default: false,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
		},
		Type: {
			type: 'relation',
			required: true,
			relation: 'oneToOne',
			target: DSEntities.TYPE,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
		},
		Uid: {
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
			type: 'string',
			required: false
		},
		Entity: {
			type: 'string',
			required: true,
			default: DSEntityTypes.VIEW,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
		},
		Header: {
			type: 'component',
			repeatable: false,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
			component: ComponentsUids.VIEW_SECTIONS
		},
		Body: {
			type: 'component',
			repeatable: false,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
			component: ComponentsUids.VIEW_REFERENCES
		},
		Options: {
			type: 'component',
			repeatable: false,
			required: true,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
			component: ComponentsUids.VIEW_OPTIONS
		},
		Footer: {
			type: 'component',
			repeatable: false,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
			component: ComponentsUids.VIEW_SECTIONS
		}
	}
}