import { ComponentsUids } from "../../../src/models/Component";
import { DSEntities, DSEntityTypes } from "../../../src/models/Entities";

export default {
	kind: 'collectionType',
	collectionName: 'blocks',
	info: {
		singularName: 'block',
		pluralName: 'blocks',
		displayName: 'Blocks',
		description: 'Drupal Style Block entity type',
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
			},
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
		Entity: {
			type: 'string',
			required: true,
			default: DSEntityTypes.BLOCK,
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
		Body: {
			pluginOptions: {
				i18n: {
					localized: true
				}
			},
			type: 'blocks',
			required: false
		},
		Context: {
			type: 'component',
			repeatable: false,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
			component: ComponentsUids.BLOCK_VIEW
		},
		Views: {
			type: 'relation',
			relation: 'oneToOne',
			target: DSEntities.VIEW,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
		},
		Region: {
			type: 'relation',
			required: true,
			relation: 'oneToOne',
			target: DSEntities.REGION,
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
		},
		Weight: {
			pluginOptions: {
				i18n: {
					localized: false
				}
			},
			type: 'integer',
			default: 0
		},
		Classes: {
			type: 'string',
			pluginOptions: {
				i18n: {
					localized: false
				}
			}
		}
	}
}