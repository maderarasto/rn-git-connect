import {Animated, ViewStyle} from "react-native";
import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react";

export type AnimationEffect = (
  | 'expand'
);

export type AnimationType = 'in' | 'out';

export type AnimatedViewProps = {
  animation: AnimationEffect
  duration?: number
  startAt?: 'mount' | 'none'
  children?: React.ReactNode
  style?: ViewStyle
};

export type AnimatedViewMethods = {
  animate: (type: AnimationType) => void
}

const initializeAnimationValues = (animation: AnimationEffect) => {
  let values: Record<string, Animated.Value> = {};

  if (animation === 'expand') {
    values = {
      opacity: useRef(new Animated.Value(0)).current,
      scaleY: useRef(new Animated.Value(0)).current,
    }
  }

  return values;
}

const resolveAnimationValues = (animation: AnimationEffect, type: AnimationType) => {
  let values: Record<string, number> = {};

  if (animation === 'expand') {
    values = {
      opacity: type === 'in' ? 1 : 0,
      scaleY: type === 'in' ? 1 : 0,
    }
  }

  return values;
}

const AnimatedView = forwardRef<AnimatedViewMethods, AnimatedViewProps>(({
  animation,
  duration = 300,
  startAt = 'none',
  children,
  style = {},
}: AnimatedViewProps, ref) => {
  const animationValues = initializeAnimationValues(animation);

  useEffect(() => {
    if (startAt === 'mount') {
      animateValues('in');
    }
  }, []);

  useImperativeHandle(ref, () => ({
    animate: (type: AnimationType) => {
      animateValues(type);
    }
  }))

  const resolveStyle = () => {
    const resolvedStyle: ViewStyle = {
      ...style
    };

    if (animation === 'expand') {
      resolvedStyle.opacity = animationValues.opacity;
      resolvedStyle.transformOrigin = 'top';
      resolvedStyle.transform = [{ scaleY: animationValues.scaleY }];
    }

    return resolvedStyle;
  }

  const animateValues = (type: AnimationType) => {
    const targetValues = resolveAnimationValues(animation, type);

    Object.entries(animationValues).forEach(([effect, value]) => {
      Animated.timing(value, {
        useNativeDriver: true,
        toValue: targetValues[effect],
        duration
      }).start();
    });
  }

  return (
    <Animated.View style={resolveStyle()}>
      {children}
    </Animated.View>
  )
});

export default AnimatedView;