import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, CameraRoll, ImageBackground, Switch, ActivityIndicator, Modal, Alert, TouchableHighlight } from 'react-native';
import { RNCamera } from 'react-native-camera';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import { PermissionsAndroid } from 'react-native';

import {
  createStackNavigator,
  createDrawerNavigator,
} from 'react-navigation';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
}

class CameraTab extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      image: '',
      cameraType : 'back',
      mirrorMode : false,
      cameraIcons: 'camera-front',
      flashMode: 'off',
      flashIcons: 'flash-off',
      modalVisible: false,
      flash: 'off',
    }
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    })
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  takePicture = async function(camera) {
    const options = { quality: 0.5, base64: true };
    const data = await camera.takePictureAsync(options);
    CameraRoll.saveToCameraRoll(data.uri);
    this.setState({ image: data });
  }

  changeCameraType() {
    if (this.state.cameraType === 'back') {
      this.setState({
        cameraType: 'front',
        mirror: true,
        cameraIcons: 'camera-rear',
      });
    } else {
      this.setState({
        cameraType: 'back',
        mirror: false,
        cameraIcons: 'camera-front',
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={this.state.cameraType}
          mirrorImage={this.state.mirrorMode}
          flashMode={this.state.flashMode}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.warn(barcodes)
          }}
        >
          {({ camera }) => {
            return (
              <View style={{ flex: 0, flexDirection: 'row', margin: 20 }}>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={styles.capture} onPress={this.changeCameraType.bind(this)}>
                    <MaterialIcons name={this.state.cameraIcons} size={25} color='white' style={styles.button}/>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity onPress={() => this.takePicture(camera)} style={styles.capture}>
                    <MaterialIcons name='camera' size={50} color='white' style={styles.button}/>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                  <TouchableOpacity style={styles.capture} onPress={() => {this.setModalVisible(true)}}>
                    <MaterialIcons name='settings' size={25} color='white' style={styles.button}/>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
        </RNCamera>
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => { Alert.alert('save') }}>
          <View style={{ flex: 1, backgroundColor: 'gray' }}>
            <TouchableOpacity style={styles.capture} onPress={this.toggleFlash.bind(this)}>
              <Text style={styles.Text}> Flash Mode: {this.state.flash} </Text>
            </TouchableOpacity>
            <TouchableHighlight onPress={() => { this.setModalVisible(!this.state.modalVisible) }}>
              <MaterialIcons name='close' size={50} color='white' style={styles.button}/>
            </TouchableHighlight>
          </View>
        </Modal>
      </View>
    );
  }
}

let CameraStack = createStackNavigator({ CameraTab }, {
  navigationOptions: {
    header: null,
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    margin: 25,
  },
  button: {
    alignSelf: 'center',
  },
  Text: {
    fontSize: 20,
    color: 'white',
  },
})

export default CameraStack