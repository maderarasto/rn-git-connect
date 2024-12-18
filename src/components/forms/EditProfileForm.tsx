import {User} from "@src/api/types";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {View, StyleSheet} from "react-native";
import FormGroup from "@src/components/FormGroup";
import FormInputController from "@src/components/controllers/FormInputController";
import PrimaryButton from "@src/components/buttons/PrimaryButton";
import colors from "@src/utils/colors";

type ProfileFormData = {
  fullname: string
  location: string
  organization: string
  bio: string
  email: string
  websiteUrl: string
}

export type EditProfileFormProps = {
  user?: User
}

const EditProfileForm = ({
   user
 } : EditProfileFormProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      fullname: user?.fullname ?? '',
      location: user?.location ?? '',
      organization: user?.company ?? '',
      bio: user?.bio ?? '',
      email: user?.email ?? '',
      websiteUrl: user?.webUrl ?? '',
    }
  })

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  function onSubmit() {
    console.log('submit');
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <FormGroup title="Personal Information">
          <FormInputController
            name="fullname"
            control={control}
            rules={{ required: true }}
            label="Full name"
            errorText={errors.fullname ? 'Full name is required' : ''}
            containerStyle={styles.input} />
          <FormInputController
            name="location"
            control={control}
            label="Location"
            containerStyle={styles.input} />
          <FormInputController
            name="organization"
            control={control}
            label="Organization"
            containerStyle={styles.input} />
          <FormInputController
            name="bio"
            control={control}
            label="Bio"
            numberOfLines={3}
            textAlignVertical="top"
            multiline={true}
            containerStyle={styles.input} />
        </FormGroup>
        <FormGroup title="Contact Information">
          <FormInputController
            name="email"
            control={control}
            label="Email"
            containerStyle={styles.input} />
          <FormInputController
            name="websiteUrl"
            control={control}
            label="Website URL"
            containerStyle={styles.input} />
        </FormGroup>
      </View>
      <PrimaryButton
        text="Update profile"
        style={{ backgroundColor: colors.primary }}
        onPress={handleSubmit(onSubmit)} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },

  input: {
    marginBottom: 16,
  }
})

export default EditProfileForm;