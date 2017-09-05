/**
 *  * https://github.com/tongyy/react-native-draggable
 * 
 */

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Image,
	PanResponder,
	Animated,
	Dimensions,
	TouchableOpacity
} from 'react-native';


export default class Draggable extends Component
{
	static propTypes = {
		renderSize:React.PropTypes.number,
		imageSource:React.PropTypes.number,
		offsetX:React.PropTypes.number,
		offsetY:React.PropTypes.number,
		reverse:React.PropTypes.bool,
		pressDrag:React.PropTypes.func,
		pressDragRelease:React.PropTypes.func,
		longPressDrag:React.PropTypes.func,
		pressInDrag:React.PropTypes.func,
		pressOutDrag:React.PropTypes.func
	}

	componentWillMount()
	{
		if(this.reverse == false)
		{
			this.state.pan.addListener((c) =>
			{
				this.state._value = c
			})
		}
	}

	componentWillUnmount()
	{
		this.state.pan.removeAllListeners()
	}

	constructor(props)
	{
		super(props);
		const {
			pressDrag,
			pressDragRelease,
			longPressDrag,
			pressInDrag,
			pressOutDrag,
			imageSource,
			renderText,
			renderShape,
			renderSize,
			renderColor,
			offsetX,
			offsetY,
			reverse
		} = props
		this.pressDrag = pressDrag;
		this.pressInDrag = pressInDrag;
		this.pressOutDrag = pressOutDrag;
		this.longPressDrag = longPressDrag;
		this.renderSize = renderSize ? renderSize : 36;
		this.imageSource = imageSource;
		this.offsetX = offsetX!=null ? offsetX : 100;
		this.offsetY = offsetY!=null ? offsetY : 100;
		this.reverse = reverse!=null ? reverse : true;
		this.state = {
			pan:new Animated.ValueXY(), 
			_value:{x: 0, y: 0}
		};

		this.panResponder = PanResponder.create({    
			onMoveShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
			onPanResponderGrant: (e, gestureState) => {
				if(this.reverse == false)
				{
					console.log('x: ' + this.state._value.x)
					console.log('y: ' + this.state._value.y)
					this.state.pan.setOffset({
						x: this.state._value.x,
						y: this.state._value.y
					})
					this.state.pan.setValue({x: 0, y: 0})
				}
			},
			onPanResponderMove: Animated.event([null,{ 
				//dx:this.state.pan.x,
				dy:this.state.pan.y
			}]),
			onPanResponderRelease: (e, gestureState) => {
				console.log('onPanResponderRelease')
				console.log(e.nativeEvent)
				if(pressDragRelease)
				{
					console.log('pressDragRelease')
					pressDragRelease();
				}
				if(this.reverse == false)
				{
					console.log('release')
					console.log('x: ' + this.state._value.x)
					console.log('y: ' + this.state._value.y)
					this.state.pan.flattenOffset();
				}
				else {

					Animated.spring(            
						this.state.pan,         
						{toValue:{x:0,y:0}}     
					).start();
				}
			} 
		});
	}

	_positionCss(x,y)
	{
		let Window = Dimensions.get('window');
		return {
			zIndex:999,
			position: 'absolute',
			top: Window.height/2,
			//left: Window.width/2 - size+x,
		}
	}

	render()
	{
		return (
			<View
				style={
					this._positionCss(
						this.offsetX,
						this.offsetY
					)
				}>
				<Animated.View 
					{...this.panResponder.panHandlers}
					style={[
						{flex: 1},
						this.state.pan.getLayout(),
					]}>
					<TouchableOpacity 
						style={{
							flex: 1,
						}}
						onPress={this.pressDrag}
						onLongPress={this.longPressDrag}
						onPressIn={this.pressInDrag}
						onPressOut={this.pressOutDrag}
					>
						{this.props.children}
						{/*{touchableContent}*/}
					</TouchableOpacity>
				</Animated.View>
			</View>
		)
	}
}


