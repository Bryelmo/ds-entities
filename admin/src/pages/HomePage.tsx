import * as React from 'react';
import {
	Page,
	useAPIErrorHandler,
	useNotification,
	useRBAC,
	Layouts,
} from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { getTranslation } from './../utils/getTranslation';
import { EntityTypeTable } from '../components/EntityTypeTable';
import { Typography } from '@strapi/design-system';
import { TypeEntity } from '../../../src/models/Type';
import typeEntityRequests from '../api/Type';
import { Flex } from '@strapi/design-system';
import { DSEntityTypes } from '../../../src/models/Entities';
import { RegionEntity } from '../../../src/models/Region';
import regionEntityRequests from '../api/Region';

const defaultTypeEntitiesState = { [DSEntityTypes.NODE]: [], [DSEntityTypes.BLOCK]: [], [DSEntityTypes.VIEW]: [] };

const Homepage = () => {

	const { formatMessage } = useIntl();
	const title: string = formatMessage({ id: getTranslation('plugin.name'), defaultMessage: 'DS Entities' });
	const subTitle: string = formatMessage({ id: getTranslation('Dashboard.subtitle'), defaultMessage: 'Configure and manage your entity types' });
	const nodeTypeTitle: string = formatMessage({ id: getTranslation('Dashboard.nodetype.title'), defaultMessage: 'Node types' });
	const nodeTypeDescription: string = formatMessage({ id: getTranslation('Dashboard.nodetype.description'), defaultMessage: 'Organize the DS Node entity in types. Configure and manage your node types entity with specific admin role persmissions.' });
	const blockTypeTitle: string = formatMessage({ id: getTranslation('Dashboard.blocktype.title'), defaultMessage: 'Block types' });
	const blockTypeDescription: string = formatMessage({ id: getTranslation('Dashboard.blocktype.description'), defaultMessage: 'Organize the DS Block entities in types. Configure and manage your block types entity.' });
	const viewTypeTitle: string = formatMessage({ id: getTranslation('Dashboard.viewtype.title'), defaultMessage: 'View types' });
	const viewTypeDescription: string = formatMessage({ id: getTranslation('Dashboard.viewtype.description'), defaultMessage: 'Organize the DS View entities in types. Configure and manage your view types entity.' });
	const regionTypeTitle: string = formatMessage({ id: getTranslation('Dashboard.regiontype.title'), defaultMessage: 'Block regions' });
	const regionTypeDescription: string = formatMessage({ id: getTranslation('Dashboard.regiontype.description'), defaultMessage: 'Organize your layout in regions fo DS Block entities. Configure and manage your regions.' });

	const [entityType, setEntityType] = React.useState<TypeEntity | RegionEntity>({} as any);
	const [typeEntities, setTypeEntities] = React.useState(defaultTypeEntitiesState);
	const [regionEntities, setRegionEntities] = React.useState<RegionEntity[]>([]);

	React.useEffect(() => {
		getTypes();
		getRegionTypes();
	}, [entityType]);

	const getTypes = () => {
		typeEntityRequests.get().then(response => {
			const typeEntities = {
				[DSEntityTypes.NODE]: response.data.filter((item: TypeEntity) => item.Reference === DSEntityTypes.NODE),
				[DSEntityTypes.BLOCK]: response.data.filter((item: TypeEntity) => item.Reference === DSEntityTypes.BLOCK),
				[DSEntityTypes.VIEW]: response.data.filter((item: TypeEntity) => item.Reference === DSEntityTypes.VIEW)
			}
			setTypeEntities(typeEntities)
		})
	};

	const getRegionTypes = () => { regionEntityRequests.get().then(response => { setRegionEntities(response.data) }) };

	const refresh = (entityType: TypeEntity | RegionEntity) => { setEntityType(entityType) }

	return (
		<Page.Main>
			<Layouts.Header title={title} subtitle={subTitle} />
			<Layouts.Content>
				<Typography variant="beta" textColor="neutral800">{nodeTypeTitle}</Typography><br></br>
				<Typography variant="omega" textColor="neutral800">{nodeTypeDescription}</Typography>
				<Flex direction="column" alignItems="stretch" gap={6}>
					<Flex direction="column" alignItems="stretch" gap={4} hasRadius paddingTop={2} paddingBottom={8} paddingRight={0} paddingLeft={0}>
						<EntityTypeTable
							entityTypes={typeEntities[DSEntityTypes.NODE]}
							type={DSEntityTypes.NODE}
							canUpdate={true}
							canDelete={true}
							onDeleteEntityType={refresh}
							onEditEntityType={refresh} />
					</Flex>
				</Flex>
			</Layouts.Content>
			<Layouts.Content>
				<Typography variant="beta" textColor="neutral800">{viewTypeTitle}</Typography><br></br>
				<Typography variant="omega" textColor="neutral800">{viewTypeDescription}</Typography>
				<Flex direction="column" alignItems="stretch" gap={6}>
					<Flex direction="column" alignItems="stretch" gap={4} hasRadius paddingTop={2} paddingBottom={8} paddingRight={0} paddingLeft={0}>
						<EntityTypeTable
							entityTypes={typeEntities[DSEntityTypes.VIEW]}
							type={DSEntityTypes.VIEW}
							canUpdate={true}
							canDelete={true}
							onDeleteEntityType={refresh}
							onEditEntityType={refresh} />
					</Flex>
				</Flex>
			</Layouts.Content>
			<Layouts.Content>
				<Typography variant="beta" textColor="neutral800">{blockTypeTitle}</Typography><br></br>
				<Typography variant="omega" textColor="neutral800">{blockTypeDescription}</Typography>
				<Flex direction="column" alignItems="stretch" gap={6}>
					<Flex direction="column" alignItems="stretch" gap={4} hasRadius paddingTop={2} paddingBottom={8} paddingRight={0} paddingLeft={0}>
						<EntityTypeTable
							entityTypes={typeEntities[DSEntityTypes.BLOCK]}
							type={DSEntityTypes.BLOCK}
							canUpdate={true}
							canDelete={true}
							onDeleteEntityType={refresh}
							onEditEntityType={refresh} />
					</Flex>
				</Flex>
			</Layouts.Content>
			<Layouts.Content>
				<Typography variant="beta" textColor="neutral800">{regionTypeTitle}</Typography><br></br>
				<Typography variant="omega" textColor="neutral800">{regionTypeDescription}</Typography>
				<Flex direction="column" alignItems="stretch" gap={6}>
					<Flex direction="column" alignItems="stretch" gap={4} hasRadius paddingTop={2} paddingBottom={8} paddingRight={0} paddingLeft={0}>
						<EntityTypeTable
							entityTypes={regionEntities}
							type={DSEntityTypes.REGION}
							canUpdate={true}
							canDelete={true}
							onDeleteEntityType={refresh}
							onEditEntityType={refresh} />
					</Flex>
				</Flex>
			</Layouts.Content>
		</Page.Main>
	);

};

export default Homepage;
