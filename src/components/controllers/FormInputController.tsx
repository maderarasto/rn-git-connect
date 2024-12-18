import TextEdit, {TextEditProps} from "@src/components/inputs/TextEdit";
import {Control, Controller, FieldValues, RegisterOptions} from "react-hook-form";

export type FormInputControllerProps = TextEditProps & {
  name: string
  control?: Control<any>
  rules?: Omit<RegisterOptions<FieldValues, any>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">
  defaultValue?: string
}

const FormInputController = ({
 name,
 control,
 rules,
 defaultValue = '',
 placeholder = '',
 ...props
} : FormInputControllerProps) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      // defaultValue={defaultValue}
      render={({ field }) => (
        <TextEdit
          value={field.value}
          placeholder={placeholder}
          onChangeText={field.onChange}
          // onBlur={field.onBlur}
          {...props} />
      )} />
  )
}

export default FormInputController;
