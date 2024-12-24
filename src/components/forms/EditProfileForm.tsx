import {EditableUser, User} from "@src/api/types";
import {useForm} from "react-hook-form";
import {View, StyleSheet, Platform, ToastAndroid} from "react-native";
import FormGroup from "@src/components/FormGroup";
import FormInputController from "@src/components/controllers/FormInputController";
import PrimaryButton from "@src/components/buttons/PrimaryButton";
import colors from "@src/utils/colors";
import {useMutation} from "@tanstack/react-query";
import {useApi} from "@src/providers/ApiProvider";
import {ErrorData} from "@src/api/ApiClient";
import {useAuth} from "@src/providers/AuthProvider";
import {useRouter} from "expo-router";

type ProfileFormData = {
  name: string
  location: string
  company: string
  bio: string
  blog: string
}

export type EditProfileFormProps = {
  user?: User
}

const EditProfileForm = ({
   user
 } : EditProfileFormProps) => {
  const authContext = useAuth();
  const router = useRouter();
  const {api} = useApi();

  const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name ?? '',
      location: user?.location ?? '',
      company: user?.company ?? '',
      bio: user?.bio ?? '',
      blog: user?.blog ?? '',
    }
  })

  const mutation = useMutation<User, ErrorData, EditableUser>({
    mutationFn: (updateData) => {
      if (!api) {
        throw new Error("Missing api resolver!");
      }

      return api.updateAuthUser(updateData);
    },
    onSuccess: (user) => {
      authContext?.setUser(user);

      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
          `Your profile was updated successfully.`,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM
        );
      }

      router.back();
    },

    onError: () => {
      if (Platform.OS === 'android') {
          ToastAndroid.showWithGravity(
            'Something went wrong',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM
          );
        }
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    mutation.mutate(data);
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <FormGroup title="Personal Information">
          <FormInputController
            name="name"
            control={control}
            rules={{ required: true }}
            label="Full name"
            errorText={errors.name ? 'Full name is required' : ''}
            containerStyle={styles.input} />
          <FormInputController
            name="location"
            control={control}
            label="Location"
            containerStyle={styles.input} />
          <FormInputController
            name="company"
            control={control}
            label="Company"
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
          {/*<FormInputController*/}
          {/*  name="email"*/}
          {/*  control={control}*/}
          {/*  label="Email"*/}
          {/*  containerStyle={styles.input} />*/}
          <FormInputController
            name="blog"
            control={control}
            label="Blog"
            containerStyle={styles.input} />
        </FormGroup>
      </View>
      <PrimaryButton
        text="Save"
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