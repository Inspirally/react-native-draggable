/**
 *  * https://github.com/tongyy/react-native-draggable
 * 
 */

import React, { Component } from 'react'
import
{
	PanResponder,
	Animated,
}
from 'react-native'


export default class Draggable extends Component
{
	static propTypes = {
		pressDragRelease: React.PropTypes.func,
		reverse: React.PropTypes.bool,
		lockX: React.PropTypes.bool,
		lockY: React.PropTypes.bool,
		positionX: React.PropTypes.number,
		positionY: React.PropTypes.number,
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
		super(props)
		const {
			pressDragRelease,
			reverse,
			lockX,
			lockY,
			positionX,
			positionY
		} = props
		this.reverse = reverse!=null ? reverse : false
		this.lockX = lockX==null ? false : lockX
		this.lockY = lockY==null ? false : lockY
		this.positionX = positionX==null ? 0 : positionX
		this.positionY = positionY==null ? 0 : positionY
		this.state = {
			pan: new Animated.ValueXY({x: this.positionX, y: this.positionY}),
			_value: {x: this.positionX, y: this.positionY}
		}

		this.panResponder = PanResponder.create({
			onPanResponderTerminationRequest: (evt, state) => false,
			onStartShouldSetPanResponder: (evt, state) => true,
			onStartShouldSetPanResponderCapture: (evt, state) => false,
			onMoveShouldSetPanResponder: (evt, gestureState) => true,
			onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
			onPanResponderGrant: (e, gestureState) => {
				if(this.reverse == false)
				{
					this.state.pan.setOffset({
						x: this.state._value.x,
						y: this.state._value.y
					})
					this.state.pan.setValue({x: 0, y: 0})
				}
			},
			onPanResponderMove: (e, gestureState) => {
				let x = this.state.pan.x
				let y = this.state.pan.y
				if (this.lockX)
					x = 0
				if (this.lockY)
					y = 0

				Animated.event([null, {
					dx: x,
					dy: y,
				}])(e, gestureState)
			},
			onPanResponderRelease: (e, gestureState) => {
				if(pressDragRelease)
				{
					pressDragRelease(e)
				}
				if(this.reverse == false)
				{
					this.state.pan.flattenOffset()
				}
				else {

					Animated.spring(
						this.state.pan,
						{toValue:{x:0,y:0}}
					).start()
				}
			}
		})
	}

	render()
	{
		return (
			<Animated.View
				onLayout={this.props.onLayout}
				{...this.panResponder.panHandlers}
				style={[
					this.props.style,
					this.state.pan.getLayout(),
				]}>
					{this.props.children}
			</Animated.View>
		)
	}
}
