import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Formik } from 'formik';
// import { signInWithEmailAndPassword } from 'firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, Text, Button } from 'react-native-ui-lib'
import { AuthenticatedUserContext } from '../providers';
import { View as RNView, TextInput, Logo, FormErrorMessage } from '../components';
import { Images, Colors, auth } from '../config';
import { useTogglePasswordVisibility } from '../hooks';
import { useLogin } from '../hooks/useData'
import { loginValidationSchema } from '../utils';

export const LoginScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const { getToken, getUser } = useLogin()
  const { passwordVisibility, handlePasswordVisibility, rightIcon } =
    useTogglePasswordVisibility();

  const handleLogin = async (values) => {
    setUser({})
    // const res = await getToken(values)
    // console.log(values, res, 'values')

    // const { username, password } = values;
    // signInWithEmailAndPassword(auth, username, password).catch(error =>
    //   setErrorState(error.message)
    // );
    // navigation.navigate('Tab')
  };
  return (
    <>
      <RNView isSafe style={styles.container}>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          {/* LogoContainer: consits app logo and screen title */}
          <View center paddingV-40>
            <Logo uri={Images.logo} />
            <Text text40 marginT-20>智慧病虫害</Text>
          </View>
          <Formik
            initialValues={{
              username: '',
              password: ''
            }}
            validationSchema={loginValidationSchema}
            onSubmit={values => handleLogin(values)}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur
            }) => (
              <>
                {/* Input fields */}
                <TextInput
                  name='username'
                  leftIconName='walk'
                  placeholder='输入用户名'
                  autoCapitalize='none'
                  textContentType='name'
                  autoFocus={true}
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                />
                <FormErrorMessage
                  error={errors.username}
                  visible={touched.username}
                />
                <TextInput
                  name='password'
                  leftIconName='key-variant'
                  placeholder='输入密码'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={passwordVisibility}
                  textContentType='password'
                  rightIcon={rightIcon}
                  handlePasswordVisibility={handlePasswordVisibility}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                <FormErrorMessage
                  error={errors.password}
                  visible={touched.password}
                />
                {/* Login button */}
                <View paddingT-30><Button disabled={errors.password || errors.username} label='登陆' borderRadius={4} style={{ height: 48 }} backgroundColor={Colors.primary} onPress={handleSubmit} /></View>
              </>
            )}
          </Formik>
        </KeyboardAwareScrollView>
      </RNView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 12
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 50
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.black,
    paddingTop: 20
  },
  footer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingBottom: 48,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.orange
  },
  button: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    backgroundColor: Colors.orange,
    padding: 10,
    borderRadius: 8
  },
  buttonText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '700'
  },
  borderlessButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
