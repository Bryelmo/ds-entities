import BlockViewComponent from '../../server/src/components/View';
import BlockReferencesComponent from '../../server/src/components/Reference';
import ViewSectionsComponent from '../../server/src/components/Section';

export enum ComponentsUids {
	BLOCK_VIEW = 'dsentities.view',
	VIEW_REFERENCES = 'dsentities.references',
	VIEW_SECTIONS = 'dsentities.sections'
}

export const ComponentReferences = {
	[ComponentsUids.BLOCK_VIEW]: BlockViewComponent,
	[ComponentsUids.VIEW_REFERENCES]: BlockReferencesComponent,
	[ComponentsUids.VIEW_SECTIONS]: ViewSectionsComponent,
}

export enum DSEntitiesReferencesDefaultKeyNames {
	ID = 'id',
	NODES = 'Nodes',
	NODETYPES = 'NodeTypes',
	TAGS = 'Tags'
}

export const DSEntitiesReferencesDefaultKeys:string[] = [
	DSEntitiesReferencesDefaultKeyNames.ID as string,
	DSEntitiesReferencesDefaultKeyNames.NODES as string,
	DSEntitiesReferencesDefaultKeyNames.NODETYPES as string,
	DSEntitiesReferencesDefaultKeyNames.TAGS as string
]