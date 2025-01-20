import {
	type InputProps,
	InputRenderer,
	useForm,
} from '@strapi/admin/strapi-admin';
import {
	Button,
	Grid,
} from '@strapi/design-system';
import { Check } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { getTranslation } from '../utils/getTranslation';
import { TypeEntityProperties } from '../../../src/models/Type';

const SubmitButton = () => {

	const { formatMessage } = useIntl();
	const submitLabel: string = formatMessage({ id: 'EntityModal.form.submit', defaultMessage: 'Save' });
	const isSubmitting = useForm('SubmitButton', (state) => state.isSubmitting);
	const modified = useForm('SubmitButton', (state) => state.modified);

	return (
		<Button type="submit" startIcon={<Check />} disabled={isSubmitting || !modified}>
			{submitLabel}
		</Button>
	);
};


interface BaseFormProps { mode?: 'create' | 'edit' }

const BaseForm = ({ mode = 'create' }: BaseFormProps) => {

	const { formatMessage } = useIntl();

	const translatedForm = [
		{
			disabled: mode !== 'create',
			label: { id: getTranslation('EntityModal.form.label.label'), defaultMessage: 'Label' },
			name: TypeEntityProperties.LABEL,
			placeholder: { id: 'EntityModal.form.label.placeholder', defaultMessage: 'Insert an entity type name' },
			required: true,
			size: 12,
			type: 'string' as const,
		}
	].map((field:any) => ({
		...field,
		hint: field.hint ? formatMessage(field.hint) : undefined,
		label: formatMessage(field.label),
		placeholder: field.placeholder ? formatMessage(field.placeholder) : undefined,
	}));

	return (
		<Grid.Root gap={4}>
			{translatedForm.map(({ size, ...field }) => (
				<Grid.Item key={field.name} col={size} direction="column" alignItems="stretch">
					<FormRenderer {...field} />
				</Grid.Item>
			))}
		</Grid.Root>
	);
};

/* -------------------------------------------------------------------------------------------------
 * FormRenderer
 * -----------------------------------------------------------------------------------------------*/

const FormRenderer = (field: InputProps) => {
	switch (field.type) {
		default:
			return <InputRenderer {...field} />;
	}
};

export { BaseForm, SubmitButton };